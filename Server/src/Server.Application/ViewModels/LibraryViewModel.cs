namespace Server.Application.ViewModels;

public class LibraryViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int ReservationTime { get; set; }
    public int HireTime { get; set; }
    public OpenHoursViewModel OpenHours { get; set; }
    public AddressViewModel Address { get; set; }
}
