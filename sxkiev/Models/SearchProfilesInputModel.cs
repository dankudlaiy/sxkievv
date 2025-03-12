namespace sxkiev.Models;

public class SearchProfilesInputModel
{
    public string? Filter { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; }
}