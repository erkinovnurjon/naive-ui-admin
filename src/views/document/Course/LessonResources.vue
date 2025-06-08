<template>
  <div>
    <div v-for="(practice, index) in localItems" :key="index" class="mb-6">
      <n-card class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Ma'lumotlar qismi -->
          <div class="space-y-4">
            <div>
              <n-form-item label="Sarlavha" required>
                <n-input
                  v-model:value="practice.title"
                  placeholder="Resurs sarlavhasini kiriting"
                  @input="emitUpdate"
                />
              </n-form-item>
            </div>

            <div>
              <n-form-item label="Tavsifi" required>
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

          <!-- Fayl yuklash qismi -->
          <div>
            <n-card embedded class="h-full">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <n-icon size="18" color="#666">
                      <FolderIcon />
                    </n-icon>
                    <h6 class="text-base font-semibold m-0">Resurs Fayli</h6>
                  </div>
                  <n-button
                    :disabled="fileLoading"
                    size="small"
                    type="primary"
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
                    multiple
                    @change="(e) => handleMaterialUpload(e, index)"
                  />
                </div>

                <!-- Fayllar ro'yxati -->
                <div
                  v-if="
                    practice.lessonResourceFiles &&
                    practice.lessonResourceFiles.length
                  "
                  class="space-y-3 mt-4"
                >
                  <div
                    v-for="(file, fileIndex) in practice.lessonResourceFiles"
                    :key="fileIndex"
                    class="bg-gray-50 p-3 rounded-lg"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          :class="getFileIconBgClass(file)"
                        >
                          <n-icon size="20">
                            <component :is="getFileIcon(file)" />
                          </n-icon>
                        </div>
                        <div>
                          <div class="font-medium text-sm">
                            {{ file.fileName }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ formatFileSize(file.fileSize) }}
                          </div>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <n-button
                          size="small"
                          type="success"
                          @click="showPreview(file)"
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
                          @click="removeMaterialFile(index, fileIndex)"
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

                <!-- Bo'sh holat -->
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

    <!-- Preview Modal -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="previewFile.name"
      style="width: 90%; max-width: 900px"
      :bordered="false"
      size="huge"
    >
      <div class="text-center">
        <!-- Debug ma'lumotlari -->
        <div
          v-if="showDebug"
          class="mb-4 p-3 bg-gray-100 rounded text-xs font-mono"
        >
          <h4 class="font-bold mb-2">Debug Ma'lumotlari:</h4>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <strong>previewFile.id:</strong>
              <span class="text-blue-600">{{
                previewFile.id || "MAVJUD EMAS"
              }}</span>
            </div>
            <div>
              <strong>previewFile.name:</strong>
              <span class="text-green-600">{{
                previewFile.name || "MAVJUD EMAS"
              }}</span>
            </div>
            <div class="col-span-2">
              <strong>Generated URL:</strong><br />
              <span class="text-purple-600 break-all">{{
                getFileUrl(previewFile.id)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Rasm fayllar uchun -->
        <img
          v-if="isImageFile(previewFile.name)"
          :src="getFileUrl(previewFile.id)"
          :alt="previewFile.name"
          class="max-w-full h-auto max-h-96 mx-auto rounded-lg"
          @error="handleImageError"
          @load="handleImageLoad"
        />

        <!-- PDF va PowerPoint fayllar uchun -->
        <iframe
          v-else-if="isPdfFile(previewFile.name)"
          :src="getFileUrl(previewFile.id)"
          class="w-full h-96 border-0 rounded-lg"
          @error="handleIframeError"
          @load="handleIframeLoad"
        ></iframe>

        <!-- Boshqa fayl turlari uchun -->
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
        <div class="flex justify-between items-center">
          <n-button
            v-if="!showDebug"
            quaternary
            type="info"
            size="small"
            @click="showDebug = true"
          >
            Debug
          </n-button>
          <div v-else></div>

          <div class="flex gap-3">
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
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from "vue";
import {
  NCard,
  NButton,
  NModal,
  NIcon,
  NSpin,
  NInput,
  NFormItem,
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

interface ILessonResourceFiles {
  fileId?: string | null;
  fileExtension?: string;
  fileSize?: number;
  fileName?: string;
}

interface ILessonPractice {
  id?: number;
  orderNumber?: number;
  title?: string;
  details?: string;
  submissionLimit?: number;
  lessonResourceFiles?: ILessonResourceFiles[];
  topicId?: number;
}

const props = withDefaults(
  defineProps<{
    items: ILessonPractice[];
  }>(),
  {
    items: () => [] as ILessonPractice[],
  }
);

const emit = defineEmits(["update"]);

const message = useMessage();
const { core_cdn } = useAppUrl();

const fileLoading = ref(false);
const showModal = ref(false);
const showDebug = ref(false);
const materialInputs = ref<HTMLInputElement[]>([]);

const defaultLessonPractice: ILessonPractice = {
  id: 0,
  orderNumber: 0,
  title: "",
  details: "",
  submissionLimit: 0,
  lessonResourceFiles: [],
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
  if (materialInputs.value[index]) {
    materialInputs.value[index].click();
  }
};

const showPreview = (file: ILessonResourceFiles) => {
  console.log("=== PREVIEW JARAYONI ===");
  console.log("Preview fayl:", file);

  if (!file.fileId) {
    console.warn("File ID mavjud emas");
    message.warning("Fayl ID mavjud emas");
    return;
  }

  previewFile.id = file.fileId;
  previewFile.name = file.fileName || "";

  console.log("Preview URL:", getFileUrl(previewFile.id));

  showModal.value = true;
  showDebug.value = false;
};

const handleMaterialUpload = async (event: Event, index: number) => {
  console.log("=== UPLOAD BOSHLANDI ===");

  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) {
    console.log("Fayllar tanlanmagan");
    return;
  }

  console.log("Tanlangan fayllar soni:", files.length);

  fileLoading.value = true;

  try {
    for (const file of files) {
      console.log("Fayl yuklanmoqda:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts.length > 1
          ? fileNameParts.pop()?.toLowerCase() || ""
          : "";

      const formData = new FormData();
      formData.append("EntityName", "lessonResources");
      formData.append("File", file);

      console.log("API ga yuborilmoqda...");

      let res;

      if (fileExtension === "ppt" || fileExtension === "pptx") {
        console.log("PowerPoint fayl - UploadPPT");
        res = await MediaService.UploadPPT(formData);
      } else {
        console.log("Oddiy fayl - Upload");
        res = await MediaService.Upload(formData);
      }

      console.log("API javob:", res);

      if (res && res.data && res.data.fileId) {
        console.log("✅ Fayl yuklandi, fileId:", res.data.fileId);

        // lessonResourceFiles array ni yaratish agar mavjud bo'lmasa
        if (!localItems.value[index].lessonResourceFiles) {
          localItems.value[index].lessonResourceFiles = [];
        }

        localItems.value[index].lessonResourceFiles!.push({
          fileId: res.data.fileId,
          fileName: file.name,
          fileSize: file.size,
          fileExtension: fileExtension,
        });

        console.log(
          "Fayl qo'shildi:",
          localItems.value[index].lessonResourceFiles
        );
      } else {
        console.error("❌ API javobida fileId yo'q:", res);
        message.error(`${file.name} yuklashda xatolik yuz berdi`);
      }
    }

    emitUpdate();
    message.success(`${files.length} ta fayl muvaffaqiyatli yuklandi`);
  } catch (error) {
    console.error("❌ Upload xatolik:", error);
    message.error("Fayl yuklashda xatolik yuz berdi");
  } finally {
    target.value = "";
    fileLoading.value = false;
    console.log("=== UPLOAD TUGADI ===");
  }
};

const removeMaterialFile = (practiceIndex: number, fileIndex: number) => {
  const files = localItems.value[practiceIndex].lessonResourceFiles;
  if (files) {
    const removedFile = files[fileIndex];
    console.log("Fayl o'chirilmoqda:", removedFile);

    files.splice(fileIndex, 1);
    emitUpdate();
    message.success("Fayl olib tashlandi");
  }
};

const getFileIcon = (file: ILessonResourceFiles) => {
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

const getFileIconBgClass = (file: ILessonResourceFiles) => {
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
  const url = `${core_cdn.value}/Media/Get?entityName=lessonResources&fileId=${fileId}`;
  console.log("Generated URL:", url);
  return url;
};

const downloadFile = () => {
  const url = getFileUrl(previewFile.id);
  const link = document.createElement("a");
  link.href = url;
  link.download = previewFile.name;
  link.click();
};

// Error handlers
const handleImageError = (event: Event) => {
  console.error(
    "Rasm yuklash xatolik:",
    (event.target as HTMLImageElement).src
  );
  message.error("Rasmni yuklashda xatolik yuz berdi");
};

const handleImageLoad = (event: Event) => {
  console.log("Rasm yuklandi:", (event.target as HTMLImageElement).src);
};

const handleIframeError = (event: Event) => {
  console.error(
    "Iframe yuklash xatolik:",
    (event.target as HTMLIFrameElement).src
  );
  message.error("Faylni yuklashda xatolik yuz berdi");
};

const handleIframeLoad = (event: Event) => {
  console.log("Iframe yuklandi:", (event.target as HTMLIFrameElement).src);
};

onMounted(() => {
  console.log("Component mounted");
  console.log("core_cdn.value:", core_cdn.value);
});
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
