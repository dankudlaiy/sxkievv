using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class ProfileAction
{
    public int Id { get; set; }
    public required string Action { get; set; }
    public Guid ProfileId { get; set; }
    [InverseProperty(nameof(SxKievProfile.Actions))]
    [ForeignKey(nameof(ProfileId))]
    public SxKievProfile Profile { get; set; }
}