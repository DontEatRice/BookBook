using Server.Application.Abstractions;

namespace Server.Application.Command;

public record RemovePublisher(Guid Id) : ICommand;