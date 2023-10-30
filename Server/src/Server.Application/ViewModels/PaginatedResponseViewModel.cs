namespace Server.Application.ViewModels;

public class PaginatedResponseViewModel<T>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int Count { get; set; }
    public List<T> Data { get; set; } = null!;
}