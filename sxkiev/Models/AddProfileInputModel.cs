using System.ComponentModel.DataAnnotations;

namespace sxkiev.Models;

public class AddProfileInputModel
{
    [MaxLength(150)]
    public required string Name { get; set; }
    [MaxLength(1500)]
    public required string Description { get; set; }
    public int Age { get; set; }
    public int Height { get; set; }
    public int Breast { get; set; }
    public int Weight { get; set; }
    public double HourPrice { get; set; }
    public double TwoHourPrice { get; set; }
    public double NightPrice { get; set; }
    public bool Apartment { get; set; }
    public bool ToClient { get; set; }
    public ProfileType Type { get; set; }
    public int[]? Media { get; set; }
    public string[]? Districts { get; set; }
    public string[]? Favours { get; set; }
}