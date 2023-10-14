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
}