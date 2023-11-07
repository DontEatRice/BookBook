namespace Server.Domain.Entities;

public class Library
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int ReservationTime { get; set; }
    public int HireTime { get; set; }
    public Address Address { get; set; }
    public OpenHours OpenHours { get; set; }
    public ICollection<LibraryBook> LibraryBooks { get; set; }

    public static Library Create(Guid id, string name, int reservationTime,
        int hireTime, Address address, OpenHours openHours) => new()
        {
            Id = id,
            Name = name,
            ReservationTime = reservationTime,
            HireTime = hireTime,
            Address = address,
            OpenHours = openHours,
            LibraryBooks = new List<LibraryBook>()
        };

    public static Library Update(Library library, string name, int reservationTime,
        int hireTime, Address address, OpenHours openHours)
    {
        library.Name = name;
        library.ReservationTime = reservationTime;
        library.HireTime = hireTime;
        library.Address = address;
        library.OpenHours = openHours;

        return library;
    }
}
