using System.ComponentModel.DataAnnotations;

namespace Server.Domain.Entities
{
    public class BookCategory
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<Book> Books { get; set; }

        public static BookCategory Create(string name) => new()
        {
            Id = Guid.NewGuid(),
            Name = name
        };
    }
}
