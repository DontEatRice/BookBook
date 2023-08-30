namespace Server.Domain.Entities;

public class Library
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int ReservationTime { get; set; }
    public int HireTime { get; set; }
    public Address Address { get; set; }
    public OpenHours OpenHours { get; set; }
    public ICollection<Book> Books { get; set; }

    public static Library Create(Guid id, string name, int reservationTime,
        int hireTime, Address address, OpenHours openHours) => new()
        {
            Id = id,
            Name = name,
            ReservationTime = reservationTime,
            HireTime = hireTime,
            Address = address,
            OpenHours = openHours,
            Books = new List<Book>()
        };
}
