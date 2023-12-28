using Xunit;
using Server.Domain.Entities.Reservations;
using Server.Domain.Exceptions;

namespace Server.Tests.UnitTests.Domain;

public class CartTests
{
    [Fact]
    public void AddBook_ShouldAddBookToCart()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        var cartBook = new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() };

        // Act
        cart.AddBook(cartBook);

        // Assert
        Assert.Contains(cartBook, cart.CartItems);
    }

    [Fact]
    public void AddBook_WhenBookAlreadyInCart_ShouldThrowException()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        var cartBook = new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() };
        cart.AddBook(cartBook);

        // Act
        var exception = Assert.Throws<DomainException>(() => cart.AddBook(cartBook));
            
        // Assert
        Assert.Equal(DomainErrorCodes.BookAlreadyInCart, exception.ErrorCode);
    }

    [Fact]
    public void AddBook_WhenCartHasMoreThanThreeBooks_ShouldThrowException()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        var libraryId1 = Guid.NewGuid();
        var libraryId2 = Guid.NewGuid();
            
        for (var i = 0; i < 3; i++)
        {
            cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = libraryId1 });
        }
            
        for (var i = 0; i < 2; i++)
        {
            cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = libraryId2 });
        }
        var cartBook = new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() };

        // Act
        var exception = Assert.Throws<DomainException>(() => cart.AddBook(cartBook));
            
        // Assert
        Assert.Equal(DomainErrorCodes.TooManyBooksInCart, exception.ErrorCode);
    }

    [Fact]
    public void AddBook_WhenCartHasMoreThanThreeFromSameLibrary_ShouldThrowException()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        var libraryId = Guid.NewGuid();
        for (var i = 0; i < 3; i++)
        {
            cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = libraryId });
        }
        var cartBook = new CartBook { BookId = Guid.NewGuid(), LibraryId = libraryId };

        // Act
        var exception = Assert.Throws<DomainException>(() => cart.AddBook(cartBook));
            
        // Assert
        Assert.Equal(DomainErrorCodes.TooManyBooksInReservation, exception.ErrorCode);
    }

    [Fact]
    public void AddBook_WhenCartHasBooksFromMoreThanOneLibrary_ShouldThrowException()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() });
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() });
        cart.AddBook(new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() });
        var cartBook = new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() };

        // Act
        var exception = Assert.Throws<DomainException>(() => cart.AddBook(cartBook));
            
        // Assert
        Assert.Equal(DomainErrorCodes.TooManyLibrariesInCart, exception.ErrorCode);
    }

    [Fact]
    public void RemoveBook_ShouldRemoveBookFromCart()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        var cartBook = new CartBook { BookId = Guid.NewGuid(), LibraryId = Guid.NewGuid() };
        cart.AddBook(cartBook);

        // Act
        cart.RemoveBook(cartBook.BookId);

        // Assert
        Assert.DoesNotContain(cartBook, cart.CartItems);
    }

    [Fact]
    public void RemoveBook_WhenBookNotInCart_ShouldThrowException()
    {
        // Arrange
        var cart = Cart.Create(Guid.NewGuid());
        var bookId = Guid.NewGuid();

        // Act
        var exception = Assert.Throws<DomainException>(() => cart.RemoveBook(bookId));
            
        // Assert
        Assert.Equal(DomainErrorCodes.BookNotInCart, exception.ErrorCode);
    }
}