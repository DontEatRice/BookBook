import { LibraryViewModelType } from "./LibraryViewModel";

type LibraryInBookDetails = {
    library: LibraryViewModelType;
    distanceFromUser?: number;
    userLibrary: boolean;
}

export default LibraryInBookDetails;