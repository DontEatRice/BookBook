namespace Server.Utils;

public abstract record PaginationOptions(int PageSize = 10, int PageNumber = 0, string? OrderByField = null);
