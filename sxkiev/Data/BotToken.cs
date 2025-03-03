using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class BotToken
{
    public int Id { get; set; }
    [MaxLength(120)]
    public Guid Token { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual SxKievUser User { get; set; }
}