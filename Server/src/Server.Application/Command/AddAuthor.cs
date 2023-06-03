using Server.Application.Abstractions;

namespace Server.Application.Command;

public record AddAuthor(Guid Id, string FirstName, string LastName) : ICommand;