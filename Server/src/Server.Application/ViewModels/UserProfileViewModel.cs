using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Application.ViewModels;

public class UserProfileViewModel
{
    public string UserName { get; set; }
    public string UserImageUrl { get; set; }
    public List<BookViewModel> UserLastReadBooks { get; set; }
    public string? UserLocation { get; set; }
    public string? AboutMe { get; set; }
}
