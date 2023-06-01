using System.ComponentModel.DataAnnotations;
// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618

namespace Server.Domain.Entities
{
    public class BookCategory
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<Book> Books { get; set; }
    }
}
