namespace Server.Application.ViewModels;

public sealed class ReviewViewModel
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double Rating { get; set; }
    public ReviewUserViewModel User { get; set; } = null!;
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }
}