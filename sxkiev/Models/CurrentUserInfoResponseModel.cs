namespace sxkiev.Models;

public class CurrentUserInfoResponseModel
{
    public double Data { get; set; }
    public IEnumerable<ApprovedDepResponseModel> Deps { get; set; }
    public IEnumerable<PaymentResponseModel> Payments { get; set; }
}

public class ApprovedDepResponseModel
{
    public int Id { get; set; }
    public double Amount { get; set; }
    public DateTime Date { get; set; }
}

public class PaymentResponseModel
{
    public int Id { get; set; }
    public double Amount { get; set; }
    public DateTime Date { get; set; }
    public required string Description { get; set; }
}