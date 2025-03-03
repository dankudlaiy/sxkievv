using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class BotToken
{
    public int Id { get; set; }
    public string Token { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public virtual required SxKievUser User { get; set; }
}