export type Tag = {
  _id: string;
  title: string;
};

export type GetTagsResponse = {
  status: string;
  data: Tag[];
};
