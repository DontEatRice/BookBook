namespace Server.Application.Abstractions;

public interface ICommandHandler<in TCommand, TResult> where TCommand : class, ICommand
{
    Task<TResult> HandleAsync(TCommand command);
}