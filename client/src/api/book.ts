import { AddBookType } from '../models/AddBook';
import BookViewModel from '../models/BookViewModel';
import LibraryViewModel from '../models/LibraryViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export const postBook = async (book: AddBookType) => {
  const response = await fetch(base + '/Books', {
    method: 'post',
    body: JSON.stringify(book),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (response.status !== 201) {
    const data = await response.json();
    throw new Error(`${data.code}:${data.resourceId}`);
  }

  return response;
};

export async function getBooks() {
  const response = await fetch(base + '/Books');
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return BookViewModel.array().parse(data);
}

export async function getBook(id: string) {
  const response = await fetch(base + '/Books/' + id);
  const data = await response.json();
  return BookViewModel.parse(data);
}

export async function getLibrariesWithBook(bookId: string) {
  const response = await fetch(base + '/Books/' + bookId + '/Libraries');
  const data = await response.json();

  return LibraryViewModel.array().parse(data) ?? [];
}

export async function searchBooks(query: string) {
  const response = await fetch(base + '/Books?query=' + query);
  const data = await response.json();
  return BookViewModel.array().parse(data);
}

