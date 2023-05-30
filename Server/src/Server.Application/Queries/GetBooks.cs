using Server.Application.Abstractions;
using Server.Application.ViewModels;

namespace Server.Application.Queries;

public class GetBooks : IQuery<IEnumerable<BookViewModel>>
{
}