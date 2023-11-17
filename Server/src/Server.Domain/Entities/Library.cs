namespace Server.Domain.Entities;

public class Library
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int ReservationTime { get; set; }
    public int HireTime { get; set; }
    public string EmailAddress { get; set; }
    public string PhoneNumber { get; set; }
    public Address Address { get; set; }
    public OpenHours OpenHours { get; set; }
    public ICollection<LibraryBook> LibraryBooks { get; set; }

    public static Library Create(Guid id, string name, int reservationTime,
        int hireTime, string emailAddress, string phoneNumber, Address address, OpenHours openHours) => new()
        {
            Id = id,
            Name = name,
            ReservationTime = reservationTime,
            HireTime = hireTime,
            EmailAddress = emailAddress,
            PhoneNumber = phoneNumber,
            Address = address,
            OpenHours = openHours,
            LibraryBooks = new List<LibraryBook>()
        };
}
