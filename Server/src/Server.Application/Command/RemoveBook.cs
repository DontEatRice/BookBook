using Server.Application.Abstractions;

namespace Server.Application.Command;

public record RemoveBook(Guid Id) : ICommand;