using Server.Application.Abstractions;

namespace Server.Application.Command;

public record AddAuthor(string FirstName, string LastName) : ICommand;