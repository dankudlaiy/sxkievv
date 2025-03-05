using sxkiev.Models;
using sxkiev.Services.Auth;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
// ReSharper disable ConvertToPrimaryConstructor

namespace sxkiev;

public class BotHostedService : BackgroundService
{
    private readonly TelegramBotClient _botClient;
    private readonly IServiceProvider _serviceProvider;

    public BotHostedService(IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var me = await _botClient.GetMe(stoppingToken);
        Console.WriteLine($"@{me.Username} bot is running...");

        var receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = []
        };

        _botClient.StartReceiving(
            HandleUpdateAsync,
            HandleErrorAsync,
            receiverOptions,
            stoppingToken);

        await Task.Delay(-1, stoppingToken);
    }

    private async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Message?.Text == "/start")
        {
            await botClient.SendMessage(
                chatId: update.Message.Chat.Id,
                text: "Welcome to the bot! Type a command.",
                cancellationToken: cancellationToken);
        }

        if (update.Message?.Text == "/auth")
        {
            var userId = update.Message.From?.Id;
            var username = update.Message.From?.Username;

            if (userId is null || username is null)
            {
                return;
            }

            using var scope = _serviceProvider.CreateScope();
            var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();

            var token = await authService.CreateLoginLink(new CreateLoginLinkInputModel
            {
                UserId = userId.Value,
                Username = username
            });

            await botClient.SendMessage(
                chatId: update.Message.Chat.Id,
                text: $"Your auth token: {token}",
                cancellationToken: cancellationToken);
        }
    }

    private static Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Telegram bot error: {exception.Message}");
        return Task.CompletedTask;
    }
}