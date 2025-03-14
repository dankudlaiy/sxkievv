using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class ProfileFavour
{
    public int Id { get; set; }
    public Favour Favour { get; set; }
    public Guid ProfileId { get; set; }
    [InverseProperty(nameof(SxKievProfile.Favours))]
    [ForeignKey(nameof(ProfileId))]
    public SxKievProfile Profile { get; set; }
}