using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class Payment
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public double Amount { get; set; }
    public string Description { get; set; }
    public Guid ProfileId { get; set; }
    [InverseProperty(nameof(SxKievProfile.Payments))]
    [ForeignKey(nameof(ProfileId))]
    public SxKievProfile Profile { get; set; }
}