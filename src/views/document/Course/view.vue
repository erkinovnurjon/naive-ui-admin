<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <n-grid cols="1 m:3" responsive="screen" :x-gap="24" :y-gap="24">
      <!-- Main Content -->
      <n-grid-item span="1 m:2">
        <n-card :bordered="false" embedded class="shadow-sm">
          <!-- Video Section -->
          <div class="video-section">
            <!-- Processing Message -->
            <div
              v-if="processingMessage"
              class="processing-container bg-blue-50 rounded-lg p-8"
            >
              <n-result status="info" size="large">
                <template #icon>
                  <div class="flex justify-center">
                    <n-spin size="large" />
                  </div>
                </template>
                <template #header>
                  <n-text strong>Video qayta ishlanmoqda</n-text>
                </template>
                <template #footer>
                  <n-text depth="3">{{ processingMessage }}</n-text>
                </template>
              </n-result>
            </div>

            <!-- Video Player -->
            <div
              v-else-if="currentVideoSrc && currentVideo"
              class="video-player-wrapper aspect-video w-full rounded-lg overflow-hidden bg-black"
            >
              <Player
                :show-is-short="false"
                :url="currentVideoSrc"
                @get-active-chunk="collectActiveChunk"
                ref="videoElement"
                @playing="handleVideoEvent('playing', $event)"
                @paused="handleVideoEvent('paused', $event)"
                @exit="handleVideoEvent('exit', $event)"
                @ended="handleVideoEvent('ended', $event)"
                @progressed="handleVideoEvent('progressed', $event)"
              />
            </div>

            <!-- No Video Placeholder -->
            <div
              v-else
              class="no-video-container bg-gray-50 rounded-lg p-12 text-center"
            >
              <n-empty description="Video qo'shilmagan" size="large">
                <template #icon>
                  <n-icon size="64" color="#d4d4d8">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h5v2h8v-2h5c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 12H3V5h18v10zM14 10l-2.5 1.8L9 10v4l2.5-1.8L14 14V10z"
                      />
                    </svg>
                  </n-icon>
                </template>
                <template #extra>
                  <n-text depth="3">
                    Ushbu kurs uchun video yuklash kerak
                  </n-text>
                </template>
              </n-empty>
            </div>
          </div>

          <!-- Course Information -->
          <n-divider />

          <n-space vertical size="large">
            <!-- Title and Description -->
            <div>
              <n-h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ videoData?.title || "Course Title" }}
              </n-h2>

              <!-- Current Video Title -->
              <div v-if="currentVideo" class="mb-4">
                <n-text strong class="text-lg text-green-600">
                  Joriy dars: {{ currentVideo.title }}
                </n-text>
              </div>

              <div v-if="videoData.details" class="course-description mb-6">
                <n-scrollbar style="max-height: 200px">
                  <div
                    v-html="videoData.details"
                    class="prose prose-sm max-w-none text-gray-700"
                  ></div>
                </n-scrollbar>
              </div>
              <div v-else class="mb-6">
                <n-empty description="Kurs tavsifi kiritilmagan" size="small" />
              </div>
            </div>

            <!-- Course Statistics -->
            <n-card title="Kurs ma'lumotlari" size="small" embedded>
              <n-grid cols="2 s:4" responsive="screen" :x-gap="16" :y-gap="16">
                <!-- Course Level -->
                <n-grid-item>
                  <div
                    class="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white"
                  >
                    <div class="bg-white/20 p-2 rounded-full">
                      <n-icon color="white" size="20">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"
                          />
                        </svg>
                      </n-icon>
                    </div>
                    <div>
                      <div class="text-xs opacity-90">Kurs darajasi</div>
                      <div class="font-semibold">Boshlang'ich</div>
                    </div>
                  </div>
                </n-grid-item>

                <!-- Duration -->
                <n-grid-item>
                  <div
                    class="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white"
                  >
                    <div class="bg-white/20 p-2 rounded-full">
                      <n-icon color="white" size="20">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M12,2A10,10 0,0,0 2,12A10,10 0,0,0 12,22A10,10 0,0,0 22,12A10,10 0,0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"
                          />
                        </svg>
                      </n-icon>
                    </div>
                    <div>
                      <div class="text-xs opacity-90">Davomiyligi</div>
                      <div class="font-semibold">
                        {{ totalCourseDuration }}
                      </div>
                    </div>
                  </div>
                </n-grid-item>

                <!-- Total Topics -->
                <n-grid-item>
                  <div
                    class="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white"
                  >
                    <div class="bg-white/20 p-2 rounded-full">
                      <n-icon color="white" size="20">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0,0,0 5,21H19A2,2 0,0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"
                          />
                        </svg>
                      </n-icon>
                    </div>
                    <div>
                      <div class="text-xs opacity-90">Jami mavzular</div>
                      <div class="font-semibold">
                        {{ videoData?.courseTopics?.length || 0 }}
                      </div>
                    </div>
                  </div>
                </n-grid-item>

                <!-- Students -->
                <n-grid-item>
                  <div
                    class="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white"
                  >
                    <div class="bg-white/20 p-2 rounded-full">
                      <n-icon color="white" size="20">
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 22,15.33 22,18V20H10V18C10,15.33 13.33,14 16,14Z"
                          />
                        </svg>
                      </n-icon>
                    </div>
                    <div>
                      <div class="text-xs opacity-90">O'quvchilar</div>
                      <div class="font-semibold">
                        {{ videoData.learnerCount || 0 }}
                      </div>
                    </div>
                  </div>
                </n-grid-item>
              </n-grid>
            </n-card>
          </n-space>
        </n-card>
      </n-grid-item>

      <!-- Sidebar -->
      <n-grid-item span="1 m:1">
        <n-card :bordered="false" embedded class="h-full bg-white shadow-sm">
          <!-- Course Topics -->
          <div v-if="videoData.courseTopics?.length > 0">
            <div class="flex items-center justify-between mb-4">
              <n-h3 class="text-lg font-semibold text-gray-800 m-0">
                Kurs mavzulari
              </n-h3>
              <n-tag size="small" type="info">
                {{ currentLessonIndex + 1 }} / {{ totalLessonsCount }}
              </n-tag>
            </div>

            <n-collapse
              v-model:expanded-names="expandedTopics"
              class="bg-transparent"
            >
              <n-collapse-item
                v-for="(topic, topicIndex) in videoData.courseTopics"
                :key="topic.id"
                :title="topic.title"
                :name="topic.id"
              >
                <template #header>
                  <div class="flex items-center w-full py-1 gap-3">
                    <n-avatar
                      :size="28"
                      color="#18a058"
                      class="text-xs font-bold shrink-0"
                    >
                      {{ topicIndex + 1 }}
                    </n-avatar>
                    <n-text strong class="flex-1 text-sm leading-tight">
                      {{ topic.title }}
                    </n-text>
                    <n-text depth="3" class="text-xs shrink-0">
                      {{ topic.videoLessons?.length || 0 }} dars
                    </n-text>
                  </div>
                </template>

                <!-- Lessons List -->
                <n-list
                  hoverable
                  clickable
                  class="lessons-list mt-2 bg-gray-50 rounded-lg overflow-hidden"
                >
                  <n-list-item
                    v-for="(lesson, lessonIndex) in topic.videoLessons"
                    :key="lesson.id"
                    @click="selectLesson(lesson)"
                    :class="[
                      'lesson-item border-b border-gray-100 last:border-b-0 transition-all duration-200 cursor-pointer hover:bg-white',
                      {
                        'active-lesson bg-green-50 border-l-4 border-l-green-500':
                          currentVideo?.id === lesson.id,
                        'opacity-60': lesson.isLocked,
                      },
                    ]"
                  >
                    <template #prefix>
                      <div class="flex items-center gap-2">
                        <span
                          class="text-xs text-gray-500 font-mono w-6 text-center"
                        >
                          {{ String(lessonIndex + 1).padStart(2, "0") }}
                        </span>
                        <n-icon
                          :color="
                            currentVideo?.id === lesson.id
                              ? '#18a058'
                              : '#909399'
                          "
                          size="16"
                        >
                          <svg
                            v-if="
                              currentVideo?.id === lesson.id && isVideoPlaying
                            "
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M14,19H18V5H14M6,19H10V5H6V19Z"
                            />
                          </svg>
                          <svg v-else viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M8,5.14V19.14L19,12.14L8,5.14Z"
                            />
                          </svg>
                        </n-icon>
                      </div>
                    </template>

                    <template #suffix>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span
                          class="text-xs text-gray-500 font-mono whitespace-nowrap"
                        >
                          {{
                            lesson.videoFiles?.[0]?.duration
                              ? formatDuration(lesson.videoFiles[0].duration)
                              : "00:00"
                          }}
                        </span>
                        <n-icon
                          v-if="lesson.isLocked"
                          size="12"
                          color="#f0a020"
                          class="shrink-0"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12,17A2,2 0,0,0 14,15C14,13.89 13.1,13 12,13A2,2 0,0,0 10,15A2,2 0,0,0 12,17M18,8A2,2 0,0,1 20,10V20A2,2 0,0,1 18,22H6A2,2 0,0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0,0,1 12,1A5,5 0,0,1 17,6V8H18M12,3A3,3 0,0,0 9,6V8H15V6A3,3 0,0,0 12,3Z"
                            />
                          </svg>
                        </n-icon>
                      </div>
                    </template>

                    <n-thing>
                      <template #header>
                        <n-text
                          :type="
                            currentVideo?.id === lesson.id
                              ? 'success'
                              : 'default'
                          "
                          :strong="currentVideo?.id === lesson.id"
                          class="text-sm leading-tight break-words"
                        >
                          {{ lesson.title }}
                        </n-text>
                      </template>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-collapse-item>
            </n-collapse>
          </div>

          <!-- No Topics Message -->
          <div v-else class="no-topics-wrapper p-8 text-center">
            <n-empty
              description="Hozircha kursda mavzular mavjud emas"
              size="medium"
            >
              <template #icon>
                <n-icon size="48" color="#d4d4d8">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0,0,0 5,21H19A2,2 0,0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"
                    />
                  </svg>
                </n-icon>
              </template>
              <template #extra>
                <n-text depth="3">Tez orada mavzular qo'shiladi</n-text>
              </template>
            </n-empty>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { useAppUrl } from "@/composables/useAppUrl";
