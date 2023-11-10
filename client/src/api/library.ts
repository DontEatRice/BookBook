import { AddBookToLibraryType } from '../models/AddBookToLibrary';
import { AddLibraryType } from '../models/AddLibrary';
import BookInLibraryViewModel from '../models/BookInLibraryViewModel';
import BookViewModel from '../models/BookViewModel';
import LibraryViewModel from '../models/LibraryViewModel';
import { PaginationRequest, paginatedFetch, paginatedResponse } from '../utils/utils';

const base = import.meta.env.VITE_API_BASE_URL;
const LibrarySearchResponse = paginatedResponse(LibraryViewModel);

export async function getLibraries(args: PaginationRequest) {
  const response = await paginatedFetch(base + '/Libraries/search', args);
  const data = await response.json();
  return LibrarySearchResponse.parse(data);
}

export const postLibrary = async (library: AddLibraryType) => {
  const response = await fetch(base + '/Libraries', {
    method: 'post',
    body: JSON.stringify(library),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export const addBookToLibrary = async (addBookToLibrary: AddBookToLibraryType) => {
  const response = await fetch(base + '/Libraries/' + addBookToLibrary.libraryId + '/books', {
    method: 'post',
    body: JSON.stringify(addBookToLibrary),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export async function getBooksAvailableToAdd(libraryId: string) {
  const response = await fetch(base + '/Libraries/' + libraryId + '/not-added');
  const data = await response.json();
  return BookViewModel.array().parse(data);
}

const BookInLibrarySearchResponse = paginatedResponse(BookInLibraryViewModel);

export async function getBooksInLibrary(request: PaginationRequest & { libraryId: string }) {
  const { libraryId } = request;
  const response = await paginatedFetch(`${base}/Libraries/${libraryId}/books/search`, request);
  const data = await response.json();
  return BookInLibrarySearchResponse.parse(data);
}
