import ApiService from "../apiService";

const EduSubjectService = {
  GetList(data: any) {
    return ApiService.post("EduSubject/GetList", data);
  },
  GetAsSelectlist() {
    return ApiService.get("EduSubject/AsSelectlist");
  },
  GetAsSelectlist2(curriculumId: number, eduSemesterId: number) {
    return ApiService.get(
      `EduSubject/AsSelectlist?curriculumId=${curriculumId}&eduSemesterId=${eduSemesterId}`
    );
  },
};
export default EduSubjectService;
