namespace Server.Application.ViewModels;

public class AddressViewModel
{
    public string PostalCode { get; set; }
    public string City { get; set; }
    public string Street { get; set; }
    public string Number { get; set; }
    public string? Apartment { get; set; }
    public string? AdditionalInfo { get; set; }
}
