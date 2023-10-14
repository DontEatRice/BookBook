using AutoMapper;
using Server.Application.InternalModels;
using Server.Application.ViewModels;
using Server.Domain.Entities;

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
        CreateMap<LibraryBook, BookInLibraryViewModel>();
    }
}