<template>
  <div class="p-6">
    <n-card class="shadow-sm">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800">
          {{
            route.params.id
              ? "Foydalanuvchini tahrirlash"
              : "Yangi foydalanuvchi yaratish"
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
            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- To'liq nomi -->
              <n-form-item label="To'liq nomi" path="fullName">
                <n-input
                  v-model:value="data.fullName"
                  placeholder="To'liq nomini kiriting..."
                  :disabled="isDisabled"
                  clearable
                  class="w-full"
                />
              </n-form-item>

              <!-- Tashkilot -->
              <n-form-item label="Tashkilot" path="organization">
                <n-input
                  v-model:value="data.organization"
                  placeholder="Tashkilot nomini kiriting..."
                  :disabled="isDisabled"
                  clearable
                  class="w-full"
                />
              </n-form-item>

              <!-- Foydalanuvchi nomi -->
              <n-form-item label="Foydalanuvchi nomi" path="userName">
                <n-input
                  v-model:value="data.userName"
                  placeholder="Foydalanuvchi nomini kiriting..."
                  :disabled="isDisabled"
                  clearable
                  class="w-full"
                />
              </n-form-item>

              <!-- Pochta manzili -->
              <n-form-item label="Pochta manzili" path="email">
                <n-input
                  v-model:value="data.email"
                  type="text"
                  placeholder="Email manzilini kiriting..."
                  :disabled="isDisabled"
                  clearable
                  class="w-full"
                />
              </n-form-item>
            </div>

            <!-- Rollar - Alohida qator -->
            <div class="grid grid-cols-2 gap-6">
              <n-form-item label="Rollar" path="roles">
                <n-select
                  v-model:value="data.roles"
                  multiple
                  :options="roleOptions"
                  placeholder="Rollarni tanlang..."
                  :loading="rolesLoading"
                  clearable
                  filterable
                />
              </n-form-item>
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
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NIcon,
  NSpin,
  useMessage,
  type FormInst,
  type FormRules,
  type SelectOption,
} from "naive-ui";
import { ArrowBack as ArrowBackIcon } from "@vicons/ionicons5";
import { Save as SaveIcon } from "@vicons/ionicons5";
import UserService from "@/service/managment/user.service";
import RoleService from "@/service/managment/role.service";

interface Role {
  orderCode: string | null;
  text: string;
  value: number;
}

const message = useMessage();
const route = useRoute();
const router = useRouter();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const pageLoading = ref(true);
const rolesLoading = ref(false);
const isDisabled = ref(false);

const data = reactive({
  id: 0,
  fullName: "",
  email: "",
  organization: "",
  organizationId: 0,
  languageId: 0,
  stateId: 1,
  userName: "",
  roles: [] as number[],
  employeeId: 0,
});

const roleList = ref<Role[]>([]);

// Convert roleList to select options
const roleOptions = computed(() => {
  console.log("Role list raw data:", roleList.value);
  const options = roleList.value.map((role) => ({
    label: role.text,
    value: role.value,
  })) as SelectOption[];
  console.log("Converted role options:", options);
  return options;
});

const rules: FormRules = {
  fullName: [
    {
      required: true,
      message: "To'liq nom kiritilishi shart",
      trigger: "blur",
    },
    {
      min: 2,
      message: "To'liq nom kamida 2 ta belgidan iborat bo'lishi kerak",
      trigger: "blur",
    },
  ],
  userName: [
    {
      required: true,
      message: "Foydalanuvchi nomi kiritilishi shart",
      trigger: "blur",
    },
    {
      min: 3,
      message: "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "Email manzil kiritilishi shart",
      trigger: "blur",
    },
    {
      type: "email",
      message: "To'g'ri email manzil kiriting",
      trigger: "blur",
    },
  ],
  organization: [
    {
      required: true,
      message: "Tashkilot nomi kiritilishi shart",
      trigger: "blur",
    },
  ],
};

const fetchRoleList = async () => {
  try {
    rolesLoading.value = true;
    const res: any = await RoleService.GetAsselectlist();
    roleList.value = res;
  } catch (error) {
    message.error("Rollar ro'yxatini yuklashda xatolik");
  } finally {
    rolesLoading.value = false;
  }
};

const fetchUserData = async (id: number) => {
  try {
    const res: any = await UserService.GetId(id);

    Object.assign(data, {
      id: res.id,
      fullName: res.fullName,
      languageId: res.languageId,
      email: res.email,
      organization: res.organization,
      organizationId: res.organizationId,
      userName: res.userName,
      roles: res.roles || [],
      employeeId: res.employeeId,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    message.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik");
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    await UserService.Create(data);
    message.success("Foydalanuvchi muvaffaqiyatli saqlandi");
    router.push("/users");
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
    await fetchRoleList();

    const id = route.params.id;
    if (id && Number(id) !== 0) {
      await fetchUserData(Number(id));
      isDisabled.value = true; // Edit mode da form disable bo'ladi
    }
  } catch (error) {
    console.error("Error loading page:", error);
    message.error("Sahifani yuklashda xatolik");
  } finally {
    pageLoading.value = false;
  }
});
</script>
