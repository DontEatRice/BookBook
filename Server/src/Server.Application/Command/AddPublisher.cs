using Server.Application.Abstractions;

namespace Server.Application.Command;

public record AddPublisher(string Name) : ICommand;