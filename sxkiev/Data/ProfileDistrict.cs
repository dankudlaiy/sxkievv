using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class ProfileDistrict
{
    public int Id { get; set; }
    public District District { get; set; }
    public Guid ProfileId { get; set; }
    [InverseProperty(nameof(SxKievProfile.Districts))]
    [ForeignKey(nameof(ProfileId))]
    public SxKievProfile Profile { get; set; }
}