using Server.Application.Abstractions;
using Server.Application.ViewModels;

namespace Server.Application.Queries;

public record GetAuthors : IQuery<IEnumerable<AuthorViewModel>>;