import ApiService from "../apiService";

const UserService = {
  GetList(data: any) {
    return ApiService.post("user/GetList", data);
  },
  Get() {
    return ApiService.get("user/Get");
  },
  GetId(id: number) {
    return ApiService.get(`user/Get/${id}`);
  },
  GetAsselectlist() {
    return ApiService.get("user/GetAsSelectList");
  },
  Create(data: any) {
    if (data.id == 0) {
      return ApiService.post("user/Create", data);
    } else {
      return ApiService.post("user/Update", data);
    }
  },
  Update(data: any) {
    return ApiService.post("user/Update", data);
  },
  Delete(id: number) {
    return ApiService.post(`user/Delete/${id}`);
  },
};
export default UserService;
