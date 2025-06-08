<template>
  <div class="p-6">
    <n-card class="shadow-sm">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800">
          {{
            route.params.id === "0"
              ? "Yangi tashkilot yaratish"
              : "Tashkilotni tahrirlash"
          }}
        </h2>
      </template>

      <n-spin :show="pageLoading" description="Ma'lumotlar yuklanmoqda...">
        <n-form
          ref="formRef"
          :model="data"
          :rules="rules"
          @submit.prevent="submitForm"
        >
          <div class="space-y-6">
            <!-- Modules Section -->
            <div class="border border-gray-200 rounded-lg p-6">
              <h3
                class="text-lg font-semibold text-gray-800 mb-4 flex items-center"
              >
                <n-icon class="mr-2">
                  <ModulesIcon />
                </n-icon>
                Modullar
              </h3>

              <n-form-item path="modules">
                <div
                  v-if="moduleList.length > 0"
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
                >
                  <n-checkbox
                    v-for="(item, index) in moduleList"
                    :key="'module' + index"
                    :value="item.value"
                    :checked="data.modules.includes(item.value)"
                    @update:checked="handleModuleChange(item.value, $event)"
                    class="text-sm"
                  >
                    {{ item.text }}
                  </n-checkbox>
                </div>

                <div
                  v-else-if="!pageLoading"
                  class="flex flex-col items-center justify-center h-32 text-gray-500"
                >
                  <n-icon size="32" class="mb-2 opacity-50">
                    <ModulesIcon />
                  </n-icon>
                  <p class="text-sm">Modullar topilmadi</p>
                </div>
              </n-form-item>
            </div>

            <!-- Selected Modules Summary -->
            <div
              v-if="data.modules.length > 0"
              class="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <h4 class="text-sm font-semibold text-blue-800 mb-2">
                Tanlangan modullar ({{ data.modules.length }} ta):
              </h4>
              <div class="flex flex-wrap gap-2">
                <n-tag
                  v-for="moduleId in data.modules"
                  :key="moduleId"
                  type="info"
                  size="small"
                  closable
                  @close="removeModule(moduleId)"
                >
                  {{ getModuleName(moduleId) }}
                </n-tag>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-6 border-t">
              <n-button @click="router.back()" class="px-6 py-2" secondary>
                <template #icon>
                  <n-icon>
                    <ArrowBackIcon />
                  </n-icon>
                </template>
                Orqaga
              </n-button>

              <n-button
                type="primary"
                @click="submitForm"
                :loading="loading"
                :disabled="data.modules.length === 0"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600"
              >
                <template #icon>
                  <n-icon>
                    <SaveIcon />
                  </n-icon>
                </template>
                Saqlash
              </n-button>
            </div>
          </div>
        </n-form>
      </n-spin>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NCard,
  NForm,
  NFormItem,
  NCheckbox,
  NButton,
  NIcon,
  NSpin,
  NTag,
  useMessage,
  type FormInst,
  type FormRules,
} from "naive-ui";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Apps as ModulesIcon,
} from "@vicons/ionicons5";
import OrganizationService from "@/service/managment/organization.service";
import ManualService from "@/service/others/manual.service";

interface Module {
  text: string;
  value: number;
}

const message = useMessage();
const route = useRoute();
const router = useRouter();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const pageLoading = ref(true);

const data = ref({
  id: 0,
  modules: [] as number[],
});

const moduleList = ref<Module[]>([]);

const rules: FormRules = {
  modules: [
    {
      type: "array",
      min: 1,
      message: "Kamida bitta modul tanlash kerak",
      trigger: "change",
    },
  ],
};

// Get module name by id
const getModuleName = (moduleId: number) => {
  const module = moduleList.value.find((m) => m.value === moduleId);
  return module ? module.text : `Module ${moduleId}`;
};

const handleModuleChange = (moduleId: number, checked: boolean) => {
  if (checked) {
    if (!data.value.modules.includes(moduleId)) {
      data.value.modules.push(moduleId);
    }
  } else {
    const index = data.value.modules.indexOf(moduleId);
    if (index > -1) {
      data.value.modules.splice(index, 1);
    }
  }
};

const removeModule = (moduleId: number) => {
  const index = data.value.modules.indexOf(moduleId);
  if (index > -1) {
    data.value.modules.splice(index, 1);
  }
};

const fetchModuleList = async () => {
  try {
    const res: any = await ManualService.TableSelectList();
    moduleList.value = res;
    console.log("Module List:", res);
  } catch (error) {
    console.error("Error fetching module list:", error);
    message.error("Modullar ro'yxatini yuklashda xatolik");
  }
};

const fetchOrganizationData = async (id: number) => {
  try {
    const res: any = await OrganizationService.GetId(id);
    data.value = {
      id: res.id,
      modules: res.modules?.map((m: any) => m.id) || [],
    };
  } catch (error) {
    console.error("Error fetching organization data:", error);
    message.error("Tashkilot ma'lumotlarini yuklashda xatolik");
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    const id = Number(route.params.id);
    const modulesData = data.value.modules;

    if (id === 0) {
      await OrganizationService.Create(modulesData);
      message.success("Tashkilot muvaffaqiyatli yaratildi");
      router.push("/organization");
    } else {
      // Update logic if needed
      await OrganizationService.Update({ id, modules: modulesData });
      message.success("Tashkilot muvaffaqiyatli yangilandi");
      router.push("/organization");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    message.error("Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    pageLoading.value = true;
    await fetchModuleList();

    const id = Number(route.params.id);
    if (id && id !== 0) {
      await fetchOrganizationData(id);
    }
  } catch (error) {
    console.error("Error loading page:", error);
    message.error("Sahifani yuklashda xatolik");
  } finally {
    pageLoading.value = false;
  }
});
</script>
