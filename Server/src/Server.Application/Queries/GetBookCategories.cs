using Server.Application.ViewModels;

namespace Server.Application.Queries;

public record GetBookCategories : IQueryable<IEnumerable<BookCategoryViewModel>>;