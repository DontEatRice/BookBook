using Server.Application.Abstractions;
using Server.Application.ViewModels;

namespace Server.Application.Queries;

public record GetPublisher(Guid Id) : IQuery<PublisherViewModel>;