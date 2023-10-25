using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class AddReviewCommandValidator : AbstractValidator<AddReviewCommand>
{
    public AddReviewCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
    }
}

public sealed record AddReviewCommand(Guid Id, string? Title, string? Description, 
    double Rating, Guid IdBook) : IRequest;

public sealed class AddReviewHandler : IRequestHandler<AddReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;
    private readonly IBookRepository _bookRepository;

    public AddReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository, IBookRepository bookRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
        _bookRepository = bookRepository;
    }

    public async Task Handle(AddReviewCommand request, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.FirstOrDefaultByIdAsync(request.IdBook, cancellationToken);
        
        if (book is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.PublisherNotFound);
        }
        
        var review = Review.Create(request.Id, request.Title, request.Description,
            request.Rating, book);

        await _reviewRepository.AddAsync(review, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}