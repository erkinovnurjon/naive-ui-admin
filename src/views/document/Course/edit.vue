<template>
  <div class="p-4">
    <n-card v-if="loading" class="mb-6 flex justify-center items-center gap-3">
      <span>Yuklanmoqda...</span>
      <n-spin />
    </n-card>

    <n-card v-else class="shadow-md">
      <n-form @submit.prevent="submitCourse">
        <div class="space-y-6">
          <!-- Basic Information Section -->
          <div>
            <n-h5 class="font-bold mb-4">Asosiy ma'lumotlar</n-h5>
            <n-form-item label="Kurs nomlanishi" required>
              <n-input
                v-model:value="courseData.title"
                placeholder="Kurs nomlanishini kiriting"
                clearable
              />
            </n-form-item>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <n-form-item label="Kurs tavsifi">
                <n-input
                  v-model:value="courseData.details"
                  type="textarea"
                  placeholder="Kurs tavsifini yozing"
                  :autosize="{ minRows: 5 }"
                />
              </n-form-item>

              <n-form-item label="Kursni oldindan ko'rish rasmi">
                <n-upload
                  :show-file-list="false"
                  @change="handleFileUpload"
                  accept="image/*"
                >
                  <n-upload-dragger>
                    <div
                      v-if="getThumbnailUrl"
                      class="flex flex-col items-center"
                    >
                      <img
                        :src="getThumbnailUrl"
                        alt="Preview"
                        class="max-h-40 mb-2"
                      />
                      <n-button type="primary" size="small">
                        Rasmni almashtirish
                      </n-button>
                    </div>
                    <div v-else class="py-8">
                      <div class="text-gray-500">
                        Fayllarni bu yerga tashlang yoki
                        <span class="text-black font-medium"
                          >yuklash uchun bosing</span
                        >
                      </div>
                    </div>
                  </n-upload-dragger>
                </n-upload>
              </n-form-item>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <n-form-item label="Tilni tanlang">
                  <n-select
                    v-model:value="courseData.languageId"
                    :options="languageList"
                    label-field="text"
                    value-field="value"
                    filterable
                    placeholder="Tanlang"
                  />
                </n-form-item>
                <n-checkbox v-model:checked="courseData.isSequentialContent">
                  Kontent ketma-ketlikda ochilsin
                </n-checkbox>
              </div>

              <CourseSyllabus
                :items="courseData.courseSyllabuses || []"
                @update="handleSyllabusUpdate"
              />
            </div>
          </div>

          <!-- Course Topics Section -->
          <div>
            <n-h5 class="font-bold mb-4">Kurs mavzulari</n-h5>

            <n-collapse class="mb-3" accordion>
              <n-collapse-item
                v-for="(topic, topicIndex) in courseData.courseTopics"
                :key="topic.id || topicIndex"
                :title="topic.title || 'Yangi mavzu'"
                :name="topicIndex"
              >
                <template #header-extra>
                  <div class="flex gap-2">
                    <n-tag
                      v-if="topic.videoLessons.length > 0"
                      type="info"
                      size="small"
                    >
                      {{ topic.videoLessons.length }} Videolar
                    </n-tag>
                    <n-tag
                      v-if="topic.lessonTests.length > 0"
                      type="info"
                      size="small"
                    >
                      {{ topic.lessonTests.length }} Testlar
                    </n-tag>
                    <n-tag
                      v-if="topic.lessonResources.length > 0"
                      type="info"
                      size="small"
                    >
                      {{ topic.lessonResources.length }} Resurslar
                    </n-tag>
                    <n-tag
                      v-if="topic.lessonPractices.length > 0"
                      type="info"
                      size="small"
                    >
                      {{ topic.lessonPractices.length }} Topshiriqlar
                    </n-tag>
                  </div>
                </template>

                <n-tabs type="line" animated>
                  <n-tab-pane name="video" tab="Video">
                    <n-form-item label="Mavzu nomi" required>
                      <n-input
                        v-model:value="topic.title"
                        placeholder="Mavzu sarlavhasini kiriting"
                      />
                    </n-form-item>

                    <div class="mb-6">
                      <div class="flex justify-between items-center mb-4">
                        <n-h6 class="font-semibold m-0">Video darslar</n-h6>
                        <n-button
                          type="primary"
                          size="small"
                          @click="openVideoLessonModal(topicIndex)"
                        >
                          <template #icon>
                            <n-icon><AddIcon /></n-icon>
                          </template>
                          Video biriktirish
                        </n-button>
                      </div>

                      <n-list bordered v-if="topic.videoLessons.length > 0">
                        <n-list-item
                          v-for="(lesson, lessonIndex) in topic.videoLessons"
                          :key="lessonIndex + 'a'"
                        >
                          <div class="flex justify-between items-center w-full">
                            <div class="flex items-center gap-3">
                              <n-icon><PlayIcon /></n-icon>
                              <div class="flex flex-col">
                                <span class="text-sm font-medium">{{
                                  lesson.title || "Dars nomi"
                                }}</span>
                                <span class="text-xs text-gray-500">
                                  Davomiyligi:
                                  {{
                                    formatDuration(
                                      lesson.videoFiles[0].duration
                                    )
                                  }}
                                </span>
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <n-button
                                size="small"
                                @click="
                                  openVideoLessonModal(topicIndex, lessonIndex)
                                "
                              >
                                <template #icon>
                                  <n-icon><EditIcon /></n-icon>
                                </template>
                                Tahrirlash
                              </n-button>
                              <n-button
                                size="small"
                                type="error"
                                @click="
                                  removeVideoLesson(topicIndex, lessonIndex)
                                "
                              >
                                <template #icon>
                                  <n-icon><CloseIcon /></n-icon>
                                </template>
                              </n-button>
                            </div>
                          </div>
                        </n-list-item>
                      </n-list>
                      <n-empty
                        v-else
                        description="Hozircha video darslar qo'shilmagan"
                        class="py-4"
                      />
                    </div>
                  </n-tab-pane>

                  <n-tab-pane name="test" tab="Test">
                    <div class="mb-6">
                      <div class="flex justify-between items-center mb-4">
                        <n-h6 class="font-semibold m-0"
                          >Test haqida ma'lumot</n-h6
                        >
                        <n-button
                          type="primary"
                          size="small"
                          @click="openLessonTestModal(topicIndex)"
                        >
                          <template #icon>
                            <n-icon><BookIcon /></n-icon>
                          </template>
                          Test qo'shish
                        </n-button>
                      </div>

                      <n-list bordered v-if="topic.lessonTests.length > 0">
                        <n-list-item
                          v-for="(test, testIndex) in topic.lessonTests"
                          :key="test.id || testIndex"
                        >
                          <div class="w-full">
                            <div class="flex justify-between items-center mb-2">
                              <div class="space-y-2">
                                <div class="flex items-center gap-3">
                                  <n-icon><BookIcon /></n-icon>
                                  <span
                                    ><strong>Test nomi:</strong>
                                    {{ test.title }}</span
                                  >
                                </div>
                                <div class="flex items-center gap-3">
                                  <n-icon><GalleryIcon /></n-icon>
                                  <span
                                    ><strong>Savollar soni:</strong>
                                    {{ test.maxQuestionCount }} ta</span
                                  >
                                </div>
                                <div class="flex items-center gap-3">
                                  <n-icon><TimeIcon /></n-icon>
                                  <span
                                    ><strong>Ajratilgan vaqt:</strong> ({{
                                      test.totalDuration
                                    }}
                                    min)</span
                                  >
                                </div>
                              </div>
                              <div class="flex gap-2">
                                <n-button
                                  size="small"
                                  @click="
                                    openLessonTestModal(topicIndex, testIndex)
                                  "
                                >
                                  <template #icon>
                                    <n-icon><EditIcon /></n-icon>
                                  </template>
                                  Tahrirlash
                                </n-button>
                                <n-button
                                  size="small"
                                  type="error"
                                  @click="
                                    removeLessonTest(topicIndex, testIndex)
                                  "
                                >
                                  <template #icon>
                                    <n-icon><CloseIcon /></n-icon>
                                  </template>
                                </n-button>
                              </div>
                            </div>
                            <n-button
                              type="primary"
                              class="mt-2"
                              @click="goToResultPage(test)"
                            >
                              <template #icon>
                                <n-icon><ListIcon /></n-icon>
                              </template>
                              Natija
                            </n-button>
                          </div>
                        </n-list-item>
                      </n-list>
                      <n-empty
                        v-else
                        description="Hozircha hech qanday test qo'shilmagan"
                        class="py-4"
                      />
                    </div>
                  </n-tab-pane>

                  <n-tab-pane name="theory" tab="Nazariy qism">
                    <LessonReadings
                      :items="topic.lessonReadings || []"
                      @update="handleLessonReadingsUpdate(topicIndex, $event)"
                    />
                  </n-tab-pane>

                  <n-tab-pane name="resources" tab="Resurslar">
                    <LessonResources
                      :items="topic.lessonResources || []"
                      @update="handleLessonResourcesUpdate(topicIndex, $event)"
                    />
                  </n-tab-pane>

                  <n-tab-pane name="assignments" tab="Topshiriqlar">
                    <LessonPractices
                      :items="topic.lessonPractices || []"
                      @update="handleLessonPracticesUpdate(topicIndex, $event)"
                      :hasTests="
                        topic.lessonTests && topic.lessonTests.length > 0
                      "
                    />
                  </n-tab-pane>
                </n-tabs>

                <n-button
                  type="error"
                  size="small"
                  class="mt-4"
                  @click="removeTopic(topicIndex)"
                >
                  <template #icon>
                    <n-icon><TrashIcon /></n-icon>
                  </template>
                  Mavzuni olib tashlash
                </n-button>
              </n-collapse-item>
            </n-collapse>

            <n-button type="primary" class="mt-7" @click="addTopic">
              <template #icon>
                <n-icon><AddIcon /></n-icon>
              </template>
              Mavzu qo'shish
            </n-button>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <n-button
              :loading="saveLoading"
              type="success"
              attr-type="submit"
              class="min-w-32"
            >
              {{ courseId ? "Saqlash" : "Kurs yaratish" }}
            </n-button>
          </div>
        </div>
      </n-form>
    </n-card>

    <!-- Video Lesson Modal -->
    <n-modal
      v-model:show="showVideoModal"
      preset="card"
      :title="`Video dars qo'sish (Mavzu #${
        currentTopicIndex !== null ? currentTopicIndex + 1 : ''
      })`"
      style="width: 90%; max-width: 1200px"
      :bordered="false"
      size="huge"
    >
      <n-form>
        <n-form-item label="Nomlanishi" required>
          <n-input v-model:value="currentVideoLesson.title" />
        </n-form-item>

        <n-form-item label="Tavsif">
          <n-input
            v-model:value="currentVideoLesson.details"
            type="textarea"
            :autosize="{ minRows: 3 }"
          />
        </n-form-item>

        <n-collapse accordion class="mb-3">
          <n-collapse-item
            v-for="(mediaGroup, groupIndex) in currentVideoLesson.mediaGroups"
            :key="groupIndex"
            :title="`Media Guruh #${groupIndex + 1}`"
            :name="groupIndex"
          >
            <template #header-extra>
              <n-tag type="primary" size="small">
                {{ getUploadsCount(mediaGroup) }}
              </n-tag>
              <n-button
                v-if="groupIndex > 0"
                text
                type="error"
                size="small"
                @click.stop="removeMediaGroup(groupIndex)"
              >
                <template #icon>
                  <n-icon><CloseIcon /></n-icon>
                </template>
              </n-button>
            </template>

            <n-form-item label="Video dars" required>
              <n-upload
                :show-file-list="false"
                @change="(e) => handleVideoUpload(e, groupIndex)"
                accept="video/*"
              >
                <n-button>
                  <template #icon>
                    <n-icon><VideoCameraIcon /></n-icon>
                  </template>
                  Video yuklash
                </n-button>
              </n-upload>
              <n-text depth="3" class="text-sm">
                Asosiy video faylni yuklang (MP4, MOV va boshqalar)
              </n-text>

              <div
                v-if="mediaGroup.isVideoUploading"
                class="flex items-center gap-3 mt-3 justify-center"
              >
                <n-spin size="small" />
                <span>Video yuklanmoqda...</span>
              </div>

              <div
                v-else-if="mediaGroup.videoFiles"
                class="mt-3"
                v-for="(item, index) in mediaGroup.videoFiles"
                :key="index + 'video'"
              >
                <n-card>
                  <n-button
                    type="primary"
                    @click="goVideo(item)"
                    class="flex items-center gap-2"
                  >
                    <template #icon>
                      <n-icon><PlayIcon /></n-icon>
                    </template>
                    Videoni ko'rish uchun
                  </n-button>
                </n-card>
              </div>
            </n-form-item>
          </n-collapse-item>
        </n-collapse>

        <n-button
          type="primary"
          class="mt-4"
          @click="addMediaGroup"
          v-if="currentVideoLesson.mediaGroups.length < 5"
        >
          <template #icon>
            <n-icon><AddIcon /></n-icon>
          </template>
          Media guruh qo'shish
        </n-button>

        <div class="flex justify-end gap-3 mt-6">
          <n-button @click="showVideoModal = false"> Bekor qilish </n-button>
          <n-button
            type="primary"
            @click="saveVideoLesson"
            :disabled="!isVideoLessonValid"
            :loading="videoUploading"
          >
            Videoni saqlash
          </n-button>
        </div>
      </n-form>
    </n-modal>

    <!-- Lesson Test Modal -->
    <n-modal
      v-model:show="showTestModal"
      preset="card"
      :title="`Dars testini qo'shish (Mavzu #${
        currentTopicIndex !== null ? currentTopicIndex + 1 : ''
      })`"
      style="width: 90%; max-width: 1200px"
      :bordered="false"
      size="huge"
    >
      <n-form>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <n-form-item label="Nomlanishi" required>
            <n-input v-model:value="currentLessonTest.title" />
          </n-form-item>

          <n-form-item label="Test turi">
            <n-select
              v-model:value="currentLessonTest.testTypeId"
              :options="testTypeList"
              label-field="text"
              value-field="value"
              filterable
              placeholder="Tanlang"
            />
          </n-form-item>
        </div>

        <n-form-item label="Tavsif">
          <n-input
            v-model:value="currentLessonTest.details"
            type="textarea"
            :autosize="{ minRows: 3 }"
          />
        </n-form-item>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <n-form-item label="Maksimal Savollar" required>
            <n-input-number
              v-model:value="currentLessonTest.maxQuestionCount"
              :min="1"
              class="w-full"
            />
          </n-form-item>

          <n-form-item label="Maksimal ball">
            <n-input-number
              v-model:value="maxBallTest"
              disabled
              class="w-full"
            />
          </n-form-item>

          <n-form-item label="Tastdan o'tish chegarasi (foizda)" required>
            <n-input-number
              v-model:value="currentLessonTest.submissionLimit"
              :min="0"
              :max="100"
              class="w-full"
            />
          </n-form-item>

          <n-form-item label="Jami Davomiylik (daqiqa)" required>
            <n-input-number
              v-model:value="currentLessonTest.totalDuration"
              :min="1"
              class="w-full"
            />
          </n-form-item>

          <n-form-item label="Urinishlar soni" required>
            <n-input-number
              v-model:value="currentLessonTest.attemptCount"
              :min="1"
              class="w-full"
            />
          </n-form-item>

          <n-form-item>
            <n-checkbox v-model:checked="currentLessonTest.canRetry">
              Qayta urinishga ruxsat berish
            </n-checkbox>
          </n-form-item>
        </div>

        <n-form-item
          label="Maksimal urinishlar soni"
          v-if="currentLessonTest.canRetry"
        >
          <n-input-number
            v-model:value="currentLessonTest.maxRetryCount"
            :min="1"
            class="w-full"
          />
        </n-form-item>

        <n-form-item label="Test rasmi">
          <n-upload
            :show-file-list="false"
            @change="handleTestImageUpload"
            accept="image/*"
          >
            <n-button>
              <template #icon>
                <n-icon><ImageIcon /></n-icon>
              </template>
              Rasm yuklash
            </n-button>
          </n-upload>
          <n-text depth="3" class="text-sm">
            JPG yoki PNG formatidagi rasmlar
          </n-text>

          <div
            v-if="currentLessonTest.testImage || currentLessonTest.testImageId"
            class="mt-3"
          >
            <n-card>
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-3">
                  <n-icon><ImageIcon /></n-icon>
                  <span>
                    {{ currentLessonTest.testImage?.name || "Yuklangan rasm" }}
                  </span>
                </div>
                <n-button
                  text
                  type="error"
                  size="small"
                  @click="removeTestImage"
                >
                  <template #icon>
                    <n-icon><CloseIcon /></n-icon>
                  </template>
                </n-button>
              </div>
              <img
                :src="getTestImagePreview()"
                alt="Test rasmi"
                class="max-h-40 mt-2"
              />
            </n-card>
          </div>
        </n-form-item>

        <n-divider title-placement="left">Test Savollari</n-divider>

        <div class="flex justify-between items-center mb-4">
          <n-h6 class="font-semibold m-0">Test Savollari</n-h6>
          <div class="flex gap-3">
            <n-button
              type="success"
              size="small"
              @click="downloadShablon"
              class="flex items-center gap-1"
            >
              <template #icon>
                <n-icon><DownloadIcon /></n-icon>
              </template>
              Shablon yuklab olish
            </n-button>
            <n-upload
              :show-file-list="false"
              @change="addExcelQuestion"
              accept=".xlsx,.xls"
            >
              <n-button
                type="info"
                size="small"
                class="flex items-center gap-1"
              >
                <template #icon>
                  <n-icon><UploadIcon /></n-icon>
                </template>
                Test yuklash
              </n-button>
            </n-upload>
            <n-button
              type="primary"
              size="small"
              @click="addNewQuestion"
              class="flex items-center gap-1"
            >
              <template #icon>
                <n-icon><AddIcon /></n-icon>
              </template>
              Savol qo'shish
            </n-button>
          </div>
        </div>

        <n-collapse accordion>
          <n-collapse-item
            v-for="(question, qIndex) in currentLessonTest.lessonTestQuestions"
            :key="qIndex"
            :title="`Savol #${qIndex + 1}: ${
              question.questionText || 'Yangi savol'
            }`"
            :name="qIndex"
          >
            <n-form-item label="Savol Matni" required>
              <n-input v-model:value="question.questionText" />
            </n-form-item>

            <n-divider title-placement="left">Javoblar</n-divider>

            <div class="space-y-3 mb-4">
              <div
                v-for="(answer, aIndex) in question.lessonTestQuestionAnswers"
                :key="aIndex"
                class="flex items-center gap-3"
              >
                <n-input
                  v-model:value="answer.answerText"
                  placeholder="Javob matni"
                  class="flex-grow"
                />
                <n-checkbox v-model:checked="answer.isCorrect">
                  To'g'ri
                </n-checkbox>
                <n-button
                  text
                  type="error"
                  size="small"
                  @click="removeAnswer(qIndex, aIndex)"
                >
                  <template #icon>
                    <n-icon><CloseIcon /></n-icon>
                  </template>
                </n-button>
              </div>
            </div>

            <n-button
              type="primary"
              size="small"
              @click="addNewAnswer(qIndex)"
              class="mb-4"
            >
              <template #icon>
                <n-icon><AddIcon /></n-icon>
              </template>
              Javob qo'shish
            </n-button>

            <n-button type="error" size="small" @click="removeQuestion(qIndex)">
              <template #icon>
                <n-icon><TrashIcon /></n-icon>
              </template>
              Savolni olib tashlash
            </n-button>
          </n-collapse-item>
        </n-collapse>

        <n-empty
          v-if="currentLessonTest.lessonTestQuestions.length === 0"
          description="Hozircha savollar qo'shilmagan"
          class="py-4"
        />

        <div class="flex justify-end gap-3 mt-6">
          <n-button @click="showTestModal = false"> Bekor qilish </n-button>
          <n-button type="primary" @click="saveLessonTest">
            Testni saqlash
          </n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSelect,
  NCheckbox,
  NH5,
  NH6,
  NDivider,
  NCollapse,
  NCollapseItem,
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NTag,
  NEmpty,
  NModal,
  NUpload,
  NText,
  NSpin,
  NUploadDragger,
  NIcon,
  NInputNumber,
  useMessage,
} from "naive-ui";
import {
  Add as AddIcon,
  Trash as TrashIcon,
  Close as CloseIcon,
  Play as PlayIcon,
  Book as BookIcon,
  List as ListIcon,
  Videocam as VideoCameraIcon,
  Image as ImageIcon,
  Download as DownloadIcon,
  CloudUpload as UploadIcon,
  Time as TimeIcon,
  Images as GalleryIcon,
  Create as EditIcon,
} from "@vicons/ionicons5";

// Import your services and types
import CourseService from "@/service/document/course.service";
import MediaService from "@/service/others/media.service";
import ManualService from "@/service/others/manual.service";
import VideoFileService from "@/service/others/videofile.service";
import { useAppUrl } from "@/composables/useAppUrl";

import type {
  CourseData,
  CourseTopic,
  LessonTest,
  LessonTestQuestion,
  MediaGroup,
  VideoFile,
  VideoLesson,
  VideoLessonMaterial,
} from "./types";

import LessonReadings from "./LessonReadings.vue";
import LessonResources from "./LessonResources.vue";
import LessonPractices from "./LessonPractices.vue";
import CourseSyllabus from "./CourseSyllabus.vue";

const route = useRoute();
const router = useRouter();
const message = useMessage();
const { core_cdn } = useAppUrl();

const loading = ref(true);
const activeTopic = ref<number | null>(null);
const checkSave = ref(false);
const courseId = ref<number | null>(0);
const videoUploading = ref(false);
const languageList = ref<any>([]);
const saveLoading = ref(false);
const testTypeList = ref<any>([]);
const currentTopicIndex = ref<number | null>(null);
const showVideoModal = ref(false);
const showTestModal = ref(false);
const imagePreview = ref<string | null>(null);
const maxBallTest = ref(100);

const courseData = ref<CourseData>({
  title: null,
  details: null,
  isSequentialContent: false,
  thumbnailId: null,
  duration: 0,
  employeeId: 0,
  entityName: "",
  organizationId: 0,
  statusId: 0,
  languageId: null,
  avarageRating: 0,
  learnerCount: 0,
  state: null,
  topicCount: 0,
  lessonCount: 0,
  testCount: 0,
  courseTopics: [],
  courseSyllabuses: [],
});

const currentVideoLesson = ref<VideoLesson>({
  currentIndex: 0,
  title: "",
  details: "",
  duration: 0,
  orderNumber: 0,
  thumbnailId: null,
  videoFiles: [],
  videoLessonMaterials: [],
  materialFiles: [],
  thumbnailFile: null,
  mediaGroups: [
    {
      videoFile: null,
      thumbnailFile: null,
      thumbnailId: null,
      materialFiles: [],
      videoFiles: [],
      materialFileIds: [],
      isVideoUploading: false,
    },
  ],
  _editIndex: null,
});

const currentLessonTest = ref<LessonTest>({
  title: "",
  details: "",
  maxQuestionCount: 0,
  submissionLimit: 0,
  statusId: 0,
  testTypeId: 0,
  testThumbnailId: null,
  totalDuration: 0,
  maxRetryCount: null,
  attemptCount: null,
  canRetry: false,
  orderNumber: 0,
  lessonTestQuestions: [],
  _editIndex: null,
});

// Computed properties
const getThumbnailUrl = computed(() => {
  if (courseData.value.thumbnailId) {
    return `${core_cdn.value}/Media/Get?entityName=${courseData.value?.entityName}&fileId=${courseData.value.thumbnailId}`;
  }
  return imagePreview.value || courseData.value.thumbnailId;
});

const isVideoLessonValid = computed(() => {
  return (
    currentVideoLesson.value.title &&
    !videoUploading.value &&
    currentVideoLesson.value.orderNumber >= 0
  );
});

// Methods
const initializeCourseData = () => {
  courseData.value = {
    title: "",
    details: "",
    thumbnailId: "",
    duration: 0,
    state: "",
    employeeId: 0,
    organizationId: 0,
    entityName: "",
    statusId: 0,
    languageId: null,
    avarageRating: 0,
    learnerCount: 0,
    topicCount: 0,
    lessonCount: 0,
    testCount: 0,
    courseTopics: [],
    courseSyllabuses: [],
  };
};

const goToResultPage = (test: any) => {
  const id = route.params.courseId;
  router.push({
    name: "CourseTestResultPage",
    params: { id },
    query: {
      lessonTestId: test.id,
    },
  });
};

const createNewQuestion = (): LessonTestQuestion => ({
  questionText: "",
  questionDuration: 0,
  ownerId: 0,
  thumbnailId: null,
  lessonTestQuestionAnswers: [],
  mediaGroups: [],
  materialFiles: [],
  file: null,
});

const addNewQuestion = () => {
  if (!currentLessonTest.value.lessonTestQuestions) {
    currentLessonTest.value.lessonTestQuestions = [];
  }
  currentLessonTest.value.lessonTestQuestions.push(createNewQuestion());
};

const addExcelQuestion = async (data: any) => {
  const file = data.file?.file || data.file;

  if (!file || !(file instanceof File)) {
    console.error("No valid Excel file selected", file);
    return;
  }

  const formData = new FormData();
  formData.append("formFile", file);

  try {
    const res = await CourseService.ParseQuestions(formData);
    if (!currentLessonTest.value.lessonTestQuestions) {
      currentLessonTest.value.lessonTestQuestions = res.data;
    } else {
      currentLessonTest.value.lessonTestQuestions = [
        ...currentLessonTest.value.lessonTestQuestions,
        ...res.data,
      ];
    }
    message.success("Savollar muvaffaqiyatli yuklandi");
  } catch (err) {
    console.error("Fayl jo'natishda xato:", err);
    message.error("Fayl yuklashda xatolik yuz berdi");
  }
};

const goVideo = (item: any) => {
  if (checkSave.value == false) {
    message.error("Video ko'rish uchun avval kursni saqlang");
    return;
  }
  router.push({
    name: "CourseVideoViewPage",
    params: { id: route.params.id },
    query: {
      playlistId: item.playlistId,
    },
  });
};

const addMediaGroup = () => {
  currentVideoLesson.value.mediaGroups.push({
    videoFile: null,
    thumbnailFile: null,
    thumbnailId: null,
    materialFiles: [],
    videoFiles: [],
    materialFileIds: [],
    isVideoUploading: false,
  });
};

const removeMediaGroup = (index: number) => {
  currentVideoLesson.value.mediaGroups.splice(index, 1);
};

const getUploadsCount = (mediaGroup: MediaGroup): number => {
  let count = 0;
  if (mediaGroup.videoFile) count++;
  if (mediaGroup.thumbnailFile || mediaGroup.thumbnailId) count++;
  if (mediaGroup.materialFiles?.length) {
    count += mediaGroup.materialFiles.length;
  }
  return count;
};

const handleVideoUpload = async (data: any, groupIndex: number) => {
  const file = data.file?.file || data.file;

  if (!file || !(file instanceof File)) {
    console.error("No valid video file selected", file);
    return;
  }

  videoUploading.value = true;

  if (!currentVideoLesson.value.mediaGroups) {
    currentVideoLesson.value.mediaGroups = [];
  }

  // Initialize the specific media group if not exists
  if (!currentVideoLesson.value.mediaGroups[groupIndex]) {
    currentVideoLesson.value.mediaGroups[groupIndex] = {
      videoFile: null,
      thumbnailFile: null,
      thumbnailId: null,
      materialFiles: [],
      videoFiles: [],
      materialFileIds: [],
      isVideoUploading: false,
    };
  }

  currentVideoLesson.value.mediaGroups[groupIndex].videoFiles = [];
  currentVideoLesson.value.mediaGroups[groupIndex].isVideoUploading = true;
  currentVideoLesson.value.mediaGroups[groupIndex].videoFile = file;

  const formData = new FormData();
  formData.append("videoFile", file);

  try {
    const res = await VideoFileService.UploadVideo(formData);

    currentVideoLesson.value.mediaGroups[groupIndex].videoFiles?.push({
      fileName: res.data.fileName,
      playlistId: res.data.fileId,
      fileSize: res.data.fileSize,
      originalVideoId: res.data.originalVideoId,
      proccessId: res.data.proccessId,
      duration: res.data.videoDuration,
      segmentCount: res.data.segmentCount,
      fileExtension: file.name.split(".").pop() || "",
      statusId: 1,
      id: 0,
    });

    message.success("Muvaffaqiyatli yuklandi");
    checkSave.value = false; // Mark as unsaved since we have new changes
  } catch (error) {
    console.error("Video upload failed:", error);
    currentVideoLesson.value.mediaGroups[groupIndex].videoFile = null;
    message.error("Video yuklashda xatolik");
  } finally {
    currentVideoLesson.value.mediaGroups[groupIndex].isVideoUploading = false;
    videoUploading.value = false;
  }
};

const addNewAnswer = (questionIndex: number) => {
  const question = currentLessonTest.value.lessonTestQuestions[questionIndex];
  if (!question.lessonTestQuestionAnswers) {
    question.lessonTestQuestionAnswers = [];
  }

  question.lessonTestQuestionAnswers.push({
    answerText: "",
    isCorrect: false,
    ownerId: 0,
  });
};

const removeQuestion = (questionIndex: number) => {
  currentLessonTest.value.lessonTestQuestions.splice(questionIndex, 1);
};

const removeAnswer = (questionIndex: number, answerIndex: number) => {
  currentLessonTest.value.lessonTestQuestions[
    questionIndex
  ].lessonTestQuestionAnswers.splice(answerIndex, 1);
};

const fetchLanguageList = async () => {
  try {
    const response = await ManualService.LanguageSelectList();
    languageList.value = response;
  } catch (error) {
    console.error("Error fetching language list:", error);
    message.error("Tillarni yuklashda xatolik");
  }
};

const fetchTestTypeSelectList = async () => {
  try {
    const response = await ManualService.TestTypeSelectList();
    testTypeList.value = response;
  } catch (error) {
    console.error("Error fetching test type list:", error);
    message.error("Test turlarini yuklashda xatolik");
  }
};

const getCourse = async () => {
  loading.value = true;
  try {
    const id = route.params.id;

    if (id && id !== "0") {
      const response = await CourseService.Get(id);
      if (!response) {
        throw new Error("Course data not found");
      }
      courseData.value = response;
      checkSave.value = true;
    } else {
      const response = await CourseService.GetId();
      if (!response) {
        throw new Error("Course data not found");
      }
      courseData.value = response;
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    message.error("Kurs ma'lumotlarini yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = async (data: any) => {
  const file = data.file?.file || data.file;

  if (!file || !(file instanceof File)) {
    console.error("No valid file selected", file);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append("EntityName", "course");
  formData.append("File", file);

  try {
    const res = await MediaService.Upload(formData);
    if (res) {
      courseData.value.thumbnailId = res.data.fileId;
      courseData.value.entityName = "course";
      message.success("Rasm muvaffaqiyatli yuklandi");
    }
  } catch (error) {
    console.error("File upload error:", error);
    message.error("Rasm yuklashda xatolik");
  }
};

const submitCourse = async () => {
  if (!courseData.value.title || !courseData.value.title.trim()) {
    message.error("Kurs nomi bo'sh bo'lishi mumkin emas");
    return;
  }

  const invalidTopic = courseData.value.courseTopics?.find(
    (topic) => !topic.title || !topic.title.trim()
  );

  if (invalidTopic) {
    message.error(
      "Har bir mavzu uchun nom kiritilishi shart va bo'sh bo'lishi mumkin emas"
    );
    return;
  }

  saveLoading.value = true;
  try {
    if (courseId.value) {
      await CourseService.Update(courseData.value);
      message.success("Kurs muvaffaqiyatli yangilandi");
      router.push("/course/all");
    } else {
      await CourseService.Create(courseData.value);
      message.success("Kurs muvaffaqiyatli yaratildi");
      router.push("/course/all");
    }
  } catch (error) {
    console.error("Error saving course:", error);
    message.error("Kursni saqlashda xatolik");
  } finally {
    saveLoading.value = false;
    checkSave.value = true;
  }
};

const handleLessonReadingsUpdate = (topicIndex: number, updatedData: any) => {
  if (!courseData.value.courseTopics) return;

  courseData.value.courseTopics[topicIndex].lessonReadings = [
    ...courseData.value.courseTopics[topicIndex].lessonReadings.filter(
      (item: any) => item.id !== updatedData.id
    ),
    updatedData,
  ];
};

const handleLessonResourcesUpdate = (topicIndex: number, updatedData: any) => {
  if (!courseData.value.courseTopics) return;

  courseData.value.courseTopics[topicIndex].lessonResources = [
    ...courseData.value.courseTopics[topicIndex].lessonResources.filter(
      (item: any) => item.id !== updatedData.id
    ),
    updatedData,
  ];
};

const handleLessonPracticesUpdate = (topicIndex: number, updatedData: any) => {
  if (!courseData.value.courseTopics) return;

  courseData.value.courseTopics[topicIndex].lessonPractices = [
    ...courseData.value.courseTopics[topicIndex].lessonPractices.filter(
      (item: any) => item.id !== updatedData.id
    ),
    updatedData,
  ];
};

const handleSyllabusUpdate = (updatedItem: any | null) => {
  if (updatedItem) {
    courseData.value.courseSyllabuses = [updatedItem];
  } else {
    courseData.value.courseSyllabuses = [];
  }
};

const handleTestImageUpload = async (data: any) => {
  const file = data.file?.file || data.file;

  if (!file || !(file instanceof File)) {
    console.error("No valid image file selected", file);
    return;
  }

  currentLessonTest.value.testImage = file;

  const formData = new FormData();
  formData.append("EntityName", "lessonTest");
  formData.append("File", file);

  try {
    const res = await MediaService.Upload(formData);
    if (res && res.data) {
      currentLessonTest.value.testImageId = res.data.fileId;
      message.success("Test rasmi muvaffaqiyatli yuklandi");
    }
  } catch (error) {
    console.error("Image upload error:", error);
    currentLessonTest.value.testImage = null;
    message.error("Test rasmini yuklashda xatolik");
  }
};

const removeTestImage = () => {
  if (
    currentLessonTest.value.testImage &&
    currentLessonTest.value.testImage instanceof File
  ) {
    URL.revokeObjectURL(URL.createObjectURL(currentLessonTest.value.testImage));
  }

  currentLessonTest.value.testImage = null;
  currentLessonTest.value.testImageId = null;
};

const getTestImagePreview = (): string => {
  if (
    currentLessonTest.value.testImage &&
    currentLessonTest.value.testImage instanceof File
  ) {
    return URL.createObjectURL(currentLessonTest.value.testImage);
  }

  if (currentLessonTest.value.testImageId) {
    return `${core_cdn.value}/Media/Get?entityName=lessonTest&fileId=${currentLessonTest.value.testImageId}`;
  }

  return "";
};

const addTopic = () => {
  const newTopic: CourseTopic = {
    title: "",
    videoLessons: [],
    lessonTests: [],
    lessonReadings: [],
    lessonResources: [],
    lessonPractices: [],
  };

  if (!courseData.value.courseTopics) {
    courseData.value.courseTopics = [];
  }

  courseData.value.courseTopics.push(newTopic);
  activeTopic.value = courseData.value.courseTopics.length - 1;
};

const removeTopic = (index: number) => {
  if (!courseData.value.courseTopics) return;
  courseData.value.courseTopics.splice(index, 1);
};

const openVideoLessonModal = (
  topicIndex: number,
  lessonIndex: number | null = null
) => {
  if (!courseData.value.courseTopics) return;

  const topic = courseData.value.courseTopics[topicIndex];
  if (!topic.videoLessons) topic.videoLessons = [];

  currentTopicIndex.value = topicIndex;

  if (lessonIndex !== null && topic.videoLessons[lessonIndex]) {
    const lessonToEdit = JSON.parse(
      JSON.stringify(topic.videoLessons[lessonIndex])
    );

    const mediaGroups = lessonToEdit.mediaGroups?.length
      ? lessonToEdit.mediaGroups.map((group: any) => ({
          ...group,
          videoFile: null,
          thumbnailFile: null,
          materialFiles: [],
          isVideoUploading: false,
          materialFileIds: group.materialFileIds || [],
          videoFiles: group.videoFiles || [],
        }))
      : [
          {
            videoFiles: lessonToEdit.videoFiles || [],
            thumbnailId: lessonToEdit.thumbnailId || null,
            materialFileIds: (lessonToEdit.videoLessonMaterials || []).map(
              (m: any) => ({
                fileId: m.fileId,
                fileName: m.fileName,
                fileSize: m.fileSize,
                fileExtension: m.fileExtension,
              })
            ),
            videoFile: null,
            thumbnailFile: null,
            materialFiles: [],
            isVideoUploading: false,
          },
        ];

    currentVideoLesson.value = {
      ...lessonToEdit,
      _editIndex: lessonIndex,
      currentIndex: lessonToEdit.currentIndex || lessonIndex + 1,
      mediaGroups,
    };
  } else {
    currentVideoLesson.value = {
      currentIndex: 0,
      title: "",
      details: "",
      duration: 0,
      orderNumber: topic.videoLessons.length + 1,
      thumbnailId: null,
      videoFiles: [],
      videoLessonMaterials: [],
      mediaGroups: [
        {
          videoFile: null,
          thumbnailFile: null,
          thumbnailId: null,
          materialFiles: [],
          videoFiles: [],
          materialFileIds: [],
          isVideoUploading: false,
        },
      ],
      _editIndex: null,
    };
  }

  showVideoModal.value = true;
};

const saveVideoLesson = async () => {
  if (currentTopicIndex.value === null || !courseData.value.courseTopics) {
    message.error("Mavzu tanlanmagan");
    return;
  }

  const topic = courseData.value.courseTopics[currentTopicIndex.value];

  if (!topic.videoLessons) {
    topic.videoLessons = [];
  }

  if (
    !currentVideoLesson.value.title ||
    !currentVideoLesson.value.title.trim()
  ) {
    message.error("Mavzu nomi bo'sh yoki faqat probel bo'lishi mumkin emas");
    return;
  }

  const videoFiles: VideoFile[] = [];
  const videoLessonMaterials: VideoLessonMaterial[] = [];

  currentVideoLesson.value.mediaGroups.forEach((group, index) => {
    if (group.videoFiles && group.videoFiles.length > 0) {
      videoFiles.push(group.videoFiles[group.videoFiles.length - 1]);
    }

    if (group.materialFileIds) {
      group.materialFileIds.forEach((material) => {
        videoLessonMaterials.push({
          fileId: material.fileId,
          fileName: material.fileName,
          fileSize: material.fileSize,
          fileExtension: material.fileExtension.split("/").pop() || "",
          details: "",
          orderNumber: videoLessonMaterials.length + 1,
          ownerId: 0,
        });
      });
    }
  });

  const updatedLesson = {
    ...currentVideoLesson.value,
    videoFiles,
    videoLessonMaterials,
    thumbnailId: currentVideoLesson.value.mediaGroups[0]?.thumbnailId || null,
  };

  const editIndex = (currentVideoLesson.value as any)._editIndex;

  if (editIndex !== null && editIndex !== undefined) {
    topic.videoLessons[editIndex] = updatedLesson;
  } else {
    updatedLesson.currentIndex =
      (topic.videoLessons.length > 0
        ? Math.max(...topic.videoLessons.map((l) => l.currentIndex || 0))
        : 0) + 1;
    topic.videoLessons.push(updatedLesson);
  }

  checkSave.value = true;
  showVideoModal.value = false;
  message.success("Video dars muvaffaqiyatli saqlandi");
};

const removeVideoLesson = (topicIndex: number, lessonIndex: number) => {
  if (
    !courseData.value.courseTopics ||
    !courseData.value.courseTopics[topicIndex]?.videoLessons
  )
    return;

  courseData.value.courseTopics[topicIndex].videoLessons.splice(lessonIndex, 1);
  message.success("Video dars olib tashlandi");
};

const openLessonTestModal = (
  topicIndex: number,
  testIndex: number | null = null
) => {
  if (!courseData.value.courseTopics) return;

  const topic = courseData.value.courseTopics[topicIndex];

  if (hasPractices(topicIndex)) {
    message.error("Bu mavzuda topshiriqlar mavjud, test qo'sha olmaysiz");
    return;
  }

  if (topic.lessonTests && topic.lessonTests.length > 0 && testIndex === null) {
    message.error(
      "Siz faqat bitta test yarata olasiz. Yangi test qo'shish uchun avval mavjud testni o'chiring."
    );
    return;
  }

  if (!topic.lessonTests) topic.lessonTests = [];

  currentTopicIndex.value = topicIndex;

  if (testIndex !== null && topic.lessonTests[testIndex]) {
    const testToEdit = JSON.parse(JSON.stringify(topic.lessonTests[testIndex]));
    currentLessonTest.value = {
      ...testToEdit,
      _editIndex: testIndex,
      testImage: null,
    };
  } else {
    currentLessonTest.value = {
      title: "",
      details: "",
      maxQuestionCount: 0,
      submissionLimit: 0,
      statusId: 0,
      testTypeId: 0,
      testThumbnailId: null,
      totalDuration: 0,
      canRetry: false,
      orderNumber: topic.lessonTests.length + 1,
      lessonTestQuestions: [],
      _editIndex: null,
    };
  }

  showTestModal.value = true;
};

const saveLessonTest = async () => {
  if (currentTopicIndex.value === null || !courseData.value.courseTopics) {
    message.error("Mavzu tanlanmagan");
    return;
  }

  if (!currentLessonTest.value.title || !currentLessonTest.value.title.trim()) {
    message.error("Test nomi bo'sh yoki faqat probel bo'lishi mumkin emas");
    return;
  }

  const questions = currentLessonTest.value.lessonTestQuestions || [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    if (!question.questionText || !question.questionText.trim()) {
      message.error(`Savol #${i + 1} matni bo'sh`);
      return;
    }

    const answers = question.lessonTestQuestionAnswers || [];
    if (answers.length === 0) {
      message.error(`Savol #${i + 1} uchun javoblar yo'q`);
      return;
    }

    for (let j = 0; j < answers.length; j++) {
      const answer = answers[j];
      if (!answer.answerText || !answer.answerText.trim()) {
        message.error(`Savol #${i + 1} - Javob #${j + 1} matni bo'sh`);
        return;
      }
    }

    const hasCorrectAnswer = answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      message.error(`Savol #${i + 1} uchun to'g'ri javob belgilanmagan`);
      return;
    }
  }

  const topic = courseData.value.courseTopics[currentTopicIndex.value];
  if (!topic.lessonTests) topic.lessonTests = [];

  if (
    currentLessonTest.value.testImage &&
    !currentLessonTest.value.testImageId
  ) {
    try {
      const formData = new FormData();
      formData.append("EntityName", "lessonTest");
      formData.append("File", currentLessonTest.value.testImage);

      const res = await MediaService.Upload(formData);
      if (res && res.data) {
        currentLessonTest.value.testImageId = res.data.fileId;
      }
    } catch (error) {
      console.error("Test rasmini yuklashda xato:", error);
      message.error("Test rasmini yuklashda xatolik");
      return;
    }
  }

  const { _editIndex, ...testData } = currentLessonTest.value;

  if (_editIndex !== null && _editIndex !== undefined) {
    topic.lessonTests[_editIndex] = testData;
  } else {
    topic.lessonTests.push(testData);
  }

  showTestModal.value = false;
  message.success("Test muvaffaqiyatli saqlandi");
};

