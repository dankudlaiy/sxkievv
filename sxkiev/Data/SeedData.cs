namespace sxkiev.Data;

public class SeedData
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var dbContext = serviceProvider.GetRequiredService<SxKievDbContext>();

        if (!dbContext.ProfilePlans.Any())
        {
            dbContext.ProfilePlans.AddRange(new List<ProfilePlan>
            {
                new()
                {
                    Type = ProfileType.Basic,
                    Duration = 1,
                    Price = 50
                },
                new()
                {
                    Type = ProfileType.Basic,
                    Duration = 2,
                    Price = 90
                },
                new()
                {
                    Type = ProfileType.Basic,
                    Duration = 3,
                    Price = 120
                },
                new()
                {
                    Type = ProfileType.Gold,
                    Duration = 1,
                    Price = 70
                },
                new()
                {
                    Type = ProfileType.Gold,
                    Duration = 2,
                    Price = 120
                },
                new()
                {
                    Type = ProfileType.Gold,
                    Duration = 3,
                    Price = 160
                },
                new()
                {
                    Type = ProfileType.Vip,
                    Duration = 1,
                    Price = 100
                },
                new()
                {
                    Type = ProfileType.Vip,
                    Duration = 2,
                    Price = 180
                },
                new()
                {
                    Type = ProfileType.Vip,
                    Duration = 3,
                    Price = 250
                }
            });

            await dbContext.SaveChangesAsync();
        }
        
        if (!dbContext.SiteOptions.Any())
        {
            dbContext.SiteOptions.Add(new SiteOptions
            {
                SupportUrl = "https://t.me/sxkiev",
                TgBotUrl = "https://t.me/sxkiev_bot"
            });
            
            await dbContext.SaveChangesAsync();
        }
    }
}