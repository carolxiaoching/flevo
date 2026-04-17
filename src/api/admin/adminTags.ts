import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AdminGetTagsResponse,
  AdminGetTagsPagedResponse,
  AdminGetTagResponse,
  AdminCreateTagResponse,
  AdminUpdateTagResponse,
  AdminDelTagResponse,
} from '@/types/admin/adminTag';

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
tagApi.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response.data);
  },
);

// 管理員 - 取得所有標籤（不分頁）
export const apiAdminGetTags = ({
  sort = 'desc',
}: {
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetTagsResponse>> =>
  tagApi.get(`${API_PATH}/admin/tags`, {
    params: {
      sort: sort ? sort : undefined,
      noPagination: true,
    },
  });

// 管理員 - 取得所有標籤（分頁）
export const apiAdminGetTagsPaged = ({
  page = 1,
  perPage = 10,
  sort = 'desc',
}: {
  page?: number;
  perPage?: number;
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetTagsPagedResponse>> =>
  tagApi.get(`${API_PATH}/admin/tags`, {
    params: {
      page: page ? page : undefined,
      perPage: perPage ? perPage : undefined,
      sort: sort ? sort : undefined,
      noPagination: false,
    },
  });

// 管理員 - 取得指定標籤詳細資訊
export const apiAdminGetTag = (id: string): Promise<AxiosResponse<AdminGetTagResponse>> =>
  tagApi.get(`${API_PATH}/admin/tag/${id}`);

// 管理員 - 新增標籤
export const apiAdminCreateTag = (data: {
  title: string;
}): Promise<AxiosResponse<AdminCreateTagResponse>> => tagApi.post(`${API_PATH}/admin/tag`, data);

// 管理員 - 編輯標籤
export const apiAdminUpdateTag = (
  id: string,
  data: {
    title: string;
  },
): Promise<AxiosResponse<AdminUpdateTagResponse>> =>
  tagApi.patch(`${API_PATH}/admin/tag/${id}`, data);

// 管理員 - 刪除標籤
export const apiAdminDelTag = (id: string): Promise<AxiosResponse<AdminDelTagResponse>> =>
  tagApi.delete(`${API_PATH}/admin/tag/${id}`);
