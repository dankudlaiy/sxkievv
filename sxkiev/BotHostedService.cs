using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
// ReSharper disable ConvertToPrimaryConstructor

namespace sxkiev;

public class BotHostedService : BackgroundService
{
    private readonly TelegramBotClient _botClient;

    public BotHostedService(IConfiguration configuration)
    {
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

    private static async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Message?.Text == "/start")
        {
            await botClient.SendMessage(
                chatId: update.Message.Chat.Id,
                text: "Welcome to the bot! Type a command.",
                cancellationToken: cancellationToken);
        }
    }

    private static Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Telegram bot error: {exception.Message}");
        return Task.CompletedTask;
    }
}