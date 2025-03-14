using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sxkiev.Data;

public class SxKievUser
{
    public long TelegramId { get; set; }
    public long ChatId { get; set; }
    [MaxLength(50)]
    public required string Username { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public double Balance { get; set; }
    [InverseProperty(nameof(SxKievProfile.User))]
    public virtual ICollection<SxKievProfile> Profiles { get; set; }
    [InverseProperty(nameof(BotToken.User))]
    public virtual ICollection<BotToken> BotTokens { get; set; }
    [InverseProperty(nameof(Data.Media.User))]
    public virtual ICollection<Media> Media { get; set; }
    [InverseProperty(nameof(Dep.User))]
    public virtual ICollection<Dep> Deps { get; set; }
}