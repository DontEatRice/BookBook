import { AddCategoryType } from '../models/AddCategory';
import BookCategoryViewModel from '../models/BookCategoryViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export const postCategory = async (category: AddCategoryType) => {
  const response = await fetch(base + '/BookCategories', {
    method: 'post',
    body: JSON.stringify(category),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export async function getCategories() {
  const response = await fetch(base + '/BookCategories');
  const data = await response.json();

  return BookCategoryViewModel.array().parse(data);
}