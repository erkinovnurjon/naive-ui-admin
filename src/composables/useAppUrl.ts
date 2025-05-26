import { ref } from "vue";
import { cdnUrl, streamUrl } from "@/composables/AppConfig";

interface ITrustedHosts {
  host: string;
  url: string;
  core_cdn: string;
  stream_url: string;
}

const trustedHosts: ITrustedHosts[] = [
  {
    host: "https://tiu.nextlms.uz/api",
    url: "https://tiu.nextlms.uz/api",
    core_cdn: cdnUrl.value,
    stream_url: streamUrl.value,
  },
  {
    host: "https://tiu.nextlms.uz/api",
    url: "https://tiu.nextlms.uz/api",
    core_cdn: cdnUrl.value,
    stream_url: "https://tiu.nextlms.uz/api",
  },
];

export const useAppUrl = () => {
  const baseURL = ref<string>("https://tiu.nextlms.uz/api");
  const domain = ref<string>("https://tiu.nextlms.uz/api");
  const core_cdn = ref<string>(cdnUrl.value);
  const stream_url = ref<string>(streamUrl.value);
  trustedHosts.forEach((el) => {
    if (window.location.href.indexOf(el.host) > -1) {
      baseURL.value = el.url;
      domain.value = el.host;
      core_cdn.value = el.core_cdn;
      stream_url.value = el.stream_url;
    }
  });

  return { domain, baseURL, core_cdn, stream_url };
};
