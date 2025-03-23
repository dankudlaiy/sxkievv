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
                new ProfilePlan
                {
                    Type = ProfileType.Basic,
                    Duration = 1,
                    Price = 50
                },
                new ProfilePlan
                {
                    Type = ProfileType.Basic,
                    Duration = 2,
                    Price = 90
                },
                new ProfilePlan
                {
                    Type = ProfileType.Basic,
                    Duration = 3,
                    Price = 120
                },
                new ProfilePlan
                {
                    Type = ProfileType.Gold,
                    Duration = 1,
                    Price = 70
                },
                new ProfilePlan
                {
                    Type = ProfileType.Gold,
                    Duration = 2,
                    Price = 120
                },
                new ProfilePlan
                {
                    Type = ProfileType.Gold,
                    Duration = 3,
                    Price = 160
                },
                new ProfilePlan
                {
                    Type = ProfileType.Vip,
                    Duration = 1,
                    Price = 100
                },
                new ProfilePlan
                {
                    Type = ProfileType.Vip,
                    Duration = 2,
                    Price = 180
                },
                new ProfilePlan
                {
                    Type = ProfileType.Vip,
                    Duration = 3,
                    Price = 250
                },
            });

            await dbContext.SaveChangesAsync();
        }
    }
}