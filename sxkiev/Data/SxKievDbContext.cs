using Microsoft.EntityFrameworkCore;

namespace sxkiev.Data;

public class SxKievDbContext : DbContext
{
    public SxKievDbContext(DbContextOptions<SxKievDbContext> options) : base(options)
    {
    }

    public DbSet<SxKievUser> Users { get; set; }
    public DbSet<SxKievProfile> Profiles { get; set; }
    public DbSet<BotToken> BotTokens { get; set; }
    public DbSet<Dep> Deps { get; set; }
    public DbSet<Media> Medias { get; set; }
    public DbSet<ProfileMedia> ProfileMedias { get; set; }
    public DbSet<ProfileDistrict> ProfileDistrict { get; set; }
    public DbSet<ProfileFavour> ProfileFavour { get; set; }
    public DbSet<ProfilePlan> ProfilePlans { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<ProfileAction> ProfileActions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SxKievUser>()
            .HasKey(x => x.TelegramId);

        modelBuilder.Entity<SxKievUser>()
            .Property(x => x.TelegramId)
            .ValueGeneratedNever();
    }
}