using AutoMapper;
using MediatR;
using Server.Application.ViewModels;
using Server.Domain.Repositories;

namespace Server.Infrastructure.Persistence.QueryHandlers;

public record GetBookCategoriesQuery : IRequest<IEnumerable<BookCategoryViewModel>>;

internal sealed class GetBookCategoriesHandler : IRequestHandler<GetBookCategoriesQuery, IEnumerable<BookCategoryViewModel>>
{
    private readonly IBookCategoryRepository _bookCategoryRepository;
    private readonly IMapper _mapper;

    public GetBookCategoriesHandler(IBookCategoryRepository bookCategoryRepository, IMapper mapper)
    {
        _bookCategoryRepository = bookCategoryRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookCategoryViewModel>> Handle(GetBookCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _bookCategoryRepository.FindAllAsync(cancellationToken);
        return _mapper.Map<List<BookCategoryViewModel>>(categories);
    }
}