using Server.Application.Abstractions;

namespace Server.Application.Command;

public record RemoveAuthor(Guid Id) : ICommand;