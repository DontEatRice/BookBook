using FluentValidation;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Admin;

public sealed class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
{
    public UpdateReviewCommandValidator()
    {
        RuleFor(x => x.Rating).NotEmpty();
    }
}

public sealed record UpdateReviewCommand(Guid IdReview, string? Title, string? Description, 
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

        review.Title = request.Title;
        review.Description = request.Description;
        review.Rating = request.Rating;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}