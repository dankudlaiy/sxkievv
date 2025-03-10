namespace sxkiev.Models;

public class AddDetailsResponseModel
{
    public int Id { get; set; }
    public long ChatId { get; set; }
    public required string Details { get; set; }
    public double Amount { get; set; }
    public required string Username { get; set; }
    public DateTime Date { get; set; }
    public required string Method { get; set; }
}