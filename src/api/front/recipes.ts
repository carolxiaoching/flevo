import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  CreateRecipeParams,
  UpdateRecipeParams,
  GetRecipesResponse,
  GetUserRecipesResponse,
  GetRecipeResponse,
  GetMyRecipesResponse,
  CreateRecipeResponse,
  UpdateRecipeResponse,
  DelRecipeResponse,
  CreateCollectResponse,
  DelCollectResponse,
} from '@/types/front/recipe';

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

// 取得所有食譜列表（分頁）
export const apiGetRecipes = ({
  page = 1,
  perPage = 9,
  sort = 'desc',
  category = '',
  keyword = '',
  tags = [],
  isRecommended,
}: {
  page?: number;
  perPage?: number;
  sort?: string;
  category?: string;
  keyword?: string;
  tags?: string[];
  isRecommended?: boolean;
} = {}): Promise<AxiosResponse<GetRecipesResponse>> =>
  recipeApi.get(`${API_PATH}/api/publicRecipes`, {
    params: {
      page,
      perPage,
      sort: sort ? sort : undefined,
      category: category && category !== '全部' ? category : undefined,
      keyword: keyword ? keyword : undefined,
      tags: tags.length ? tags.join(',') : undefined,
      isRecommended: isRecommended ?? undefined,
    },
  });

// 取得指定會員所有食譜列表（分頁）
export const apiGetUserRecipes = (
  userId: string,
  {
    page = 1,
    perPage = 8,
    sort = 'desc',
    category = '',
    keyword = '',
    tags = [],
  }: {
    page?: number;
    perPage?: number;
    sort?: string;
    category?: string;
    keyword?: string;
    tags?: string[];
  } = {},
): Promise<AxiosResponse<GetUserRecipesResponse>> =>
  recipeApi.get(`${API_PATH}/api/publicRecipes/user/${userId}`, {
    params: {
      page,
      perPage,
      sort: sort ? sort : undefined,
      category: category && category !== '全部' ? category : undefined,
      keyword: keyword ? keyword : undefined,
      tags: tags.length ? tags.join(',') : undefined,
    },
  });

// 取得指定食譜詳細資訊
export const apiGetRecipe = (id: string): Promise<AxiosResponse<GetRecipeResponse>> =>
  recipeApi.get(`${API_PATH}/api/recipe/${id}`);

// 取得我的食譜列表（分頁）
export const apiGetMyRecipes = ({
  page = 1,
  perPage = 9,
  sort = 'desc',
  category = '',
  keyword = '',
  tags = [],
  isPublic,
}: {
  page?: number;
  perPage?: number;
  sort?: string;
  category?: string;
  keyword?: string;
  tags?: string[];
  isPublic?: boolean;
} = {}): Promise<AxiosResponse<GetMyRecipesResponse>> =>
  recipeApi.get(`${API_PATH}/api/recipes`, {
    params: {
      page,
      perPage,
      sort: sort ? sort : undefined,
      category: category && category !== '全部' ? category : undefined,
      keyword: keyword ? keyword : undefined,
      tags: tags.length ? tags.join(',') : undefined,
      isPublic: isPublic ?? undefined,
    },
  });

// 新增食譜
export const apiCreateRecipe = (
  data: CreateRecipeParams,
): Promise<AxiosResponse<CreateRecipeResponse>> => recipeApi.post(`${API_PATH}/api/recipe`, data);

// 更新食譜
export const apiUpdateRecipe = (
  id: string,
  data: UpdateRecipeParams,
): Promise<AxiosResponse<UpdateRecipeResponse>> =>
  recipeApi.patch(`${API_PATH}/api/recipe/${id}`, data);

// 刪除食譜
export const apiDelRecipe = (id: string): Promise<AxiosResponse<DelRecipeResponse>> =>
  recipeApi.delete(`${API_PATH}/api/recipe/${id}`);

// 收藏食譜
export const apiCreateCollect = (id: string): Promise<AxiosResponse<CreateCollectResponse>> =>
  recipeApi.post(`${API_PATH}/api/recipe/${id}/collect`);

// 取消收藏食譜
export const apiDelCollect = (id: string): Promise<AxiosResponse<DelCollectResponse>> =>
  recipeApi.delete(`${API_PATH}/api/recipe/${id}/collect`);
