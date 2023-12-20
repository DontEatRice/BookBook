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
        CreateMap<LibraryBook, LibraryWithBookViewModel>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Library.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Library.Name))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Library.Longitude))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Library.Latitude))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Library.Address))
            .ForMember(dest => dest.IsBookCurrentlyAvailable, opt => opt.MapFrom(src => src.Available > 0));
    }
}