using Server.Application.ViewModels;

namespace Server.Application.Queries;

public record GetBookCategory(Guid Id) : IQueryable<BookCategoryViewModel>