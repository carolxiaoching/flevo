export type Image = {
  _id: string;
  type: 'photo' | 'avatar' | 'icon';
  imageUrl: string;
};

export type ImageDetail = Image & {
  imagePath: string;
  user: {
    _id: string;
    nickName: string;
    avatarImgUrl: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type DelImageResponse = {
  status: string;
  data: ImageDetail;
};

export type CreateImageResponse = {
  status: string;
  data: Image;
};
