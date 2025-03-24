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
                SupportUrl = "https://t.me/saul_gooddman",
                TgBotUrl = "https://t.me/night_kiev_bot"
            });
            
            await dbContext.SaveChangesAsync();
        }

        if (!dbContext.Users.Any())
        {
            dbContext.Users.AddRange(new List<SxKievUser>
            {
                new() {
                    Balance = 10000,
                    ChatId = 923140210,
                    TelegramId = 923140210,
                    Username = "duralllk",
                    IsAdmin = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    FirstName = "llkdllklllkd",
                    LastName = "llkdllklllkd"
                },
                new() {
                    Balance = 10000,
                    ChatId = 770120368,
                    TelegramId = 770120368,
                    Username = "dzemych",
                    IsAdmin = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    FirstName = "dzemych",
                    LastName = "ivvv"
                },
                new() {
                    Balance = 10000,
                    ChatId = 6514493997,
                    TelegramId = 6514493997,
                    Username = "Mr_Nazar7",
                    IsAdmin = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    FirstName = "agent",
                    LastName = "nazar"
                },
            });

            await dbContext.SaveChangesAsync();
        }
    }
}