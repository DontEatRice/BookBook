import { AddAuthorType } from '../models/AddAuthor';
import AuthorViewModel from '../models/AuthorViewModel';
import BookViewModel from '../models/BookViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export const postAuthor = async (author: AddAuthorType) => {
  delete author.avatarPicture;
  const response = await fetch(base + '/Authors', {
    method: 'post',
    body: JSON.stringify(author),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export async function getAuthors() {
  const response = await fetch(base + '/Authors');
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return AuthorViewModel.array().parse(data);
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

