import type { Pagination } from '@/types/common';

export type AdminCategory = {
  _id: string;
  title: string;
  categoryImgUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminGetCategoriesResponse = {
  status: string;
  data: AdminCategory[];
};

export type AdminGetCategoriesPagedResponse = {
  status: string;
  data: {
    results: AdminCategory[];
    pagination: Pagination;
  };
};

export type AdminGetCategoryResponse = {
  status: string;
  data: AdminCategory;
};

export type AdminCreateCategoryResponse = {
  status: string;
  data: AdminCategory;
};

export type AdminUpdateCategoryResponse = {
  status: string;
  data: AdminCategory;
};

export type AdminDelCategoryResponse = {
  status: string;
  data: AdminCategory;
};
