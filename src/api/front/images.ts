import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { DelImageResponse, CreateImageResponse } from '@/types/front/image';

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

// 刪除圖片
export const apiDelImage = (id: string): Promise<AxiosResponse<DelImageResponse>> =>
  imageApi.delete(`${API_PATH}/api/image/${id}`);

// 建立圖片
export const apiCreateImage = (
  data: FormData,
  type: string,
): Promise<AxiosResponse<CreateImageResponse>> =>
  imageApi.post(`${API_PATH}/api/image?type=${type}`, data);
