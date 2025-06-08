import ApiService from "../apiService";

const RoleService = {
  GetList(data: any) {
    return ApiService.post("Role/GetList", data);
  },
  Get() {
    return ApiService.get("Role/Get");
  },
  GetId(id: number) {
    return ApiService.get(`Role/Get/${id}`);
  },
  GetAsselectlist() {
    return ApiService.get("Role/GetAsSelectList");
  },
  Create(data: any) {
    return ApiService.post("Role/Create", data);
  },
  Update(data: any) {
    return ApiService.post("Role/Update", data);
  },
  Delete(id: number) {
    return ApiService.post(`Role/Delete/${id}`);
  },
};
export default RoleService;
