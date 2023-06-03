using Server.Application.Abstractions;

namespace Server.Application.Command;
public record AddBookCategory(Guid Id, string Name) : ICommand;