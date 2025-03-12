using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class Media
{
    public int Id { get; set; }
    [MaxLength(1500)]
    public required string Path { get; set; }
    [MaxLength(1500)]
    public required string Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual SxKievUser User { get; set; }
}