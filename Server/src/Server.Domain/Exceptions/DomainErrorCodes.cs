namespace Server.Domain.Exceptions;

public static class DomainErrorCodes
{
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string SessionNotExists = "SESSION_NOT_EXISTS";
    public const string IdentityExists = "IDENTITY_EXISTS";
    public const string IdentityDoesNotExists = "IDENTITY_DOES_NOT_EXISTS";
    public const string InvalidRefreshToken = "INVALID_REFRESH_TOKEN";
    public const string BookAlreadyInCart = "BOOK_ALREADY_IN_CART";
    public const string BookNotInCart = "BOOK_NOT_IN_CART";
    public const string SamePasswords = "SAME_PASSWORDS";
    public const string TooManyBooksInCart = "TOO_MANY_BOOKS_IN_CART";
    public const string TooManyBooksInReservation = "TOO_MANY_BOOKS_IN_RESERVATION";
    public const string TooManyLibrariesInCart = "TOO_MANY_LIBRARIES_IN_CART";
}