namespace sxkiev.Models;

public class SearchProfilesInputModel
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public double? MinPrice { get; set; }
    public double? MaxPrice { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public int? MinWeight { get; set; }
    public int? MaxWeight { get; set; }
    public int? MinHeight { get; set; }
    public int? MaxHeight { get; set; }
    public int? BreastSize { get; set; }
    public bool? Apartment { get; set; }
    public bool? ToClient { get; set; }
    public District? District { get; set; }
    public Favour? Favour { get; set; }
}