import { useLocalStorage } from "@/composables/useStorage";
import Player from "@/features/player/Player.vue";
import CourseService from "@/service/document/course.service";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  NGrid,
  NGridItem,
  NCard,
  NSpace,
  NH2,
  NH3,
  NIcon,
  NCollapse,
  NCollapseItem,
  NAvatar,
  NText,
  NList,
  NListItem,
  NThing,
  NResult,
  NSpin,
  NEmpty,
  NDivider,
  NScrollbar,
  NTag,
} from "naive-ui";

// Composables
const { stream_url, core_cdn } = useAppUrl();
const route = useRoute();

// Reactive data
const videoData = ref({
  title: "",
  details: "",
  courseTopics: [],
  thumbnailId: "",
  entityName: "",
  learnerCount: 0,
});

const currentVideo = ref<any>(null);
const videoComponentRef = ref<any>(null);
const isVideoPlaying = ref(false);
const activeTopic = ref<any>(null);
const currentVideoSrc = ref<string | null>(null);
const videoProcessingStatus = ref<any>(null);
const expandedTopics = ref<(string | number)[]>([]);
const videoElement = ref(null);
const watchedSegments = new Set();

// Computed properties
const currentLessonDuration = computed(() => {
  if (currentVideo.value?.videoFiles?.[0]?.duration) {
    return formatDuration(currentVideo.value.videoFiles[0].duration);
  }
  return "00:00";
});

