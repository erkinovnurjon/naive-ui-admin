import ApiService from "../apiService";

const OrganizationService = {
  GetList(data: any) {
    return ApiService.post("Organization/GetSyncDataList", data);
  },
  Get() {
    return ApiService.get("Organization/Get");
  },
  GetId(id: number) {
    return ApiService.get(`Organization/Get/${id}`);
  },
  GetAsselectlist() {
    return ApiService.get("Organization/GetAsSelectList");
  },
  Create(data: any) {
    return ApiService.post("Organization/ReSyncData", data);
  },
  Update(data: any) {
    return ApiService.post("Organization/Update", data);
  },
  Delete(id: number) {
    return ApiService.post(`Organization/Delete/${id}`);
  },
};
export default OrganizationService;
