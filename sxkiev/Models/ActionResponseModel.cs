namespace sxkiev.Models;

public class ActionsResponseModel
{
    public required IEnumerable<ActionResponseModel> Actions { get; set; }
}

public class ActionResponseModel
{
    public required string Action { get; set; }
    public IEnumerable<ActionDateResponseModel> Dates { get; set; }
}

public class ActionDateResponseModel
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}