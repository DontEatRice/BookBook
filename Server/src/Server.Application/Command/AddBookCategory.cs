using Server.Application.Abstractions;

namespace Server.Application.Command;
public record AddBookCategory(string Name) : ICommand;