namespace sxkiev.Models;

public class ProfileResponseModel
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int Age { get; set; }
    public int Height { get; set; }
    public int Breast { get; set; }
    public int Weight { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int Priority { get; set; }
    public double HourPrice { get; set; }
    public double TwoHourPrice { get; set; }
    public double NightPrice { get; set; }
    public bool Apartment { get; set; }
    public bool ToClient { get; set; }
    public IEnumerable<string> Photos { get; set; }
    public IEnumerable<string> Videos { get; set; }
    public IEnumerable<string> Favours { get; set; }
    public IEnumerable<string> Districts { get; set; }
}