<template>
  <div>
    <div v-for="(practice, index) in localItems" :key="index" class="mb-6">
      <n-card class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <n-form-item label="Topshiriq nomi" required>
                <n-input
                  v-model:value="practice.title"
                  placeholder="Topshiriq nomi"
                  @input="emitUpdate"
                />
              </n-form-item>
            </div>

            <div>
              <n-form-item label="Topshiriq tavsifi" required>
                <n-input
                  v-model:value="practice.details"
                  type="textarea"
                  placeholder="Tavsif yozing..."
                  :autosize="{
                    minRows: 6,
                    maxRows: 12,
                  }"
                  @input="emitUpdate"
                  show-count
                  maxlength="2000"
                />
              </n-form-item>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <n-form-item label="Maximal ball" required>
                  <n-input-number
                    v-model:value="practice.submissionLimit"
                    placeholder="Maximal ball"
                    :min="0"
                    :max="1000"
                    @update:value="emitUpdate"
                  />
                </n-form-item>
              </div>

              <div>
                <n-form-item label="Urinishlar soni" required>
                  <n-input-number
                    v-model:value="practice.attemptCount"
                    placeholder="Urinishlar soni"
                    :min="1"
                    :max="10"
                    @update:value="emitUpdate"
                  />
                </n-form-item>
              </div>
            </div>

            <n-card embedded>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <n-icon size="18" color="#666">
                      <FolderIcon />
                    </n-icon>
                    <h6 class="text-base font-semibold m-0">Amaliyot Fayli</h6>
                  </div>
                  <n-button
                    :disabled="fileLoading || hasTests"
                    size="small"
                    :type="hasTests ? 'default' : 'primary'"
                    @click="triggerMaterialInput(index)"
                  >
                    <template #icon>
                      <n-spin v-if="fileLoading" size="small" />
                      <n-icon v-else>
                        <AddIcon />
                      </n-icon>
                    </template>
                    {{ fileLoading ? "File qo'shilmoqda..." : "File qo'shish" }}
                  </n-button>
                  <input
                    type="file"
                    :ref="(el) => (materialInputs[index] = el)"
                    class="hidden"
                    @change="(e) => handleMaterialUpload(e, index)"
                  />
                </div>

                <n-alert
                  v-if="hasTests"
                  type="warning"
                  :bordered="false"
                  class="mb-4"
                >
                  Bu mavzuda testlar mavjud, fayl qo'sha olmaysiz
                </n-alert>

                <div v-if="practice.fileId" class="mt-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          :class="getFileIconBgClass(practice)"
                        >
                          <n-icon size="24">
                            <component :is="getFileIcon(practice)" />
                          </n-icon>
                        </div>
                        <div>
                          <div class="font-medium text-sm">
                            {{ practice.fileName }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ formatFileSize(practice.fileSize) }}
                          </div>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <n-button
                          size="small"
                          type="success"
                          @click="showPreview(practice)"
                        >
                          <template #icon>
                            <n-icon>
                              <EyeIcon />
                            </n-icon>
                          </template>
                        </n-button>
                        <n-button
                          size="small"
                          type="error"
                          @click="removeMaterialFile(index)"
                        >
                          <template #icon>
                            <n-icon>
                              <CloseIcon />
                            </n-icon>
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-12">
                  <n-icon size="48" color="#d1d5db" class="mb-3">
                    <DocumentIcon />
                  </n-icon>
                  <p class="text-gray-500 text-sm">
                    Hozircha hech qanday fayl qo'shilmagan
                  </p>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </n-card>
    </div>

    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="previewFile.name"
      style="width: 90%; max-width: 900px"
      :bordered="false"
      size="huge"
    >
      <div class="text-center">
        <img
          v-if="isImageFile(previewFile.name)"
          :src="getFileUrl(previewFile.id)"
          :alt="previewFile.name"
          class="max-w-full h-auto max-h-96 mx-auto"
        />
        <iframe
          v-else-if="isPdfFile(previewFile.name)"
          :src="getFileUrl(previewFile.id)"
          class="w-full h-96 border-0"
        ></iframe>

        <div v-else class="text-gray-500 py-12">
          <n-icon size="64" color="#d1d5db" class="mb-4">
            <DocumentIcon />
          </n-icon>
          <p class="mb-2">Ushbu fayl turi brauzerda ko'rsatib bo'lmaydi</p>
          <p class="text-sm">
            Faylni yuklab olish uchun quyidagi tugmani bosing
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <n-button type="success" @click="downloadFile">
            <template #icon>
              <n-icon>
                <DownloadIcon />
              </n-icon>
            </template>
            Yuklab olish
          </n-button>
          <n-button @click="showModal = false"> Yopish </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import {
  NCard,
  NButton,
  NModal,
  NIcon,
  NSpin,
  NInput,
  NFormItem,
  NInputNumber,
  NAlert,
  useMessage,
} from "naive-ui";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Eye as EyeIcon,
  Download as DownloadIcon,
  Document as DocumentIcon,
  Folder as FolderIcon,
  DocumentText as DocIcon,
  Image as ImageIcon,
  VideocamOutline as VideoIcon,
  MusicalNotes as AudioIcon,
  Archive as ZipIcon,
} from "@vicons/ionicons5";
import { useAppUrl } from "@/composables/useAppUrl";
import MediaService from "@/service/others/media.service";

