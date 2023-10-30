namespace Server.Application.Exceptions.Types;

public static class ApplicationErrorCodes
{
    public const string ValidationError = "VALIDATION";
    public const string AuthorNotFound = "AUTHOR_NOT_FOUND";
    public const string BookCategoryNotFound = "BOOK_CATEGORY_NOT_FOUND";
    public const string BookNotFound = "BOOK_NOT_FOUND";
    public const string PublisherNotFound = "PUBLISHER_NOT_FOUND";
    public const string LibraryNotFound = "LIBRARY_NOT_FOUND";
    public const string ImageNotFound = "IMAGE_NOT_FOUND";
    public const string BookAlreadyAdded = "BOOK_ALREADY_ADDED";
    public const string TokenNotValid = "TOKEN_NOT_VALID";
    public const string BookNotAvailable = "BOOK_NOT_AVAILABLE";
    public const string BookAlreadyInCart = "BOOK_ALREADY_IN_CART";
    public const string CartNotFound = "CART_NOT_FOUND";
    public const string BookNotInCart = "BOOK_NOT_IN_CART";
    public const string NoBooksToReserve = "NO_BOOKS_TO_RESERVE";
    public const string ReservationNotFound = "RESERVATION_NOT_FOUND";
    public const string ReservationCannotBeCancelled = "RESERVATION_CANNOT_BE_CANCELLED";
    public const string ReservationCannotBeReturned = "RESERVATION_CANNOT_BE_RETURNED";
    public const string CannotMakeAnotherReservation = "CANNOT_MAKE_ANOTHER_RESERVATION";
    public const string NotAuthenticated = "NOT_AUTHENTICATED";
    public const string UserNotFound = "USER_NOT_FOUND";
}