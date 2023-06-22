import { BookCategoryViewModelType } from '../models/BookCategoryViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export const postCategory = (category: BookCategoryViewModelType) => {
  return fetch(base + '/api/category', { method: 'post', body: JSON.stringify(category) }).then((data) =>
    data.json()
  );
};
