namespace sxkiev.Models;

public class RejectDepResponseModel
{
    public int Id { get; set; }
    public long ChatId { get; set; }
    public double Amount { get; set; }
    public DateTime Date { get; set; }
    public required string Username { get; set; }
}