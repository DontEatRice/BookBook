using AutoMapper;
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
    }
}