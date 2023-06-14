using Server.Application.Abstractions;

namespace Server.Application.Command;

public sealed record AddBook(Guid Id, string ISBN, string Title, int YearPublished, string? CoverLink,
        Guid IdPublisher, List<Guid> AuthorsIDs, List<Guid> CategoriesIDs) : ICommand;