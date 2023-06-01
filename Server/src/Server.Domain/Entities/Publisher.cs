using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Domain.Entities
{
    public class Publisher
    {
        public Guid Id { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; }
        public ICollection<Book> Books { get; set; }
    }
}
