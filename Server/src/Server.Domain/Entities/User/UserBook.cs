using Server.Domain.Entities.Auth;

namespace Server.Domain.Entities.User;

public class UserBook 
{
    public Identity User { get; set; }
    public Book Book { get; set; }
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }

    public static UserBook Create(Guid userId, Guid bookId) => new()
    {
        UserId = userId,
        BookId = bookId
    };
}
