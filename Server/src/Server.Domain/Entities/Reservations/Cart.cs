using Server.Domain.Exceptions;

namespace Server.Domain.Entities.Reservations;

public class Cart
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public ICollection<CartBook> CartItems { get; private init; } = null!;

    public static Cart Create(Guid userId) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        CartItems = new List<CartBook>()
    };
    
    public void AddBook(CartBook cartBook)
    {
        if (CartItems.Any(x => x.BookId == cartBook.BookId))
        {
            throw new DomainException("Book already in cart", DomainErrorCodes.BookAlreadyInCart);
        }

        if (CartItems.Count >= 5)
        {
            throw new DomainException("Too many books in cart", DomainErrorCodes.TooManyBooksInCart);
        }

        if (CartItems.Count(c => c.LibraryId == cartBook.LibraryId) >= 3)
        {
            throw new DomainException("Too many books in one reservation", DomainErrorCodes.TooManyBooksInReservation);
        }

        if (CartItems.Select(c => c.LibraryId).Distinct().Count() >= 3 && !CartItems.Select(c => c.LibraryId).Contains(cartBook.LibraryId))
        {
            throw new DomainException("Too many libraries in cart", DomainErrorCodes.TooManyLibrariesInCart);
        }

        CartItems.Add(cartBook);
    }

    public void RemoveBook(Guid bookId)
    {
        var cartBook = CartItems.FirstOrDefault(x => x.BookId == bookId);
        if (cartBook is null)
        {
            throw new DomainException("Book not in cart", DomainErrorCodes.BookNotInCart);
        }

        CartItems.Remove(cartBook);
    }
    
}