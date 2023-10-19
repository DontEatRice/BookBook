using AutoMapper;
using MediatR;
using Server.Application.Exceptions;
using Server.Application.Exceptions.Types;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookCategoryQuery(Guid Id) : IRequest<BookCategoryViewModel>;

internal sealed class GetBookCategoryHandler : IRequestHandler<GetBookCategoryQuery, BookCategoryViewModel>
{
    private readonly IBookCategoryRepository _bookCategoryRepository;
    private readonly IMapper _mapper;

    public GetBookCategoryHandler(IBookCategoryRepository bookCategoryRepository, IMapper mapper)
    {
        _bookCategoryRepository = bookCategoryRepository;
        _mapper = mapper;
    }

    public async Task<BookCategoryViewModel> Handle(GetBookCategoryQuery request, CancellationToken cancellationToken)
    {
        var bookCategory = await _bookCategoryRepository.FirstOrDefaultByIdAsync(request.Id, cancellationToken);

        if (bookCategory is null)
        {
            throw new NotFoundException("Book category not found", ApplicationErrorCodes.BookCategoryNotFound);
        }

        return _mapper.Map<BookCategoryViewModel>(bookCategory);
    }
}