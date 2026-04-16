import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AdminCreateRecipeParams,
  AdminUpdateRecipeParams,
  AdminGetRecipesResponse,
  AdminGetRecipesPagedResponse,
  AdminGetRecipeResponse,
  AdminCreateRecipeResponse,
  AdminUpdateRecipeResponse,
  AdminDelRecipeResponse,
} from '@/types/admin/adminRecipe';

// 取得環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立 axios 實例
const recipeApi = axios.create({
  baseURL: BASE_URL,
});

// 在發送 API 前執行
recipeApi.interceptors.request.use(
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
recipeApi.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response.data);
  },
);

// 管理員 - 取得所有食譜列表（不分頁）
export const apiAdminGetRecipes = ({
  sort = 'desc',
}: {
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetRecipesResponse>> =>
  recipeApi.get(`${API_PATH}/admin/recipes`, {
    params: {
      sort: sort ? sort : undefined,
      noPagination: true,
    },
  });

// 管理員 - 取得所有食譜列表（分頁）
export const apiAdminGetRecipesPaged = ({
  page = 1,
  perPage = 10,
  sort = 'desc',
}: {
  page?: number;
  perPage?: number;
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetRecipesPagedResponse>> =>
  recipeApi.get(`${API_PATH}/admin/recipes`, {
    params: {
      page,
      perPage,
      sort: sort ? sort : undefined,
      noPagination: false,
    },
  });

// 管理員 - 取得指定食譜詳細資訊
export const apiAdminGetRecipe = (id: string): Promise<AxiosResponse<AdminGetRecipeResponse>> =>
  recipeApi.get(`${API_PATH}/admin/recipe/${id}`);

// 管理員 - 新增食譜
export const apiAdminCreateRecipe = (
  data: AdminCreateRecipeParams,
): Promise<AxiosResponse<AdminCreateRecipeResponse>> =>
  recipeApi.post(`${API_PATH}/admin/recipe`, data);

// 管理員 - 更新食譜
export const apiAdminUpdateRecipe = (
  id: string,
  data: AdminUpdateRecipeParams,
): Promise<AxiosResponse<AdminUpdateRecipeResponse>> =>
  recipeApi.patch(`${API_PATH}/admin/recipe/${id}`, data);

// 管理員 - 刪除食譜
export const apiAdminDelRecipe = (id: string): Promise<AxiosResponse<AdminDelRecipeResponse>> =>
  recipeApi.delete(`${API_PATH}/admin/recipe/${id}`);
