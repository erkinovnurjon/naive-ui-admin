import axios from "axios";
import { useAppUrl } from "@/composables/useAppUrl";

const MediaService = {
  Upload(data: any) {
    const { core_cdn } = useAppUrl();
    const baseURL = `${core_cdn.value}/Media/`;
    return axios.post(`${baseURL}Upload`, data);
  },

  UploadPPT(data: any) {
    const { core_cdn } = useAppUrl();
    const baseURL = `${core_cdn.value}/Media/`;
    return axios.post(`${baseURL}UploadPPT`, data);
  },

  async Get(entityName: string, fileId: string) {
    const { core_cdn } = useAppUrl();
    const baseURL = `${core_cdn.value}/Media/`;
    try {
      const response = await axios.get(
        `${baseURL}Get?entityName=${entityName}&fileId=${fileId}`,
        { responseType: "blob" }
      );
      return response.data;
    } catch (error) {
      console.error("Faylni olishda xato:", error);
      throw error;
    }
  },
};

export default MediaService;
