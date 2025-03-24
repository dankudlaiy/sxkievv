namespace sxkiev.Models;

public class ActionsResponseModel
{
    public required string Action { get; set; }
    public required IEnumerable<ActionResponseModel> Actions { get; set; }
}

public class ActionResponseModel
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}