const currentTopicTitle = computed(() => {
  if (!currentVideo.value || !activeTopic.value) return "N/A";

  const topicIndex =
    videoData.value.courseTopics?.findIndex(
      (t) => t.id === activeTopic.value.id
    ) ?? -1;
  if (topicIndex >= 0) {
    return `${topicIndex + 1}. ${activeTopic.value.title}`;
  }
  return activeTopic.value.title;
});

const currentVideoStatus = computed(() => {
  if (!currentVideo.value) return "N/A";

  if (currentVideo.value.isLocked) return "Qulflangan";
  if (processingMessage.value) return "Qayta ishlanmoqda";
  if (isVideoPlaying.value) return "O'ynalmoqda";
  return "Tayyor";
});

const firstLesson = computed(() => {
  const topics = videoData.value?.courseTopics;
  if (topics?.length && topics[0].videoLessons?.length) {
    return topics[0].videoLessons[0];
  }
  return null;
});

const getThumbnailUrl = computed(() => {
  if (videoData.value?.thumbnailId) {
    return `${core_cdn}/Media/Get?entityName=${
      videoData.value?.entityName || "Course"
    }&fileId=${videoData.value.thumbnailId}`;
  }
  return "/images/default-course.jpg";
});

const processingMessage = computed(() => {
  if (
    videoProcessingStatus.value &&
    videoProcessingStatus.value.statusId !== 10
  ) {
    return videoProcessingStatus.value.message || "Video qayta ishlanmoqda...";
  }
  return false;
});

