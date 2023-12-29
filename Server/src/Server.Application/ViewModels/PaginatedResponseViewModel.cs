using Server.Utils;

namespace Server.Application.ViewModels;

public class PaginatedResponseViewModel<T>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int Count { get; set; }
    public List<T> Data { get; set; } = null!;
}

public static class PaginatedResponseViewModel
{
    public static PaginatedResponseViewModel<T> Create<T>(List<T> data, int count, PaginationOptions options)
        => new()
        {
            Data = data,
            Count = count,
            PageNumber = options.PageNumber,
            PageSize = options.PageSize
        };
}