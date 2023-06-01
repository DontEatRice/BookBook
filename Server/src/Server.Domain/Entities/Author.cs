using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Domain.Entities
{
    public class Author
    {
        [Key]
        public Guid Id { get; set; }
        [Required, MaxLength(40)]
        public string FirstName { get; set; }
        [Required, MaxLength(50)]
        public string LastName { get; set; }

        ICollection<Book> Books { get; set; }

    }
}
