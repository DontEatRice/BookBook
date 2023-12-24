import { AddBookToLibraryType } from '../models/AddBookToLibrary';
import { AddLibraryType } from '../models/AddLibrary';
import BookInLibraryViewModel from '../models/BookInLibraryViewModel';
import BookViewModel from '../models/BookViewModel';
import LibraryViewModel from '../models/LibraryViewModel';
import { UpdateLibraryType } from '../models/UpdateLibrary';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthTokenOrNull } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
export const LibrariesSearchResponse = paginatedResponse(LibraryViewModel);

export async function getLibraries(args: PaginationRequest) {
  const response = await paginatedFetch(base + '/Libraries/search', args);
  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  return LibrariesSearchResponse.parse(data);
}

export async function getLibrary(id: string) {
  const response = await fetch(base + '/Libraries/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: (await getAuthTokenOrNull()) ?? '',
    }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  return LibraryViewModel.parse(data);
}

export const postLibrary = async (library: AddLibraryType) => {
  const response = await fetch(base + '/Libraries', {
    method: 'post',
    body: JSON.stringify(library),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export const updateLibrary = async ({ id, library }: { id: string; library: UpdateLibraryType }) => {
  const response = await fetch(base + '/Libraries/' + id, {
    method: 'put',
    body: JSON.stringify(library),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export const deleteLibrary = async (libraryId: string) => {
  const response = await fetch(base + '/Libraries/' + libraryId, {
    method: 'delete',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
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
  if (!response.ok) {
    await handleBadResponse(response);
  }

  const data = await response.json();

  return BookViewModel.array().parse(data);
}

export const BookInLibrarySearchResponse = paginatedResponse(BookInLibraryViewModel);

export async function getBooksInLibrary(request: PaginationRequest & { libraryId: string }) {
  const { libraryId } = request;
  const response = await paginatedFetch(`${base}/Libraries/${libraryId}/books/search`, request);
  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  return BookInLibrarySearchResponse.parse(data);
}
