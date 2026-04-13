import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  SignInResponse,
  SignUpResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  GetUserPublicProfileResponse,
  GetMyProfileResponse,
  UpdateProfileResponse,
  UpdatePasswordResponse,
  GetUserCollectListResponse,
} from '@/types/front/user';

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

// 註冊
export const apiSignUp = (data: {
  nickName: string;
  password: string;
  confirmPassword: string;
  email: string;
}): Promise<AxiosResponse<SignUpResponse>> => userApi.post(`${API_PATH}/api/user/signUp`, data);

// 登入
export const apiSignIn = (data: {
  email: string;
  password: string;
}): Promise<AxiosResponse<SignInResponse>> => userApi.post(`${API_PATH}/api/user/signIn`, data);

// 忘記密碼 - 發送重設密碼郵件
export const apiForgetPassword = (data: {
  email: string;
}): Promise<AxiosResponse<ForgotPasswordResponse>> =>
  userApi.post(`${API_PATH}/api/forget-password`, data);

// 忘記密碼 - 重設密碼
export const apiResetPassword = (data: {
  password: string;
  confirmPassword: string;
}): Promise<AxiosResponse<ResetPasswordResponse>> =>
  userApi.post(`${API_PATH}/api/reset-password`, data);

// 取得會員公開資料
export const apiGetUserPublicProfile = (
  id: string,
): Promise<AxiosResponse<GetUserPublicProfileResponse>> =>
  userApi.get(`${API_PATH}/api/user/${id}/profile`);

// 取得會員自己資料
export const apiGetMyProfile = (): Promise<AxiosResponse<GetMyProfileResponse>> =>
  userApi.get(`${API_PATH}/api/user/profile`);

// 更新會員資料
export const apiUpdateProfile = (data: {
  nickName?: string;
  gender?: 'male' | 'female' | 'secret';
  avatarImgUrl?: string;
  description?: string;
}): Promise<AxiosResponse<UpdateProfileResponse>> =>
  userApi.patch(`${API_PATH}/api/user/profile`, data);

// 更新會員密碼
export const apiUpdatePassword = (data: {
  password: string;
  confirmPassword: string;
}): Promise<AxiosResponse<UpdatePasswordResponse>> =>
  userApi.post(`${API_PATH}/api/user/updatePassword`, data);

// 取得會員收藏列表
export const apiGetCollectList = ({
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
} = {}): Promise<AxiosResponse<GetUserCollectListResponse>> =>
  userApi.get(`${API_PATH}/api/user/getCollectList`, {
    params: {
      page,
      perPage,
      sort: sort ? sort : undefined,
      category: category && category !== '全部' ? category : undefined,
      keyword: keyword ? keyword : undefined,
      tags: tags.length ? tags.join(',') : undefined,
    },
  });
