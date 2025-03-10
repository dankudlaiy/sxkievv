namespace sxkiev.Models;

public class CheckLoginLinkResponseModel
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public string? Token { get; set; }
    public bool IsAdmin { get; set; }
}