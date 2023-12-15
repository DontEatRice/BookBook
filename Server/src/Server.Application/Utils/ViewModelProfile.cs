using AutoMapper;
using Server.Application.InternalModels;
using Server.Application.ViewModels;
using Server.Domain.Entities;
using Server.Domain.Entities.Auth;

namespace Server.Application.Utils;

public class ViewModelProfile : Profile
{
    public ViewModelProfile()
    {
        CreateMap<Author, AuthorViewModel>();
        CreateMap<Publisher, PublisherViewModel>();
        CreateMap<BookCategory, BookCategoryViewModel>();
        CreateMap<Book, BookViewModel>();
        CreateMap<Library, LibraryViewModel>();
        CreateMap<Address, AddressViewModel>();
        CreateMap<OpenHours, OpenHoursViewModel>();
        CreateMap<Image, ImageWithContent>();
        CreateMap<Review, ReviewViewModel>();
        CreateMap<LibraryBook, BookInLibraryViewModel>();
        CreateMap<Identity, UserDetailViewModel>();
        CreateMap<Identity, ReviewUserViewModel>();
        CreateMap<Book, BookInRankingViewModel>()
            .ForMember(x => x.ReviewsCount,
                opt => 
                    opt.MapFrom(x => x.Reviews.Count));
    }
}