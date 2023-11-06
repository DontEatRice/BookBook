import { AddAuthorType } from '../models/AddAuthor';
import AuthorViewModel from '../models/AuthorViewModel';
import BookViewModel from '../models/BookViewModel';
import { PaginationRequest } from '../utils/constants';
import { paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';

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

export async function getAuthors(args: PaginationRequest & { query?: string }) {
  const response = await paginatedFetch(base + '/authors/search', args);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return AuthorSearchResponse.parse(data);
}

export async function getAuthor(authorId: string) {
  const response = await fetch(base + '/Authors/' + authorId);
  const data = await response.json();

  return AuthorViewModel.parse(data);
}

export async function getAuthorBookCards(authorId: string) {
  const response = await fetch(base + `/Authors/${authorId}/book-cards`);
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return BookViewModel.array().parse(data);
}
