namespace Server.Application.ViewModels;

public class LibraryWithBookViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public AddressViewModel Address { get; set; }
    public bool IsBookCurrentlyAvailable { get; set; }
}
