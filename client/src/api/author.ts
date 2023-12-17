import { AddAuthorType } from '../models/author/AddAuthor';
import AuthorViewModel from '../models/author/AuthorViewModel';
import BookViewModel from '../models/BookViewModel';
import { UpdateAuthorType } from '../models/author/UpdateAuthor';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthTokenOrNull } from './auth';

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
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export const deleteAuthor = async (authorId: string) => {
  const response = await fetch(base + '/Authors/' + authorId, {
    method: 'delete',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};



export async function getAuthors(body: PaginationRequest & {query?: string}) {
  const response = await paginatedFetch(base + '/authors/search', body);
  const data = await response.json();

  if (!response.ok) {
    await handleBadResponse(response);
  }
  return AuthorSearchResponse.parse(data);
}

export async function getAuthor(id: string) {
  const response = await fetch(base + '/Authors/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: (await getAuthTokenOrNull()) ?? '',
    }),
  });
  const data = await response.json();
  return AuthorViewModel.parse(data);
}

export async function getAuthorBookCards(authorId: string) {
  const response = await fetch(base + `/Authors/${authorId}/book-cards`);
  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return BookViewModel.array().parse(data);
}
