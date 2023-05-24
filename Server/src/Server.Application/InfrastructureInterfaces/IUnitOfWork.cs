namespace Server.Application.InfrastructureInterfaces;

public interface IUnitOfWork
{
    Task SaveChangesAsync();
}