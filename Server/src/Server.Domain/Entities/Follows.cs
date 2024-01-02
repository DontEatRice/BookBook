using Server.Domain.Entities.Auth;

namespace Server.Domain.Entities;

public class Follows
{
    /// <summary>
    /// Id tego który śledzi
    /// </summary>
    public Guid FollowerId { get; set; }

    public Identity Follower { get; set; } = null!;
    // public Identity Follower { get; set; } = null!;
    /// <summary>
    /// Id tego kto jest śledzony
    /// </summary>
    public Guid FollowedId { get; set; }

    public Identity Followed { get; set; } = null!;
    // public Identity Followed { get; set; } = null!;

    public static Follows Create(Guid follower, Guid followed) =>
        new()
        {
            FollowerId = follower,
            FollowedId = followed,
        };
}