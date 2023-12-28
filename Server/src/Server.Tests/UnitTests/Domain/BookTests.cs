using Server.Domain.Entities;
using Server.Domain.Entities.Auth;
using Xunit;

namespace Server.Tests.UnitTests.Domain;

public class BookTests
{
    [Fact]
    public void Create_ShouldCreateBook()
    {
        // Arrange
        var id = Guid.NewGuid();
        var isbn = "1234567890";
        var title = "Test Book";
        var yearPublished = 2022;
        var description = "Test Description";
        var language = "English";
        var pageCount = 100;
        var coverPictureUrl = "https://example.com/cover.jpg";
        var publisher = new Publisher { Name = "Test Publisher" };
        var authors = new List<Author> { new Author { LastName = "Test" } };
        var categories = new List<BookCategory> { new BookCategory { Name = "Test Category" } };

        // Act
        var book = Book.Create(id, isbn, title, yearPublished, description, language, pageCount, coverPictureUrl, publisher, authors, categories);

        // Assert
        Assert.Equal(id, book.Id);
        Assert.Equal(isbn, book.ISBN);
        Assert.Equal(title, book.Title);
        Assert.Equal(yearPublished, book.YearPublished);
        Assert.Equal(description, book.Description);
        Assert.Equal(language, book.Language);
        Assert.Equal(pageCount, book.PageCount);
        Assert.Equal(coverPictureUrl, book.CoverPictureUrl);
        Assert.Equal(publisher, book.Publisher);
        Assert.Equal(authors, book.Authors);
        Assert.Equal(categories, book.BookCategories);
    }

    [Fact]
    public void ComputeRating_ShouldComputeAverageRating()
    {
        // Arrange
        var book = new Book { AverageRating = 4.5 };
        var reviewsCount = 4;
        var reviewRating = 5.0;

        // Act
        book.ComputeRating(reviewsCount, reviewRating);

        // Assert
        Assert.Equal(4.6, book.AverageRating);
    }
    
    [Fact]
    public void SubtractReviewFromRating_ShouldSubtractReviewRating()
    {
        // Arrange
        var book = new Book { AverageRating = 4 };
        var reviewsCount = 3;
        var reviewRating = 5.0;

        // Act
        book.SubtractReviewFromRating(reviewsCount, reviewRating);

        // Assert
        Assert.Equal(3.5, book.AverageRating);
    }

    [Fact]
    public void UpdateReviewRating_ShouldUpdateAverageRating()
    {
        // Arrange
        var book = new Book { AverageRating = 4.5 };
        var reviewsCount = 4;
        var oldReviewRating = 5.0;
        var newReviewRating = 4.0;

        // Act
        book.UpdateReviewRating(reviewsCount, oldReviewRating, newReviewRating);

        // Assert
        Assert.Equal(4.25, book.AverageRating);
    }
    
    [Fact]
    public void SubtractReviewFromRating_WithOneOrNoReviews_ShouldSetAverageRatingToNull()
    {
        // Arrange
        var book = new Book { AverageRating = 5 };
        var reviewsCount = 1;
        var reviewRating = 5;

        // Act
        book.SubtractReviewFromRating(reviewsCount, reviewRating);

        // Assert
        Assert.Null(book.AverageRating);
    }

    [Fact]
    public void UpdateReviewRating_AfterUserWasNominatedCritic_ShouldSubstractOldReviewFromAverageRatingAndUpdateAverageCriticRating_OneReview()
    {
        // Arrange
        var book = new Book { AverageRating = 5, AverageCriticRating = null };
        var reviewsCount = 1;
        var criticReviewsCount = 0;
        var oldReviewRating = 5;
        var reviewRating = 4;

        // Act
        book.SubtractReviewFromRating(reviewsCount, oldReviewRating);
        book.ComputeCriticRating(criticReviewsCount, reviewRating);

        // Assert
        Assert.Null(book.AverageRating);
        Assert.Equal(4, book.AverageCriticRating);
    }

    [Fact]
    public void UpdateReviewRating_AfterUserWasNominatedCritic_ShouldSubstractOldReviewFromAverageRatingAndUpdateAverageCriticRating_MoreReviews()
    {
        // Arrange
        var book = new Book { AverageRating = 4.5, AverageCriticRating = 3 };
        var reviewsCount = 2;
        var criticReviewsCount = 1;
        var oldReviewRating = 5;
        var reviewRating = 4;

        // Act
        book.SubtractReviewFromRating(reviewsCount, oldReviewRating);
        book.ComputeCriticRating(criticReviewsCount, reviewRating);

        // Assert
        Assert.Equal(4, book.AverageRating);
        Assert.Equal(3.5, book.AverageCriticRating);
    }
}