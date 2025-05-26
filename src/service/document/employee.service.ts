import ApiService from "../apiService";

const EmployeeService = {
  GetList(data: any) {
    return ApiService.post("Employee/GetList", data);
  },
  GetAsSelectlist() {
    return ApiService.get("Employee/AsSelectlist");
  },
  GetAsSelectlist2(
    eduSemesterId: number,
    eduGroupId: number,
    eduSubjectId: number
  ) {
    return ApiService.get(
      `Employee/AsSelectlist?eduSemesterId=${eduSemesterId}&eduGroupId=${eduGroupId}&eduSubjectId=${eduSubjectId}`
    );
  },
  Sync(payload: any) {
    return ApiService.post("Employee/Sync", payload);
  },
};
export default EmployeeService;
