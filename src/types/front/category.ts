export type Category = {
  _id: string;
  title: string;
  categoryImgUrl: string;
};

export type GetCategoriesResponse = {
  status: string;
  data: Category[];
};
