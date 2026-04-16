import type { Pagination } from '@/types/common';

export type AdminTag = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminGetTagsResponse = {
  status: string;
  data: AdminTag[];
};

export type AdminGetTagsPagedResponse = {
  status: string;
  data: {
    results: AdminTag[];
    pagination: Pagination;
  };
};

export type AdminGetTagResponse = {
  status: string;
  data: AdminTag;
};

export type AdminCreateTagResponse = {
  status: string;
  data: AdminTag;
};

export type AdminUpdateTagResponse = {
  status: string;
  data: AdminTag;
};

export type AdminDelTagResponse = {
  status: string;
  data: AdminTag;
};
