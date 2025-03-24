using System.ComponentModel.DataAnnotations;

namespace sxkiev.Models;

public class UpdateProfileInputModel
{
    [MaxLength(150)]
    public string? Name { get; set; }
    [MaxLength(1500)]
    public string? Description { get; set; }
    [MaxLength(20)]
    public string? Phone { get; set; }
    public int? Age { get; set; }
    public int? Height { get; set; }
    public int? Breast { get; set; }
    public int? Weight { get; set; }
    public double? HourPrice { get; set; }
    public double? TwoHourPrice { get; set; }
    public double? NightPrice { get; set; }
    public bool? Apartment { get; set; }
    public bool? ToClient { get; set; }
    public int? PlanId { get; set; }
    public ProfileStatus? Status { get; set; }
    public int[]? Media { get; set; }
    public string[]? Districts { get; set; }
    public string[]? Favours { get; set; }
}