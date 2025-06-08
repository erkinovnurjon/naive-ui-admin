<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <n-card
      class="w-full max-w-md shadow-lg"
      title="Tizimga Kirish"
      :bordered="false"
    >
      <div class="text-center mb-4">
        <img
          v-if="logo"
          :src="logo"
          alt="University Logo"
          class="mx-auto mb-3"
          style="max-height: 80px; object-fit: contain"
        />
        <h4 class="text-green-600 font-bold">{{ fullName }}</h4>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" size="large">
        <n-form-item label="Login" path="userName">
          <n-input v-model:value="form.userName" placeholder="Username..." />
        </n-form-item>

        <n-form-item label="Parol" path="password">
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="********"
          />
        </n-form-item>

        <div class="flex justify-between items-center mb-3">
          <n-checkbox v-model:checked="rememberMe">Eslab qolish</n-checkbox>
          <router-link to="#" class="text-primary text-sm">
            Parolingizni unutdingizmi?
          </router-link>
        </div>

        <n-button type="primary" block strong @click="handleLogin">
          Kirish
        </n-button>

        <n-button block class="mt-5" @click="redirectToHemis">
          HEMIS ID bilan kirish
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import AccountService from "@/service/others/accountservice.ts";
import { useLocalStorage } from "@/composables/useStorage";
import { useAuthStore } from "@/store/useAuthStore";
import {
  hemisAuthUrl,
  clientId,
  hemisAuthRedirectUrl,
  controlUrl,
  logo,
  fullName,
} from "@/composables/AppConfig";

const authStore = useAuthStore();

const formRef = ref();
const message = useMessage();
const router = useRouter();
const route = useRoute();

const form = reactive({
  userName: "",
  password: "",
});

const rules = {
  userName: [
    { required: true, message: "Loginni kiriting", trigger: ["input", "blur"] },
  ],
  password: [
    { required: true, message: "Parolni kiriting", trigger: ["input", "blur"] },
  ],
};

const rememberMe = ref(false);

const handleLogin = async () => {
  await formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        const response: any = await AccountService.Login(form);
        useLocalStorage().setItem("token", response.token);
        useLocalStorage().setItem("user", JSON.stringify(response.user));

        authStore.setToken(response.token);
        authStore.setUser(response.user);

        message.success("Muvaffaqiyatli kiritildi");
        setTimeout(() => {
          router.push("/");
        }, 700);
      } catch (err) {
        message.error("Login yoki parol noto'g'ri!");
      }
    }
  });
};

const redirectToHemis = () => {
  const state = generateRandomState();
  localStorage.setItem("oauth2_state", state);
  const authUrl = `${hemisAuthUrl.value}/oauth/authorize?response_type=code&client_id=${clientId.value}&redirect_uri=${hemisAuthRedirectUrl.value}&state=${state}`;
  window.location.href = authUrl;
};

const generateRandomState = (length = 16) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

onMounted(() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  if (code) {
    handleHemisCallback(code);
  }
});

const handleHemisCallback = async (code: string) => {
  try {
    const response: any = await AccountService.HemisLogin({ code });
    useLocalStorage().setItem("token", response.token);
    useLocalStorage().setItem("user", JSON.stringify(response.user));

    authStore.setToken(response.token);
    authStore.setUser(response.user);

    const redirectPath = route.query.redirectFrom || "/";
    window.location.href = controlUrl.value + redirectPath;
  } catch (error) {
    console.error("HEMIS login failed:", error);
    router.push("/login?error=hemis_login_failed");
  }
};
</script>
