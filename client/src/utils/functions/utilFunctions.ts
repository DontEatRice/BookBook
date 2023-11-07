export function translateStatus(status: string) {
  switch (status) {
    case 'Pending':
      return 'W trakcie';
    case 'GivenOut':
      return 'Wydana';
    case 'Returned':
      return 'Zwrócona';
    case 'Cancelled':
      return 'Anulowana';
    case 'CancelledByAdmin':
      return 'Anulowana przez pracownika';
  }
  return 'Nieznany';
}

// const statusCodeMapping: Record<number, string | undefined> = {

// }

const errorCodesMapping: Record<string, string | undefined> = {
  INVALID_CREDENTIALS: 'Niepoprawne dane logowania',
  IDENTITY_EXISTS: 'Użytkownik o danym adresie e-mail już istnieje',
  IDENTITY_DOES_NOT_EXISTS: 'Użytkownik nie istnieje',
  BOOK_ALREADY_IN_CART: 'Książka znajduje się już w koszyku',
  BOOK_NOT_IN_CART: 'Książka znajduje się w koszyku',
  SAME_PASSWORDS: 'Podane hasła są takie same',
  UNEXPECTED: 'Nieoczekiwany błąd',
  NOT_AUTHENTICATED: 'Nie posiadasz uprawnień do tego zasobu',
  USER_NOT_FOUND: 'Nie znaleziono takiego użytkownika',
  REVIEW_NOT_FOUND: 'Nie znaleziono takiej opinii',
  USER_REVIEW_ALREADY_EXISTS: 'Nie znaleziono takiej opinii użytkownika',
  CANNOT_MAKE_ANOTHER_RESERVATION: 'Nie można zrobić kolejnej rezerwacji',
  RESERVATION_CANNOT_BE_RETURNED: 'Rezerwacja nie może zostać zwrócona',
  RESERVATION_CANNOT_BE_CANCELLED: 'Rezerwacja nie może zostać anulowana',
  RESERVATION_NOT_FOUND: 'Nie znaleziono takiej rezerwacji',
  // NO_BOOKS_TO_RESERVE,
  // BOOK_NOT_IN_CART,
  // CART_NOT_FOUND,
  // BOOK_ALREADY_IN_CART,
  // BOOK_NOT_AVAILABLE,
  // BOOK_ALREADY_ADDED,
  // IMAGE_NOT_FOUND,
  // LIBRARY_NOT_FOUND,
  // PUBLISHER_NOT_FOUND
  // BOOK_NOT_FOUND,
  // BOOK_CATEGORY_NOT_FOUND,
  // AUTHOR_NOT_FOUND
};

export function translateErrorCode(code: string) {
  return errorCodesMapping[code] ?? 'Wystąpił niespodziewany błąd';
}
