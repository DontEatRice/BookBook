import { AddAuthorType } from '../models/AddAuthor';
import AuthorViewModel from '../models/AuthorViewModel';
import { UpdateAuthorType } from '../models/UpdateAuthor';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
const AuthorSearchResponse = paginatedResponse(AuthorViewModel);

export const postAuthor = async (author: AddAuthorType) => {
  delete author.avatarPicture;
  const response = await fetch(base + '/Authors', {
    method: 'post',
    body: JSON.stringify(author),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export const updateAuthor = async ({ id, author }: { id: string; author: UpdateAuthorType }) => {
  const response = await fetch(base + '/Authors/' + id, {
    method: 'put',
    body: JSON.stringify(author),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export const deleteAuthor = async (authorId: string) => {
  const response = await fetch(base + '/Authors/' + authorId, {
      method: 'delete',
      //TODO - przetestowac wywalenie body i headers
      body: JSON.stringify(authorId),
      headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export async function getAuthors(body: PaginationRequest) {
  const response = await paginatedFetch(base + '/authors/search', body);
  const data = await response.json();

  if (!response.ok) {
    await handleBadResponse(response);
  }
  return AuthorSearchResponse.parse(data);
};

export async function getAuthor(id: string) {
  //endpoint powinien działać zarówno dla zalogowanego i anonima
  let auth = '';
  try {
    auth = await getAuthToken();
  } catch (err) {
    // w momencie gdy metoda getAuthToken rzuci błąd po prostu zostawiamy auth puste
  }

  const response = await fetch(base + '/Authors/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  const data = await response.json();
  return AuthorViewModel.parse(data);
};