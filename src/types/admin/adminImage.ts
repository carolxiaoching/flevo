import type { Pagination } from '@/types/common';

export type AdminImage = {
  _id: string;
  type: 'photo' | 'avatar' | 'icon';
  imageUrl: string;
};

export type AdminImageDetail = AdminImage & {
  imagePath: string;
  user: {
    _id: string;
    nickName: string;
    avatarImgUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type AdminGetImagesResponse = {
  status: string;
  data: AdminImageDetail[];
};

export type AdminGetImagesPagedResponse = {
  status: string;
  data: {
    results: AdminImageDetail[];
    pagination: Pagination;
  };
};

export type AdminGetImageResponse = {
  status: string;
  data: AdminImageDetail;
};

export type AdminDelImageResponse = {
  status: string;
  data: AdminImageDetail;
};

export type AdminCreateImageResponse = {
  status: string;
  data: AdminImage;
};
