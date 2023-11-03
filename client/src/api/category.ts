import { AddCategoryType } from '../models/AddCategory';
import BookCategoryViewModel from '../models/BookCategoryViewModel';
import { PaginationRequest, paginatedFetch, paginatedResponse } from '../utils/utils';

const base = import.meta.env.VITE_API_BASE_URL;
const BookCategorySearchResponse = paginatedResponse(BookCategoryViewModel);

export const postCategory = async (category: AddCategoryType) => {
  const response = await fetch(base + '/BookCategories', {
    method: 'post',
    body: JSON.stringify(category),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export async function getCategories(body: PaginationRequest) {
  const response = await paginatedFetch(base + '/BookCategories/search', body);
  const data = await response.json();

  return BookCategorySearchResponse.parse(data);
}
