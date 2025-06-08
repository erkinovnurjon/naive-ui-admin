import ApiService from "../apiService";

const VideoFileService = {
  UploadVideo(data: any) {
    return ApiService.formData("VideoFile/UploadVideo", data);
  },
};
export default VideoFileService;
