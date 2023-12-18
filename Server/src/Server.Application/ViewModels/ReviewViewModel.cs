namespace Server.Application.ViewModels;

public class ReviewViewModel
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double Rating { get; set; }
    public ReviewUserViewModel User { get; set; }
}