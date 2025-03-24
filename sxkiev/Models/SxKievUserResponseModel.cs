namespace sxkiev.Models;

public class SxKievUserResponseModel
{
    public long TelegramId { get; set; }
    public long ChatId { get; set; }
    public required string Username { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public double Data { get; set; }
    public double Deposit { get; set; }
}