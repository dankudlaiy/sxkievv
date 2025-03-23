using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class ProfileAction
{
    public int Id { get; set; }
    // [MaxLength(50)]
    public required string Action { get; set; }
    public DateTime Date { get; set; }
    public Guid ProfileId { get; set; }
    [InverseProperty(nameof(SxKievProfile.Actions))]
    [ForeignKey(nameof(ProfileId))]
    public SxKievProfile Profile { get; set; }
}