using Server.Application.Abstractions;

namespace Server.Application.Command;

public record AddPublisher(Guid Id, string Name) : ICommand;