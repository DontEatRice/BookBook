using FluentValidation;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.User;

public sealed class AddReviewCommandValidator : AbstractValidator<AddReviewCommand>
{
    public AddReviewCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
    }
}

public sealed record AddReviewCommand(Guid UserId, Guid Id, string? Title, string? Description, 
    double Rating, Guid IdBook) : IRequest;

public sealed class AddReviewHandler : IRequestHandler<AddReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IIdentityRepository _identityRepository;

    public AddReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository, IBookRepository bookRepository,
        IIdentityRepository identityRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
        _bookRepository = bookRepository;
        _identityRepository = identityRepository;
    }

    public async Task Handle(AddReviewCommand request, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.IdBook, cancellationToken);
        
        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        var reviews = await _reviewRepository.FindAllByBookIdAsync(request.IdBook, cancellationToken);

        if (reviews.FirstOrDefault(x => x.User.Id == request.UserId) is not null)
        {
            throw new LogicException ("Review already exists", ApplicationErrorCodes.UserReviewAlreadyExists);
        }
        
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.UserId, cancellationToken) ??
                   throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);
        
        book.ComputeRating(reviews, request.Rating);
        
        var review = Review.Create(request.Id, request.Title, request.Description, request.Rating, book, user, false);

        await _reviewRepository.AddAsync(review, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}