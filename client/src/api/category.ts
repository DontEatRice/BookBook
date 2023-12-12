import { AddCategoryType } from '../models/AddCategory';
import BookCategoryViewModel, { BookCategoryViewModelType } from '../models/BookCategoryViewModel';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL + '/BookCategories';
export const BookCategorySearchResponse = paginatedResponse(BookCategoryViewModel);

export const postCategory = async (category: AddCategoryType) => {
  const response = await fetch(base, {
    method: 'post',
    body: JSON.stringify(category),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export async function getCategories(body: PaginationRequest) {
  const response = await paginatedFetch(base + '/search', body);
  const data = await response.json();

  if (!response.ok) {
    await handleBadResponse(response);
  }
  return BookCategorySearchResponse.parse(data);
}

export async function getCategory(id: string) {
  const response = await fetch(base + '/' + id, {
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return BookCategoryViewModel.parse(await response.json());
}

export async function editCategory({ id, body }: { id: string; body: BookCategoryViewModelType }) {
  const token = await getAuthToken();
  const response = await fetch(base + '/' + id, {
    method: 'put',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
}
