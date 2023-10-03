import { AddLibraryType } from "../models/AddLibrary";
import BookViewModel from "../models/BookViewModel";
import LibraryViewModel from "../models/LibraryViewModel";
import NewBookInLibrary from "../models/NewBookInLibrary";


const base = import.meta.env.VITE_API_BASE_URL;

export async function getLibraries() {
    const response = await fetch(base + '/Libraries');
    const data = await response.json();
    return LibraryViewModel.array().parse(data);
}

export const postLibrary = async (library: AddLibraryType) => {
    const response = await fetch(base + '/Libraries', {
        method: 'post',
        body: JSON.stringify(library),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response;
}

export const addBookToLibrary = async (libraryId: string, addBookToLibrary: NewBookInLibrary) => {
    const response = await fetch(base + '/Libraries/' + libraryId + '/books', {
        method: 'post',
        body: JSON.stringify(addBookToLibrary),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response;
}

export async function getBooksAvailableToAdd(libraryId: string) {
    const response = await fetch(base + '/Libraries/' + libraryId + '/booksToAdd');
    const data = await response.json();
    return BookViewModel.array().parse(data);
}