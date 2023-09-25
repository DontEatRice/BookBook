import { AddLibraryType } from "../models/AddLibrary";
import LibraryViewModel from "../models/LibraryViewModel";

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