import { LibraryWithBookViewModelType } from './LibraryWithBookViewModel';

type LibraryInBookDetails = {
  library: LibraryWithBookViewModelType;
  distanceFromUser?: number;
  userLibrary: boolean;
  isBookCurrentlyAvailable: boolean;
};

export default LibraryInBookDetails;
