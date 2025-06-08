<template>
  <div class="p-6">
    <n-card class="shadow-sm">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800">
          {{
            route.params.id === "0" ? "Yangi rol yaratish" : "Rolni tahrirlash"
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <n-form-item label="To'liq nomi" path="name">
                <n-input
                  v-model:value="data.name"
                  placeholder="Rol nomi..."
                  clearable
                  class="w-full"
                />
              </n-form-item>
            </div>

            <div class="space-y-6">
              <div
                v-for="(item, index) in moduleList"
                :key="index"
                class="border border-gray-200 rounded-lg p-4"
              >
                <h3
                  class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2"
                >
                  {{ item?.fullName }}
                </h3>

                <div class="space-y-4">
                  <div
                    v-for="(submodule, index2) in item.subGroups"
                    :key="index2"
                    class="bg-gray-50 p-3 rounded-md"
                  >
                    <h4 class="text-md font-medium text-gray-700 mb-3">
                      {{ submodule.fullName }}
                    </h4>

                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      <n-checkbox
                        v-for="(module, index3) in submodule.modules"
                        :key="index3"
                        :value="module.id"
                        :checked="data.modules.includes(module.id)"
                        @update:checked="handleModuleChange(module.id, $event)"
                        class="text-sm"
                      >
                        {{ module.fullName }}
                      </n-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NButton,
  NIcon,
  NSpin,
  useMessage,
  type FormInst,
  type FormRules,
} from "naive-ui";
import { ArrowBack as ArrowBackIcon } from "@vicons/ionicons5";
import { Save as SaveIcon } from "@vicons/ionicons5";
import RoleService from "@/service/managment/role.service";
import ManualService from "@/service/others/manual.service";

interface Module {
  id: number;
  fullName: string;
}

interface SubGroup {
  fullName: string;
  modules: Module[];
}

interface ModuleGroup {
  fullName: string;
  subGroups: SubGroup[];
}

const message = useMessage();
const route = useRoute();
const router = useRouter();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const pageLoading = ref(true);

const data = reactive({
  name: "",
  modules: [] as number[],
});

const moduleList = ref<ModuleGroup[]>([]);

const rules: FormRules = {
  name: [
    {
      required: true,
      message: "Rol nomi kiritilishi shart",
      trigger: "blur",
    },
    {
      min: 2,
      message: "Rol nomi kamida 2 ta belgidan iborat bo'lishi kerak",
      trigger: "blur",
    },
  ],
};

const handleModuleChange = (moduleId: number, checked: boolean) => {
  if (checked) {
    if (!data.modules.includes(moduleId)) {
      data.modules.push(moduleId);
    }
  } else {
    const index = data.modules.indexOf(moduleId);
    if (index > -1) {
      data.modules.splice(index, 1);
    }
  }
};

const fetchRoleList = async () => {
  try {
    const res: any = await ManualService.GetModuleSelectList();
    moduleList.value = res;
  } catch (error) {
    message.error("Modullar ro'yxatini yuklashda xatolik");
  }
};

const fetchRoleData = async (id: number) => {
  try {
    const res: any = await RoleService.GetId(id);
    data.name = res.name;
    data.modules = res.modules || [];
  } catch (error) {
    message.error("Rol ma'lumotlarini yuklashda xatolik");
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    const id = Number(route.params.id);

    if (id === 0) {
      await RoleService.Create(data);
      message.success("Rol muvaffaqiyatli yaratildi");
    } else {
      await RoleService.Update({ id, ...data });
      message.success("Rol muvaffaqiyatli yangilandi");
    }

    router.push("/role");
  } catch (error) {
    message.error("Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    pageLoading.value = true;
    await fetchRoleList();

    const id = Number(route.params.id);
    if (id && id !== 0) {
      await fetchRoleData(id);
    }
  } catch (error) {
    console.error("Error loading page:", error);
  } finally {
    pageLoading.value = false;
  }
});
</script>
