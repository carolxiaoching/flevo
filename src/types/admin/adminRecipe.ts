import type { Pagination } from '@/types/common';

export type Ingredient = {
  _id?: string;
  ingredientName: string;
  ingredientQty: string;
};

export type NutritionFacts = {
  calories: number;
  protein: number;
  totalFat: number;
  totalCarb: number;
  sodium: number;
  sugar: number;
};

export type Step = {
  _id?: string;
  stepOrder?: number;
  stepContent: string;
};

export type AdminRecipe = {
  _id: string;
  title: string;
  coverImgUrl: string;
  isPublic: boolean;
  category: string;
  user: {
    _id: string;
    nickName: string;
    avatarImgUrl: string;
  };
  cookingTime: '0-15 分鐘' | '15-30 分鐘' | '30 分鐘以上' | '60 分鐘以上';
  description: string;
  servings: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  collectsCount: number;
  isRecommended?: boolean;
};

export type AdminRecipeDetail = AdminRecipe & {
  ingredients: Ingredient[];
  nutritionFacts: NutritionFacts;
  steps: Step[];
  note: string;
};

export type AdminCreateRecipeParams = {
  title: string;
  description: string;
  note: string;
  isPublic: boolean;
  coverImgUrl: string;
  cookingTime: '0-15 分鐘' | '15-30 分鐘' | '30 分鐘以上' | '60 分鐘以上';
  servings: number;
  category: string;
  ingredients: Ingredient[];
  nutritionFacts: NutritionFacts;
  steps: Step[];
  tags: string[];
  isRecommended: boolean;
};

export type AdminUpdateRecipeParams = Partial<AdminCreateRecipeParams>;

export type AdminRecipeFormData = AdminCreateRecipeParams & {
  _id?: string;
  isRecommended?: boolean;
};

export type AdminGetRecipesResponse = {
  status: string;
  data: AdminRecipe[];
};

export type AdminGetRecipesPagedResponse = {
  status: string;
  data: {
    results: AdminRecipe[];
    pagination: Pagination;
  };
};

export type AdminGetRecipeResponse = {
  status: string;
  data: AdminRecipeDetail;
};

export type AdminCreateRecipeResponse = {
  status: string;
  data: Omit<AdminRecipeDetail, 'user'> & {
    user: string;
  };
};

export type AdminUpdateRecipeResponse = {
  status: string;
  data: AdminRecipeDetail;
};

export type AdminDelRecipeResponse = {
  status: string;
  data: AdminRecipeDetail;
};
