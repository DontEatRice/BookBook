import { AddBookType } from '../models/AddBook';
import BookViewModel from '../models/BookViewModel';
import LibraryViewModel from '../models/LibraryViewModel';
import { PaginationRequest, paginatedFetch, paginatedResponse } from '../utils/utils';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
const BooksPaginated = paginatedResponse(BookViewModel);

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
}

export const updateBook = async ({ id, book }: { id: string; book: AddBookType }) => {
  const response = await fetch(base + '/Books/' + id, {
    method: 'put',
    body: JSON.stringify(book),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (response.status !== 201) {
    const data = await response.json();
    throw new Error(`${data.code}:${data.resourceId}`);
  }

  return response;
};

export const deleteBook = async (bookId: string) => {
  const response = await fetch(base + '/Books/' + bookId, {
      method: 'delete',
      //TODO - przetestowac wywalenie body i headers
      body: JSON.stringify(bookId),
      headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  
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
  //endpoint powinien działać zarówno dla zalogowanego i anonima
  let auth = '';
  try {
    auth = await getAuthToken();
  } catch (err) {
    // w momencie gdy metoda getAuthToken rzuci błąd po prostu zostawiamy auth puste
  }

  const response = await fetch(base + '/Books/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  const data = await response.json();
  return BookViewModel.parse(data);
}

export async function getLibrariesWithBook(bookId: string) {
  const response = await fetch(base + '/Books/' + bookId + '/Libraries');
  const data = await response.json();

  return LibraryViewModel.array().parse(data) ?? [];
}

export async function searchBooks(args: PaginationRequest & { query?: string }) {
  const response = await paginatedFetch(base + '/Books/search', args);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return BooksPaginated.parse(data);
}
