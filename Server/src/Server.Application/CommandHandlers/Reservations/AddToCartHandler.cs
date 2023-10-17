using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.InfrastructureInterfaces;
using Server.Domain.Entities.Reservations;
using Server.Domain.Repositories;

namespace Server.Application.CommandHandlers.Reservations;

public sealed record AddToCartCommand(Guid UserId, Guid LibraryId, Guid BookId) : IRequest;

public class AddToCartHandler : IRequestHandler<AddToCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICartRepository _cartRepository;
    private readonly IBookInLibraryRepository _bookInLibraryRepository;

    public AddToCartHandler(
        IUnitOfWork unitOfWork,
        ICartRepository cartRepository, 
        IBookInLibraryRepository bookInLibraryRepository)
    {
        _unitOfWork = unitOfWork;
        _cartRepository = cartRepository;
        _bookInLibraryRepository = bookInLibraryRepository;
    }
    
    public async Task Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.FirstOrDefaultByUserIdAsync(request.UserId, cancellationToken);

        if (cart is null)
        {
            cart = Cart.Create(request.UserId);
            await _cartRepository.AddAsync(cart, cancellationToken);
        }

        if (cart.CartItems.Any(ci => ci.BookId == request.BookId))
        {
            throw new LogicException("Book already in cart", ApplicationErrorCodes.BookAlreadyInCart);
        }
        
        var bookInLibrary = await _bookInLibraryRepository.FirstOrDefaultByLibraryAndBookAsync(request.LibraryId, request.BookId, cancellationToken);

        if (bookInLibrary is null)
        {
            throw new NotFoundException("Book not found", ApplicationErrorCodes.BookNotFound);
        }

        if (bookInLibrary.Available <= 0)
        {
            throw new LogicException("Book not available", ApplicationErrorCodes.BookNotAvailable);
        }
        
        cart.AddBook(CartBook.Create(request.BookId, request.LibraryId));

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}