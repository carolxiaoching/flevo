import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AdminGetCategoriesResponse,
  AdminGetCategoriesPagedResponse,
  AdminGetCategoryResponse,
  AdminCreateCategoryResponse,
  AdminUpdateCategoryResponse,
  AdminDelCategoryResponse,
} from '@/types/admin/adminCategory';

// 取得環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立 axios 實例
const categoryApi = axios.create({
  baseURL: BASE_URL,
});

// 在發送 API 前執行
categoryApi.interceptors.request.use(
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
categoryApi.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response.data);
  },
);

// 管理員 - 取得所有分類（不分頁）
export const apiAdminGetCategories = ({
  sort = 'desc',
}: {
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetCategoriesResponse>> =>
  categoryApi.get(`${API_PATH}/admin/categories`, {
    params: {
      sort: sort ? sort : undefined,
      noPagination: true,
    },
  });

// 管理員 - 取得所有分類（分頁）
export const apiAdminGetCategoriesPaged = ({
  page = 1,
  perPage = 10,
  sort = 'desc',
}: {
  page?: number;
  perPage?: number;
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetCategoriesPagedResponse>> =>
  categoryApi.get(`${API_PATH}/admin/categories`, {
    params: {
      page: page ? page : undefined,
      perPage: perPage ? perPage : undefined,
      sort: sort ? sort : undefined,
      noPagination: false,
    },
  });

// 管理員 - 取得指定分類詳細資訊
export const apiAdminGetCategory = (id: string): Promise<AxiosResponse<AdminGetCategoryResponse>> =>
  categoryApi.get(`${API_PATH}/admin/category/${id}`);

// 管理員 - 新增分類
export const apiAdminCreateCategory = (data: {
  title: string;
  categoryImgUrl: string;
}): Promise<AxiosResponse<AdminCreateCategoryResponse>> =>
  categoryApi.post(`${API_PATH}/admin/category`, data);

// 管理員 - 編輯分類
export const apiAdminUpdateCategory = (
  id: string,
  data: {
    title?: string;
    categoryImgUrl?: string;
  },
): Promise<AxiosResponse<AdminUpdateCategoryResponse>> =>
  categoryApi.patch(`${API_PATH}/admin/category/${id}`, data);

// 管理員 - 刪除分類
export const apiAdminDelCategory = (id: string): Promise<AxiosResponse<AdminDelCategoryResponse>> =>
  categoryApi.delete(`${API_PATH}/admin/category/${id}`);
