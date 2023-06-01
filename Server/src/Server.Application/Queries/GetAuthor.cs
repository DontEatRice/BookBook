using Server.Application.Abstractions;
using Server.Application.ViewModels;

namespace Server.Application.Queries;

public record GetAuthor(Guid Id) : IQuery<AuthorViewModel>;