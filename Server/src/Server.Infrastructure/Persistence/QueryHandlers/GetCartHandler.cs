using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public sealed record GetCartQuery(Guid UserId) : IRequest<CartViewModel>;

internal sealed class GetCartHandler : IRequestHandler<GetCartQuery, CartViewModel>
{
    private readonly IMapper _mapper;
    private readonly BookBookDbContext _bookBookDbContext;

    public GetCartHandler(IMapper mapper, BookBookDbContext bookBookDbContext)
    {
        _mapper = mapper;
        _bookBookDbContext = bookBookDbContext;
    }

    public async Task<CartViewModel> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _bookBookDbContext.Carts.FirstOrDefaultAsync(c => c.UserId == request.UserId,
            cancellationToken);

        if (cart is null)
        {
            throw new NotFoundException("Cart not found", ApplicationErrorCodes.CartNotFound);
        }

        var libraryIds = cart.CartItems.Select(ci => ci.LibraryId).Distinct().ToList();
        var bookIds = cart.CartItems.Select(ci => ci.BookId).Distinct().ToList();
        var libraries = await _bookBookDbContext.Libraries
            .Include(x => x.OpenHours)
            .Include(x => x.Address)
            .Where(l => libraryIds.Contains(l.Id))
            .ToListAsync(cancellationToken);
        var books = await _bookBookDbContext.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync(cancellationToken);

        var cartViewModel = new CartViewModel();
        libraries.ForEach(l =>
            {
                var libraryBookIds = cart.CartItems.Where(ci => ci.LibraryId == l.Id).Select(ci => ci.BookId).ToList();
                var libraryBooks = books.Where(b => libraryBookIds.Contains(b.Id)).ToList();

                cartViewModel.LibrariesInCart.Add(new LibraryInCartViewModel
                {
                    Library = _mapper.Map<LibraryViewModel>(l),
                    Books = _mapper.Map<List<BookViewModel>>(libraryBooks)
                });
            }
        );
        
        return cartViewModel;
    }
}