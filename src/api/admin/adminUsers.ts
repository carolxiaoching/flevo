import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AdminSignInResponse,
  AdminCheckLoginResponse,
  AdminGetUsersResponse,
  AdminGetUsersPagedResponse,
  AdminGetUserResponse,
  AdminUpdateUserParams,
  AdminUpdateUserResponse,
  AdminDelUserResponse,
} from '@/types/admin/adminUser';

// 取得環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立 axios 實例
const userApi = axios.create({
  baseURL: BASE_URL,
});

// 在發送 API 前執行
userApi.interceptors.request.use(
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
userApi.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response.data);
  },
);

// 管理員登入
export const apiAdminSignIn = (data: {
  email: string;
  password: string;
}): Promise<AxiosResponse<AdminSignInResponse>> =>
  userApi.post(`${API_PATH}/admin/member/signIn`, data);

// 確認管理員登入狀態
export const apiCheckLoginStatus = (): Promise<AxiosResponse<AdminCheckLoginResponse>> =>
  userApi.post(`${API_PATH}/admin/member/checkLoginStatus`);

// 管理員 - 取得所有會員資料（不分頁）
export const apiAdminGetUsers = ({
  sort = 'desc',
}: {
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetUsersResponse>> =>
  userApi.get(`${API_PATH}/admin/members`, {
    params: {
      sort: sort ? sort : undefined,
      noPagination: true,
    },
  });

// 管理員 - 取得所有會員資料（分頁）
export const apiAdminGetUsersPaged = ({
  page = 1,
  perPage = 10,
  sort = 'desc',
}: {
  page?: number;
  perPage?: number;
  sort?: string;
} = {}): Promise<AxiosResponse<AdminGetUsersPagedResponse>> =>
  userApi.get(`${API_PATH}/admin/members`, {
    params: {
      page: page ? page : undefined,
      perPage: perPage ? perPage : undefined,
      sort: sort ? sort : undefined,
      noPagination: false,
    },
  });

// 管理員 - 取得指定會員詳細資訊
export const apiAdminGetUser = (id: string): Promise<AxiosResponse<AdminGetUserResponse>> =>
  userApi.get(`${API_PATH}/admin/member/${id}`);

// 管理員 - 編輯會員
export const apiAdminUpdateUser = (
  id: string,
  data: AdminUpdateUserParams,
): Promise<AxiosResponse<AdminUpdateUserResponse>> =>
  userApi.patch(`${API_PATH}/admin/member/${id}`, data);

// 管理員 - 刪除會員
export const apiAdminDelUser = (id: string): Promise<AxiosResponse<AdminDelUserResponse>> =>
  userApi.delete(`${API_PATH}/admin/member/${id}`);
