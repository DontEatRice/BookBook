using Server.Application.Abstractions;

namespace Server.Application.Command;
public record RemoveBookCategory(Guid Id) : ICommand;