const totalLessonsCount = computed(() => {
  return (
    videoData.value.courseTopics?.reduce((total, topic) => {
      return total + (topic.videoLessons?.length || 0);
    }, 0) || 0
  );
});

const currentLessonIndex = computed(() => {
  if (!currentVideo.value) return 0;

  let index = 0;
  for (const topic of videoData.value.courseTopics || []) {
    for (const lesson of topic.videoLessons || []) {
      if (lesson.id === currentVideo.value.id) {
        return index;
      }
      index++;
    }
  }
  return 0;
});

const totalCourseDuration = computed(() => {
  let totalSeconds = 0;

  for (const topic of videoData.value.courseTopics || []) {
    for (const lesson of topic.videoLessons || []) {
      totalSeconds += lesson.videoFiles?.[0]?.duration || 0;
    }
  }

  return formatDuration(totalSeconds);
});

// Methods
const collectActiveChunk = (params: any) => {
  const segmentName = params.activeChunk?.relurl;
  if (!watchedSegments.has(segmentName)) {
    watchedSegments.add(segmentName);
  }
};

const handleVideoEvent = async (event: string, args: any) => {
  if (event === "playing") {
    isVideoPlaying.value = true;
  } else if (event === "paused" || event === "ended") {
    isVideoPlaying.value = false;
  }

  await SendBackendSegments(args, event);
};

const SendBackendSegments = async (args: any, action: string) => {
  const state = useLocalStorage().getItem("state");
  const courseId = route.params.id;

  if (state && courseId && currentVideo.value?.id) {
    const payload = {
      videoLessonId: currentVideo.value.id,
      currentTime: args?.currentTime || 0,
      action: action || "exit",
      segment: Array.from(watchedSegments),
    };

    try {
      const response = await fetch(
        `https://api.nextedu.uz/Course/NewVideoPlay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error("Failed to send watched segments:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending watched segments:", error);
    }
  }
};

const togglePlay = () => {
  if (!currentVideoSrc.value) return;

  if (isVideoPlaying.value) {
    videoComponentRef.value?.pause?.();
  } else {
    videoComponentRef.value?.play?.();
  }
};

const selectLesson = (lesson: any) => {
  if (lesson.isLocked) return;

  if (currentVideo.value?.id === lesson.id) {
    togglePlay();
    return;
  }

  currentVideo.value = lesson;
  isVideoPlaying.value = false;

  activeTopic.value = videoData.value?.courseTopics?.find((t: any) =>
    t.videoLessons?.some((l: any) => l.id === lesson.id)
  );

  // Expand the topic containing this lesson
  if (
    activeTopic.value &&
    !expandedTopics.value.includes(activeTopic.value.id)
  ) {
    expandedTopics.value.push(activeTopic.value.id);
  }

  videoProcessingStatus.value = lesson.videoFiles?.[0]?.proccess || null;

  if (lesson.videoFiles?.[0]?.playlistId) {
    currentVideoSrc.value = `${stream_url.value}/Stream/GetVideo/${lesson.videoFiles[0].playlistId}/master.m3u8`;
  } else {
    currentVideoSrc.value = null;
  }
};

const formatDuration = (seconds: number): string => {
  if (!seconds) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const getCourse = async () => {
  try {
    const id = route.params.id;
    const response =
      id && id !== "0"
        ? await CourseService.Get(id)
        : await CourseService.GetId();

    if (!response) {
      throw new Error("Kurs ma'lumotlari topilmadi");
    }

    videoData.value = {
      ...response,
      thumbnailId: response.thumbnailId || response.thumbnail?.id || "",
      entityName: response.entityName || "Course",
      learnerCount: response.learnerCount || 0,
    };

    if (response.courseTopics?.length) {
      expandedTopics.value = [response.courseTopics[0].id];
    }

    if (firstLesson.value) {
      selectLesson(firstLesson.value);
    } else {
      currentVideo.value = null;
      currentVideoSrc.value = null;
    }
  } catch (error) {
    console.error("Kursni yuklashda xato:", error);
  }
};

// Lifecycle
onMounted(() => {
  getCourse();
});
</script>

<style scoped>
@keyframes lessonHighlight {
  0% {
    background: rgba(24, 160, 88, 0.3);
    transform: translateX(-2px);
  }
  100% {
    background: rgba(24, 160, 88, 0.08);
    transform: translateX(0);
  }
}

.active-lesson {
  animation: lessonHighlight 0.5s ease-out;
}
</style>
