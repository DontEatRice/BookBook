import { AddAuthorType } from '../models/AddAuthor';
import AuthorViewModel from '../models/AuthorViewModel';
import { fileToBase64 } from '../utils/utils';

const base = import.meta.env.VITE_API_BASE_URL;

export const postAuthor = async (author: AddAuthorType) => {
  const { avatarPicture: file, ...authorData } = author;
  let avatarPicture: string | undefined;
  if (file) {
    avatarPicture = await fileToBase64(file);
  }
  const response = await fetch(base + '/Authors', {
    method: 'post',
    body: JSON.stringify({ avatarPicture, ...authorData }),
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
