using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record RemoveReviewCommand(Guid Id, Guid UserId) : IRequest;

public sealed class RemoveReviewHandler : IRequestHandler<RemoveReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;
    private readonly IBookRepository _bookRepository;

    public RemoveReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository,
        IBookRepository bookRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
        _bookRepository = bookRepository;
    }

    public async Task Handle(RemoveReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken) ?? 
            throw new NotFoundException("Review not found", ApplicationErrorCodes.ReviewNotFound);

        if (review.UserId != request.UserId)
        {
            throw new NotFoundException("Review not found", ApplicationErrorCodes.ReviewNotFound);
        }

        var book = await _bookRepository.FirstOrDefaultByIdAsync(review.Book.Id, cancellationToken) ?? 
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);

        if (review.IsCriticRating)
        {
            var criticReviewsCount = await _reviewRepository.GetCriticReviewsCountByBookId(book.Id, cancellationToken);
            book.SubtractReviewFromCriticRating(criticReviewsCount, review.Rating);
        }
        else {
            var reviewsCount = await _reviewRepository.GetReviewsCountByBookId(book.Id, cancellationToken);
            book.SubtractReviewFromRating(reviewsCount, review.Rating);
        }

        await _reviewRepository.Delete(request.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}