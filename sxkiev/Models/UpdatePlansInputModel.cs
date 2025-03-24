namespace sxkiev.Models;

public class UpdatePlansInputModel
{
    public required List<UpdatePlanInputModel> Plans { get; set; }
}

public class UpdatePlanInputModel
{
    public int Id { get; set; }
    public ProfileType Type { get; set; }
    public int Price { get; set; }
    public int Duration { get; set; }
}