const removeLessonTest = (topicIndex: number, testIndex: number) => {
  if (
    !courseData.value.courseTopics ||
    !courseData.value.courseTopics[topicIndex]?.lessonTests
  )
    return;

  courseData.value.courseTopics[topicIndex].lessonTests.splice(testIndex, 1);
  message.success("Test olib tashlandi");
};

const downloadShablon = async () => {
  try {
    const fileBlob = await MediaService.Get(
      "templates",
      "3a9a68dc-a50a-4580-a06a-fd7d537b27c0"
    );

    const link = document.createElement("a");
    const url = window.URL.createObjectURL(fileBlob);
    link.href = url;
    link.download = "Test_Savollari_Shabloni.xlsx";
    link.click();

    window.URL.revokeObjectURL(url);
    message.success("Shablon yuklab olindi");
  } catch (error) {
    console.log("Fayl yuklanishida xato:", error);
    message.error("Shablon yuklashda xatolik");
  }
};

const formatDuration = (seconds: any) => {
  if (!seconds || seconds === 0) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const hasPractices = (topicIndex: number): boolean => {
  if (!courseData.value.courseTopics) return false;
  const topic = courseData.value.courseTopics[topicIndex];

  return (
    topic.lessonPractices &&
    topic.lessonPractices.some(
      (practice: any) => practice.fileName || practice.fileId
    )
  );
};

onMounted(() => {
  if (route.params.id) {
    courseId.value = parseInt(route.params.id as string);
    getCourse();
  } else {
    initializeCourseData();
  }
  fetchLanguageList();
  fetchTestTypeSelectList();
});

onBeforeRouteLeave(() => {
  showVideoModal.value = false;
  showTestModal.value = false;
});
</script>

<style scoped>
/* You can add custom styles here if needed */
.n-card {
  margin-bottom: 1.5rem;
}

.n-h5,
.n-h6 {
  margin-bottom: 1rem;
}

.n-form-item {
  margin-bottom: 1rem;
}

.n-tag {
  margin-right: 0.5rem;
}

.n-list-item {
  padding: 0.75rem 1rem;
}

.n-empty {
  padding: 2rem 0;
}

.n-upload-dragger {
  padding: 1.5rem;
}

.n-button {
  margin-right: 0.5rem;
}

.n-collapse-item__header-main {
  flex-grow: 1;
}

.n-collapse-item__header-extra {
  display: flex;
  align-items: center;
}

.n-tabs {
  margin-top: 1rem;
}

.n-divider {
  margin: 1rem 0;
}

.n-upload {
  width: 100%;
}

.n-upload-trigger {
  width: 100%;
}

.n-input-number {
  width: 100%;
}
</style>
