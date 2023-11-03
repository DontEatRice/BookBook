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

export async function getAuthors(body: PaginationRequest) {
  const response = await paginatedFetch(base + '/authors/search', body);
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return AuthorSearchResponse.parse(data);
}
