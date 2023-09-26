namespace Server.Domain.Entities;

public class Address
{
    public Guid Id { get; set; }
    public string PostalCode { get; set; }
    public string City { get; set; }
    public string Street { get; set; }
    public string Number { get; set; }
    public string? Apartment { get; set; }
    public string? AdditionalInfo { get; set; }

    public static Address Create(Guid id, string postalCode, string city, string street, string number,
        string? apartment, string? additionalInfo) => new()
        {
            Id = id,
            PostalCode = postalCode,
            City = city,
            Street = street,
            Number = number,
            Apartment = apartment,
            AdditionalInfo = additionalInfo
        };
}
