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

export type Recipe = {
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

export type RecipeDetail = Recipe & {
  ingredients: Ingredient[];
  nutritionFacts: NutritionFacts;
  steps: Step[];
  note: string;
};

export type CreateRecipeParams = {
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
  tags?: string[];
};

export type UpdateRecipeParams = Partial<CreateRecipeParams>;

export type RecipeFormData = CreateRecipeParams & {
  _id?: string;
  isRecommended?: boolean;
};

export type GetRecipesResponse = {
  status: string;
  data: {
    results: Recipe[];
    pagination: Pagination;
  };
};

export type GetUserRecipesResponse = {
  status: string;
  data: {
    results: Recipe[];
    pagination: Pagination;
  };
};

export type GetRecipeResponse = {
  status: string;
  data: RecipeDetail;
};

export type GetMyRecipesResponse = {
  status: string;
  data: {
    results: Recipe[];
    pagination: Pagination;
  };
};

export type CreateRecipeResponse = {
  status: string;
  data: Omit<RecipeDetail, 'user'> & {
    user: string;
  };
};

export type UpdateRecipeResponse = {
  status: string;
  data: RecipeDetail;
};

export type DelRecipeResponse = {
  status: string;
  data: RecipeDetail;
};

export type CreateCollectResponse = {
  status: string;
  data: {
    recipeId: string;
    userId: string;
  };
};

export type DelCollectResponse = {
  status: string;
  data: {
    recipeId: string;
    userId: string;
  };
};
