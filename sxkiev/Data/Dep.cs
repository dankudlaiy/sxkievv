using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class Dep
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public double? Amount { get; set; }
    public string? Method { get; set; }
    public string? Details { get; set; }
    public bool IsRejected { get; set; }
    public bool IsApproved { get; set; }
    public long UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual SxKievUser User { get; set; }
}