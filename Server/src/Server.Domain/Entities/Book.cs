using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Domain.Entities
{
    public class Book
    {
        [Key]
        public Guid Id { get; set; }
        [Required, MaxLength(17)]
        public string ISBN { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public int YearPublished { get; set; }
        public string? CoverLink { get; set; }
        public double AvarageRating { get; set; }
        public double AvarageCriticRating { get; set; }
        public Publisher Publisher { get; set; }
        public ICollection<Author> Authors { get; set; }

    }
}
