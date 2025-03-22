using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class SxKievProfile
{
    public Guid Id { get; set; }
    [MaxLength(150)]
    public required string Name { get; set; }
    [MaxLength(1500)]
    public required string Description { get; set; }
    public int Age { get; set; }
    public int Height { get; set; }
    public int Breast { get; set; }
    public int Weight { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpirationDate { get; set; } = DateTime.UtcNow.AddDays(30);
    public bool IsActive { get; set; }
    public bool IsRejected { get; set; }
    public bool IsBanned { get; set; }
    public ProfileType Type { get; set; }
    public double HourPrice { get; set; }
    public double TwoHourPrice { get; set; }
    public double NightPrice { get; set; }
    public bool Apartment { get; set; }
    public bool ToClient { get; set; }
    public long UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual SxKievUser User { get; set; }
    [InverseProperty(nameof(ProfileMedia.Profile))]
    public virtual ICollection<ProfileMedia> Media { get; set; }
    [InverseProperty(nameof(ProfileDistrict.Profile))]
    public virtual ICollection<ProfileDistrict> Districts { get; set; }
    [InverseProperty(nameof(ProfileFavour.Profile))]
    public virtual ICollection<ProfileFavour> Favours { get; set; }
}