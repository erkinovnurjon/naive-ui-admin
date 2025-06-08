import ApiService from "../apiService";

const EduGroupService = {
  GetList(data: any) {
    return ApiService.post("EduGroup/GetList", data);
  },
  GetAsSelectlist() {
    return ApiService.get("EduGroup/AsSelectlist");
  },
  GetCourseGroupAsSelectList(courseId: number) {
    return ApiService.get(
      `EduGroup/GetCourseGroupAsSelectList?courseId=${courseId}`
    );
  },
  AttachCourse(courseid: number, groupId: number, subjectId: number) {
    return ApiService.get(
      `EduGroup/AttachCourse?courseid=${courseid}&groupId=${groupId}&subjectId=${subjectId}`
    );
  },
  Sync(data: any) {
    return ApiService.post("EduGroup/Sync", data);
  },
};
export default EduGroupService;
