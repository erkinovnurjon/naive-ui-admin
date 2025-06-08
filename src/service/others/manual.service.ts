import ApiService from "../apiService";

const ManualService = {
  GetModuleSelectList() {
    return ApiService.get("manual/GetModuleSelectList");
  },
  EduPairSelectList() {
    return ApiService.get("manual/EduPairSelectList");
  },
  EduSemesterSelectList() {
    return ApiService.get("manual/EduSemesterSelectList");
  },
  EduYearList() {
    return ApiService.get("manual/EduYearList");
  },
  EduSemesterSelectList2(curriculumId: number, eduYearId: number) {
    return ApiService.get(
      `manual/EduSemesterSelectList?curriculumId=${curriculumId}&eduYearId=${eduYearId}`
    );
  },
  EmployeeSelectList() {
    return ApiService.get("manual/EmployeeSelectList");
  },
  EduYearSelectList() {
    return ApiService.get("manual/EduYearSelectList");
  },
  EduMarkSelectList() {
    return ApiService.get("manual/EduMarkTypeSelectList");
  },
  EduratingGradeSelectList() {
    return ApiService.get("manual/EduratingGradeSelectList");
  },
  EduTrainingTypeSelectList() {
    return ApiService.get("manual/EduTrainingTypeSelectList");
  },
  EduMarkSystemSelectList() {
    return ApiService.get("manual/EduMarkingSystemSelectList");
  },
  StudentStatusSelectList() {
    return ApiService.get("manual/StudentStatusSelectList");
  },

  EduCurriculumSubjectExamSelectList(
    eduSubjectId: number,
    eduSemesterId: number,
    eduCurriculumId: number
  ) {
    return ApiService.get(
      `manual/EduCurriculumSubjectExamSelectList?eduSubjectId=${eduSubjectId}&eduSemesterId=${eduSemesterId}&eduCurriculumId=${eduCurriculumId}`
    );
  },

  EduRecordTypeSelectList() {
    return ApiService.get("manual/EduRecordTypeSelectList");
  },
  AssignmentTypeSelectList() {
    return ApiService.get("manual/AssignmentTypeSelectList");
  },
  TestTypeSelectList() {
    return ApiService.get("manual/TestTypeSelectList");
  },
  TableSelectList() {
    return ApiService.get("manual/TableSelectList");
  },
  LanguageSelectList() {
    return ApiService.get("manual/LanguageSelectList");
  },
  SyncRatingGrades() {
    return ApiService.post("Organization/SyncRatingGrades");
  },
  SyncMarkTypes() {
    return ApiService.post("Organization/SyncMarkTypes");
  },
  SyncMarkingSystems() {
    return ApiService.post("Organization/SyncMarkingSystems");
  },
};
export default ManualService;
