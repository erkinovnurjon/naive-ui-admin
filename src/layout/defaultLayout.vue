<template>
  <n-layout has-sider class="h-screen">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
    >
      <div class="p-4 font-bold text-lg">📘 Next LMS</div>
      <n-menu
        :options="menuOptions"
        :value="activeMenu"
        @update:value="handleMenuClick"
        :collapsed-width="64"
        :collapsed-icon-size="22"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header
        class="h-16 border-b flex items-center justify-between shadow-sm px-4"
      >
        <div class="text-lg font-semibold">Admin Panel</div>
        <n-button strong secondary type="primary" @click="logout"
          >Logout</n-button
        >
      </n-layout-header>

      <n-layout-content class="p-4 bg-gray-50 overflow-auto">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { NMenu, NButton, NLayoutSider, useMessage } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { ref, watch } from "vue";
import { menuOptions } from "./menu";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocalStorage } from "@/composables/useStorage";

const router = useRouter();
const route = useRoute();
const message = useMessage();
const authStore = useAuthStore();

const activeMenu = ref(route.path);

const logout = () => {
  useLocalStorage().removeItem("token");
  useLocalStorage().removeItem("user");

  authStore.logout();

  message.success("Tizimdan chiqdingiz!");
  router.push("/login");
};

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath;
  }
);

const handleMenuClick = (key: string) => {
  router.push(key);
};
</script>

<style scoped>
.n-layout-sider {
  height: 100vh;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
