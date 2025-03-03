using System.ComponentModel.DataAnnotations;

namespace sxkiev.Data;

public class SxKievUser
{
    public int TelegramId { get; set; }
    [MaxLength(50)]
    public required string Username { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public double Balance { get; set; }
}