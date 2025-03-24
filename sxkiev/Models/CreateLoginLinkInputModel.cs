namespace sxkiev.Models;

public class CreateLoginLinkInputModel
{
    public long UserId { get; set; }
    public long ChatId { get; set; }
    public required string Username { get; set; }
    public required string FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsAdmin { get; set; }
}