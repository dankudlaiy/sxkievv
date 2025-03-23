using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Repositories.Generic;
using Telegram.Bot;

namespace sxkiev;

public class DailyJobHostedService : BackgroundService {

    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<DailyJobHostedService> _logger;
    private readonly TelegramBotClient _botClient;
    private readonly long _adminChatId;

    public DailyJobHostedService(ILogger<DailyJobHostedService> logger, IServiceScopeFactory serviceScopeFactory, IConfiguration configuration)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
        _adminChatId = long.Parse(configuration["AdminChatId"]!);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("DailyJobService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunDailyTask(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while executing the task.");
            }

            try
            {
                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }
        }
    }

    private async Task RunDailyTask(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Running daily task at: {time}", DateTime.Now);

        using var scope = _serviceScopeFactory.CreateScope();
        
        var profileRepository = scope.ServiceProvider.GetRequiredService<IRepository<SxKievProfile>>();
        
        var profileQuery = profileRepository.Query(
            x => x.Status == ProfileStatus.Active && x.ExpirationDate < DateTime.UtcNow);
        var expiredProfiles = await profileQuery.ToListAsync(cancellationToken: cancellationToken);

        foreach (var profile in expiredProfiles)
        {
            profile.Status = ProfileStatus.Expired;
            await profileRepository.UpdateAsync(profile);
            
            var userRepository = scope.ServiceProvider.GetRequiredService<IRepository<SxKievUser>>();
            var user = await userRepository.FirstOrDefaultAsync(x => x.TelegramId == profile.UserId);
            
            await _botClient.SendMessage(
                chatId: user!.ChatId,
                text: $"Анкета {profile.Name} была отключена. Продлите её у себя в профиле чтобы она снова была видна на сайте.",
                cancellationToken: cancellationToken);
            
            await _botClient.SendMessage(
                chatId: _adminChatId,
                text: $"Анкета {profile.Name} была отключена.",
                cancellationToken: cancellationToken);
        }
    }
}