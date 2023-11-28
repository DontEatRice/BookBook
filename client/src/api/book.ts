import { AddBookType } from '../models/AddBook';
import BookViewModel from '../models/BookViewModel';
import BookInRankingViewModel from '../models/BookInRankingViewModel';
import LibraryViewModel from '../models/LibraryViewModel';
import { UpdateBookType } from '../models/UpdateBook';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthTokenOrNull } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
const BooksPaginated = paginatedResponse(BookViewModel);
const RankingPaginated = paginatedResponse(BookInRankingViewModel);

export const postBook = async (book: AddBookType) => {
  const response = await fetch(base + '/Books', {
    method: 'post',
    body: JSON.stringify(book),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export const updateBook = async ({ id, book }: { id: string; book: UpdateBookType }) => {
  const copy = {
    ...book,
    publisher: null,
    authors: null,
    bookCategories: null,
    idPublisher: book.publisher?.id,
    categoriesIds: book.bookCategories.map((x) => x.id),
    authorsIDs: book.authors.map((x) => x.id),
  };
  const response = await fetch(base + '/Books/' + id, {
    method: 'put',
    body: JSON.stringify(copy),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }

  return response;
};

export const deleteBook = async (bookId: string) => {
  const response = await fetch(base + '/Books/' + bookId, {
    method: 'delete',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }

  return response;
};

export async function getBooks() {
  const response = await fetch(base + '/Books');
  const data = await response.json();
  return BookViewModel.array().parse(data);
}

export async function getBook(id: string) {
  const response = await fetch(base + '/Books/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: (await getAuthTokenOrNull()) ?? '',
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

export async function searchBooks(
  args: PaginationRequest & {
    query?: string;
    authorId?: string;
    categoryId?: string;
    yearPublished?: number;
  }
) {
  const response = await paginatedFetch(base + '/Books/search', args);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return BooksPaginated.parse(data);
}

export async function bookRanking(args: PaginationRequest) {
  const response = await paginatedFetch(base + '/Books/ranking', args);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return RankingPaginated.parse(data);
}

