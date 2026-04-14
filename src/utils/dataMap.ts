import type { Category } from '@/types/front/category';
import type { Tag } from '@/types/front/tag';

// 利用分類 ID 取得分類名稱
export function getCategoryName(categoriesValue: Category[], categoryId: string): string {
  const category = categoriesValue.find(item => item._id === categoryId);
  return category ? category.title : '未分類';
}

// 利用標籤 ID 取得標籤名稱
export function getTagName(tagsValue: Tag[], tagId: string): string {
  const tag = tagsValue.find(item => item._id === tagId);
  return tag ? tag.title : '';
}
