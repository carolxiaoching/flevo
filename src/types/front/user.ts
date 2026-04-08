import type { Recipe } from '@/types/front/recipe';

export type Pagination = {
  totalPage: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type User = {
  _id: string;
  nickName: string;
  avatarImgUrl: string;
  gender: 'male' | 'female' | 'secret';
  description: string;
};

export type UserDetail = User & {
  collects: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  recipeCount: number;
  collectCount: number;
};

export type SignInResponse = {
  status: string;
  data: {
    token: string;
    user: User;
  };
};

export type SignUpResponse = {
  status: string;
  data: {
    token: string;
    user: User;
  };
};

export type ForgotPasswordResponse = {
  status: string;
  data: string;
};

export type ResetPasswordResponse = {
  status: string;
  data: {
    token: string;
    user: User;
  };
};

export type GetUserPublicProfileResponse = {
  status: string;
  data: UserDetail;
};

export type GetMyProfileResponse = {
  status: string;
  data: { email: string } & UserDetail;
};

export type UpdateProfileResponse = {
  status: string;
  data: { email: string } & UserDetail;
};

export type UpdatePasswordResponse = {
  status: string;
  data: {
    token: string;
    user: User;
  };
};

export type GetUserCollectListResponse = {
  status: string;
  data: {
    results: Recipe[];
    pagination: Pagination;
  };
};
