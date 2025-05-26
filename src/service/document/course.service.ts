import ApiService from "../apiService";

const CourseService = {
  GetList(data: any) {
    return ApiService.post("Course/GetList", data);
  },
  Get(id: any) {
    return ApiService.get(`Course/Get/${id}`);
  },
  GetId() {
    return ApiService.get("Course/Get");
  },
  Create(data: any) {
    return ApiService.post("Course/Create", data);
  },
  Delete(id: number) {
    return ApiService.post(`Course/Delete/${id}`);
  },
  Update(data: any) {
    return ApiService.post("Course/Update", data);
  },
  ParseQuestions(data: any) {
    return ApiService.formData("Course/ParseQuestions", data);
  },
  AsSelectList() {
    return ApiService.get("Course/AsSelectList");
  },
  GetStudentsForLessonTest(data: any) {
    return ApiService.post("Course/GetStudentsForLessonTest", data);
  },
  GetStudentLessonTestAttempt(lessonTestAttemptId: number) {
    return ApiService.get(
      `Course/GetStudentLessonTestAttempt?lessonTestAttemptId=${lessonTestAttemptId}`
    );
  },
};
export default CourseService;
