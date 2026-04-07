import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { GetTagsResponse } from '@/types/front/tag';

// 取得環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立 axios 實例
const tagApi = axios.create({
  baseURL: BASE_URL,
});

// 在發送 API 前執行
tagApi.interceptors.request.use(
  request => {
    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

// 在接收到伺服器回應後執行
tagApi.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response.data);
  },
);

// 取得所有標籤
export const apiGetTags = (): Promise<AxiosResponse<GetTagsResponse>> =>
  tagApi.get(`${API_PATH}/api/tags`);
