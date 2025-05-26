import axios, { AxiosError } from "axios";
import { apiUrl } from "@/composables/AppConfig";
import type { AxiosInstance, AxiosResponse } from "axios";

const API_URL = apiUrl.value;

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (
          error.response?.status === 401 &&
          window.location.pathname !== "/login"
        ) {
          console.log("Autentifikatsiya xatosi");
          window.location.href = "/login";
        } else if (error.response?.status === 500) {
          console.error("Server xatosi");
        }
        return Promise.reject(error);
      }
    );
  }

  public setBaseUrl(url: string) {
    this.axiosInstance.defaults.baseURL = url;
  }
  public async get<T>(url: string, params?: object): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public setHeader() {
    const token = localStorage.getItem("token");
    if (token) {
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }
  formData(resource: string, data: object) {
    return axios.post(resource, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  public removeHeader() {
    axios.defaults.headers.common = {};
    localStorage.removeItem("token");
  }
  public async post<T>(
    url: string,
    data?: object,
    params?: object
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async put<T>(url: string, data: object): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
