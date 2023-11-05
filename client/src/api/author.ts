import { AddAuthorType } from '../models/AddAuthor';
import AuthorViewModel from '../models/AuthorViewModel';
import { PaginationRequest, paginatedFetch, paginatedResponse } from '../utils/utils';

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

export async function getAuthors(args: PaginationRequest & {query?: string}) {
  const response = await paginatedFetch(base + '/authors/search', args);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return AuthorSearchResponse.parse(data);
}
