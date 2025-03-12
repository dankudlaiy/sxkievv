using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class ProfileMedia
{
    public int Id { get; set; }
    public Guid ProfileId { get; set; }
    [ForeignKey(nameof(ProfileId))]
    public SxKievProfile Profile { get; set; }
    public int MediaId { get; set; }
    [ForeignKey(nameof(MediaId))]
    public Media Media { get; set; }
}