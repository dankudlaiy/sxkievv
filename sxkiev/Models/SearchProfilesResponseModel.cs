namespace sxkiev.Models;

public class SearchProfilesResponseModel
{
    public int TotalCount { get; set; }
    public required List<ProfileResponseModel> Profiles { get; set; }
}