interface ILessonPractice {
  id?: number;
  orderNumber?: number;
  title?: string;
  details?: string;
  submissionLimit?: number;
  attemptCount?: number;
  fileId?: string | null;
  fileExtension?: string;
  fileSize?: number;
  fileName?: string;
  topicId?: number;
}

const props = withDefaults(
  defineProps<{
    items: ILessonPractice[];
    hasTests?: boolean;
  }>(),
  {
    items: () => [] as ILessonPractice[],
    hasTests: false,
  }
);

const emit = defineEmits(["update"]);

const message = useMessage();
const { core_cdn } = useAppUrl();

const fileLoading = ref(false);
const showModal = ref(false);
const materialInputs = ref<HTMLInputElement[]>([]);

const defaultLessonPractice: ILessonPractice = {
  id: 0,
  orderNumber: 0,
  title: "",
  attemptCount: 1,
  details: "",
  submissionLimit: 100,
  fileId: null,
  fileExtension: "",
  fileSize: 0,
  fileName: "",
  topicId: 0,
};

const localItems = ref<ILessonPractice[]>(
  props.items.length ? [...props.items] : [{ ...defaultLessonPractice }]
);

const previewFile = reactive({
  id: "",
  name: "",
});

const emitUpdate = () => {
  emit("update", ...localItems.value);
};

watch(
  () => props.items,
  (newVal) => {
    if (newVal && newVal.length) {
      localItems.value = [...newVal];
    } else {
      localItems.value = [{ ...defaultLessonPractice }];
    }
  },
  { deep: true }
);

const triggerMaterialInput = (index: number) => {
  if (props.hasTests) {
    message.warning("Bu mavzuda testlar mavjud, fayl qo'sha olmaysiz");
    return;
  }

  if (materialInputs.value[index]) {
    materialInputs.value[index].click();
  }
};

const showPreview = (file: ILessonPractice) => {
  if (!file.fileId) return;

  previewFile.id = file.fileId;
  previewFile.name = file.fileName || "";
  showModal.value = true;
};

const handleMaterialUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    console.log("Fayl tanlanmagan");
    return;
  }

  fileLoading.value = true;

  const fileNameParts = file.name.split(".");
  const fileExtension =
    fileNameParts.length > 1 ? fileNameParts.pop()?.toLowerCase() || "" : "";

  const formData = new FormData();
  formData.append("EntityName", "lessonPractice");
  formData.append("File", file);
  try {
    let res;

    if (fileExtension === "ppt" || fileExtension === "pptx") {
      res = await MediaService.UploadPPT(formData);
    } else {
      res = await MediaService.Upload(formData);
    }

    if (res && res.data && res.data.fileId) {
      localItems.value[index] = {
        ...localItems.value[index],
        fileId: res.data.fileId,
        fileName: file.name,
        fileSize: file.size,
        fileExtension: fileExtension,
      };

      emitUpdate();
      message.success("Fayl muvaffaqiyatli yuklandi");
    } else {
      console.error("❌ API javobida fileId yo'q:", res);
      message.error("Fayl yuklashda xatolik yuz berdi");
    }
  } catch (error) {
    console.error("❌ Upload xatolik:", error);
    message.error("Fayl yuklashda xatolik yuz berdi");
  } finally {
    target.value = "";
    fileLoading.value = false;
  }
};

const removeMaterialFile = (index: number) => {
  localItems.value[index] = {
    ...localItems.value[index],
    fileId: null,
    fileName: "",
    fileSize: 0,
    fileExtension: "",
  };
  emitUpdate();
  message.success("Fayl olib tashlandi");
};

const getFileIcon = (file: ILessonPractice) => {
  const extension =
    file.fileExtension?.toLowerCase() ||
    file.fileName?.split(".").pop()?.toLowerCase();

  if (!extension) return DocumentIcon;

  const iconMap: Record<string, any> = {
    pdf: DocIcon,
    doc: DocIcon,
    docx: DocIcon,
    xls: DocIcon,
    xlsx: DocIcon,
    ppt: DocIcon,
    pptx: DocIcon,
    jpg: ImageIcon,
    jpeg: ImageIcon,
    png: ImageIcon,
    gif: ImageIcon,
    webp: ImageIcon,
    svg: ImageIcon,
    mp4: VideoIcon,
    avi: VideoIcon,
    mov: VideoIcon,
    wmv: VideoIcon,
    mp3: AudioIcon,
    wav: AudioIcon,
    zip: ZipIcon,
    rar: ZipIcon,
    "7z": ZipIcon,
  };

  return iconMap[extension] || DocumentIcon;
};

const getFileIconBgClass = (file: ILessonPractice) => {
  const extension =
    file.fileExtension?.toLowerCase() ||
    file.fileName?.split(".").pop()?.toLowerCase();

  if (!extension) return "bg-gray-500";

  const colorMap: Record<string, string> = {
    pdf: "bg-red-500",
    doc: "bg-blue-600",
    docx: "bg-blue-600",
    xls: "bg-green-600",
    xlsx: "bg-green-600",
    ppt: "bg-orange-500",
    pptx: "bg-orange-500",
    jpg: "bg-purple-500",
    jpeg: "bg-purple-500",
    png: "bg-purple-500",
    gif: "bg-purple-500",
    webp: "bg-purple-500",
    svg: "bg-purple-500",
    mp4: "bg-indigo-500",
    avi: "bg-indigo-500",
    mov: "bg-indigo-500",
    wmv: "bg-indigo-500",
    mp3: "bg-pink-500",
    wav: "bg-pink-500",
    zip: "bg-yellow-600",
    rar: "bg-yellow-600",
    "7z": "bg-yellow-600",
  };

  return colorMap[extension] || "bg-gray-500";
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const isImageFile = (fileName: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
};

const isPdfFile = (fileName: string) => {
  const pdfExtensions = [".pdf", ".ppt", ".pptx"];
  return pdfExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};

const getFileUrl = (fileId: string) => {
  return `${core_cdn.value}/Media/Get?entityName=lessonPractice&fileId=${fileId}`;
};

const downloadFile = () => {
  const url = getFileUrl(previewFile.id);
  const link = document.createElement("a");
  link.href = url;
  link.download = previewFile.name;
  link.click();
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
