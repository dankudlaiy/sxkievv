using System.ComponentModel.DataAnnotations;

namespace sxkiev.Data;

public class SxKievUser
{
    public long TelegramId { get; set; }
    public long ChatId { get; set; }
    [MaxLength(50)]
    public required string Username { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public double Balance { get; set; }
}