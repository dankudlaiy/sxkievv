using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class SxKievProfile
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Age { get; set; }
    public int Height { get; set; }
    public int Breast { get; set; }
    public int Weight { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public int UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual required SxKievUser User { get; set; }
}