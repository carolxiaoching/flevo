import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AdminGetImagesResponse,
  AdminGetImagesPagedResponse,
  AdminGetImageResponse,
  AdminCreateImageResponse,
  AdminDelImageResponse,
} from '@/types/admin/adminImage';

// 取得環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立 axios 實例
const imageApi = axios.create({
  baseURL: BASE_URL,
});

// 在發送 API 前執行
imageApi.interceptors.request.use(
  request => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)flevoFront\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

// 在接收到伺服器回應後執行
imageApi.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response.data);
  },
);

// 管理員 - 取得所有圖片（不分頁）
export const apiAdminGetImages = ({
  sort = 'desc',
}: {
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetImagesResponse>> =>
  imageApi.get(`${API_PATH}/admin/images`, {
    params: {
      sort: sort ? sort : undefined,
      noPagination: true,
    },
  });

// 管理員 - 取得所有圖片（分頁）
export const apiAdminGetImagesPaged = ({
  page = 1,
  perPage = 10,
  sort = 'desc',
}: {
  page?: number;
  perPage?: number;
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetImagesPagedResponse>> =>
  imageApi.get(`${API_PATH}/admin/images`, {
    params: {
      page: page ? page : undefined,
      perPage: perPage ? perPage : undefined,
      sort: sort ? sort : undefined,
      noPagination: false,
    },
  });

// 管理員 - 取得指定圖片詳細資訊
export const apiAdminGetImage = (id: string): Promise<AxiosResponse<AdminGetImageResponse>> =>
  imageApi.get(`${API_PATH}/admin/image/${id}`);

// 刪除圖片
export const apiAdminDelImage = (id: string): Promise<AxiosResponse<AdminDelImageResponse>> =>
  imageApi.delete(`${API_PATH}/admin/image/${id}`);

// 建立圖片
export const apiAdminCreateImage = (
  data: FormData,
  type: string,
): Promise<AxiosResponse<AdminCreateImageResponse>> =>
  imageApi.post(`${API_PATH}/admin/image?type=${type}`, data);
