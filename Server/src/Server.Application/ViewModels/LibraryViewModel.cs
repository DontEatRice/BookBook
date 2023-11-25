namespace Server.Application.ViewModels;

public class LibraryViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int ReservationTime { get; set; }
    public int HireTime { get; set; }
    public string EmailAddress { get; set; }
    public string PhoneNumber { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public OpenHoursViewModel OpenHours { get; set; }
    public AddressViewModel Address { get; set; }
}
