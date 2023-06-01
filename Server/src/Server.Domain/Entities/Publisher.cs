using System.ComponentModel.DataAnnotations;
// ReSharper disable CollectionNeverUpdated.Global

#pragma warning disable CS8618

namespace Server.Domain.Entities;

public class Publisher
{
    public Guid Id { get; set; }
    [Required, MaxLength(50)]
    public string Name { get; set; }
    public ICollection<Book> Books { get; set; }
}