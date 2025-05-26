import ApiService from "../apiService";

const AccountService = {
  Login(data: any) {
    return ApiService.post("account/Login", data);
  },
  GetUserInfo() {
    return ApiService.get("account/GetUserInfo");
  },
  HemisLogin(data: any) {
    return ApiService.post("account/HemisLogin", data);
  },
  ChangePassword(data: any) {
    return ApiService.post("account/ChangePassword", data);
  },
};
export default AccountService;
