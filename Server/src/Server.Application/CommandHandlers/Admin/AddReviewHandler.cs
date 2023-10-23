using FluentValidation;
using MediatR;
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

public sealed record AddReviewCommand(Guid Id, string? Title, string? Description, double Rating, Book Book) : IRequest;

public sealed class AddReviewHandler : IRequestHandler<AddReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;

    public AddReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
    }

    public async Task Handle(AddReviewCommand request, CancellationToken cancellationToken)
    {
        var review = Review.Create(request.Id, request.Title, request.Description,
            request.Rating, request.Book);

        await _reviewRepository.AddAsync(review, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}