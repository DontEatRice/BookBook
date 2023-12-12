using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record RemoveFromCartCommand(Guid UserId, Guid BookId) : IRequest;

public class RemoveFromCartHandler : IRequestHandler<RemoveFromCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICartRepository _cartRepository;

    public RemoveFromCartHandler(IUnitOfWork unitOfWork, ICartRepository cartRepository)
    {
        _unitOfWork = unitOfWork;
        _cartRepository = cartRepository;
    }
    
    public async Task Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.FirstOrDefaultByUserIdAsync(request.UserId, cancellationToken);

        if (cart is null)
        {
            throw new NotFoundException("Cart not found", ApplicationErrorCodes.CartNotFound);
        }

        if (cart.CartItems.All(ci => ci.BookId != request.BookId))
        {
            throw new LogicException("Book not in cart", ApplicationErrorCodes.BookNotInCart);
        }
        
        var bookInCart = cart.CartItems.First(ci => ci.BookId == request.BookId);
        
        cart.RemoveBook(bookInCart.BookId);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}