import { ref } from "vue";

export const apiUrl = ref<string>("");
export const controlApiUrl = ref<string>("");
export const cdnUrl = ref<string>("");
export const streamUrl = ref<string>("");
export const fullName = ref<string>("");
export const logo = ref<string>("");
export const hemisAuthUrl = ref<string>("");
export const clientId = ref<string>("");
export const hemisAuthRedirectUrl = ref<string>("");
export const controlUrl = ref<string>("");

export const setAppConfig = (config: any) => {
  apiUrl.value = config.controlApiUrl;
  controlApiUrl.value = config.controlApiUrl;
  cdnUrl.value = config.cdnUrl;
  streamUrl.value = config.streamUrl;
  fullName.value = config.fullName;
  logo.value = config.logo;
  hemisAuthUrl.value = config.hemisAuthUrl;
  clientId.value = config.clientId;
  hemisAuthRedirectUrl.value = config.hemisAuthRedirectUrl;
  controlUrl.value = config.controlUrl;
};
