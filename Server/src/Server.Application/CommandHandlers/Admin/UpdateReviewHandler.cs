using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed record UpdateReviewCommand(Guid UserId, Guid IdReview, string? Title, string? Description, 
    double Rating) : IRequest;

public sealed class UpdateReviewHandler : IRequestHandler<UpdateReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;

    public UpdateReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
    }

    public async Task Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.FirstOrDefaultByIdAsync(request.IdReview, cancellationToken);
        
        if (review is null)
        {
            throw new NotFoundException("Review not found", ApplicationErrorCodes.ReviewNotFound);
        }

        if (request.UserId != review.User.Id)
        {
            throw new LogicException("User is not allowed to edit this review",
                ApplicationErrorCodes.UserNotAllowed);
        }

        var book = review.Book;
        
        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        var reviews = await _reviewRepository.FindAllByBookIdAsync(book.Id, cancellationToken);
        
        book.UpdateReviewRating(reviews, review.Rating, request.Rating);
        
        review.Title = request.Title;
        review.Description = request.Description;
        review.Rating = request.Rating;
        review.Updated = DateTime.Now;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}