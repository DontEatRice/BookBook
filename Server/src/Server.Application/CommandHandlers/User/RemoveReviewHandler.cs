using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed record RemoveReviewCommand(Guid Id) : IRequest;

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

        var book = await _bookRepository.FirstOrDefaultByIdAsync(review.Book.Id, cancellationToken) ?? 
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);

        var reviews = await _reviewRepository.FindAllByBookIdAsync(book.Id, cancellationToken);

        if (review.IsCriticRating)
        {
            book.SubtractReviewFromCriticRating(reviews.Where(x => x.IsCriticRating).ToList(), review.Rating);
        }
        else {
            book.SubtractReviewFromRating(reviews.Where(x => !x.IsCriticRating).ToList(), review.Rating);
        }

        await _reviewRepository.Delete(request.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}