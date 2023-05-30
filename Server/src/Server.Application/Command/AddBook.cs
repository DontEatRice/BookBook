using Server.Application.Abstractions;

namespace Server.Application.Command;

public sealed record AddBook(string Name) : ICommand;