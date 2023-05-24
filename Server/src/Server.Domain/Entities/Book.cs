namespace Server.Domain.Entities;

public class Book
{
    public Guid Id { get; }
    public string Name { get; set; }
    
    private Book(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public static Book Create(string name)
        => new(Guid.NewGuid(), name);
}