import type { Pagination } from '@/types/common';

export type AdminUser = {
  _id: string;
  nickName: string;
  avatarImgUrl: string;
  gender: 'male' | 'female' | 'secret';
  description: string;
};

export type AdminUserDetail = AdminUser & {
  email: string;
  role: 'member' | 'admin';
  collects: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminSignInResponse = {
  status: string;
  data: {
    token: string;
    user: AdminUser;
  };
};

export type AdminCheckLoginResponse = {
  status: string;
  data: {
    token: string;
    user: AdminUser;
  };
};

export type AdminGetUsersResponse = {
  status: string;
  data: AdminUserDetail[];
};

export type AdminGetUsersPagedResponse = {
  status: string;
  data: {
    results: AdminUserDetail[];
    pagination: Pagination;
  };
};

export type AdminGetUserResponse = {
  status: string;
  data: AdminUserDetail & { recipeCount: number; collectCount: number };
};

export type AdminUpdateUserParams = {
  nickName?: string;
  avatarImgUrl?: string;
  gender?: 'male' | 'female' | 'secret';
  description?: string;
  role?: 'member' | 'admin';
};

export type AdminUpdateUserResponse = {
  status: string;
  data: AdminUserDetail & { recipeCount: number; collectCount: number };
};

export type AdminDelUserResponse = {
  status: string;
  data: AdminUserDetail;
};
