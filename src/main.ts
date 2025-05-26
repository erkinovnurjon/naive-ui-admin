import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import naive from "naive-ui";
import apiService from "./service/apiService";
import axios from "axios";
import { setAppConfig } from "@/composables/AppConfig";
import "./style.css";

const getConfig = async () => {
  try {
    const response = await axios.get("https://nextlms.uz/api/Config/Get");
    const config = response.data;
    setAppConfig(config);
    apiService.setBaseUrl(config.controlApiUrl);
    axios.defaults.baseURL = config.controlApiUrl;

    apiService.setHeader();
  } catch (error) {
    console.error("Konfiguratsiyani olishda xatolik:", error);
  }
};

getConfig().then(() => {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.use(naive);
  app.mount("#app");
});
