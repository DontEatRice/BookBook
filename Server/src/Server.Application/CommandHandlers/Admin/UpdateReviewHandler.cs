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
    }
}

public sealed record UpdateReviewCommand(Guid UserId, Guid IdReview, string? Title, string? Description, 
    double Rating) : IRequest;

public sealed class UpdateReviewHandler : IRequestHandler<UpdateReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IReviewRepository _reviewRepository;
    private readonly IIdentityRepository _identityRepository;

    public UpdateReviewHandler(IUnitOfWork unitOfWork, IReviewRepository reviewRepository, 
        IIdentityRepository identityRepository)
    {
        _unitOfWork = unitOfWork;
        _reviewRepository = reviewRepository;
        _identityRepository = identityRepository;
    }

    public async Task Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.FirstOrDefaultByIdAsync(request.IdReview, cancellationToken);
        
        if (review is null)
        {
            throw new NotFoundException("Review not found", ApplicationErrorCodes.ReviewNotFound);
        }
        
        var user = await _identityRepository.FirstOrDefaultByIdAsync(request.UserId, cancellationToken) ??
                   throw new NotFoundException("User not found", ApplicationErrorCodes.UserNotFound);

        if (request.UserId != review.User.Id)
        {
            throw new LogicException("User is not allowed to edit this review",
                ApplicationErrorCodes.UserNotAllowed);
        }
        
        review.Title = request.Title;
        review.Description = request.Description;
        review.Rating = request.Rating;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}