﻿using sxkiev.Models;
using sxkiev.Services.Auth;
using sxkiev.Services.Bot;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;

// ReSharper disable ConvertToPrimaryConstructor

namespace sxkiev;

public static class States
{
    public const string UahDep = "uahdep";
    public const string CryptoDep = "cryptodep";
    public const string Method = "method";
    public const string Details = "details";
}

public class BotHostedService : BackgroundService
{
    private readonly TelegramBotClient _botClient;
    private readonly IServiceProvider _serviceProvider;
    private readonly long _adminChatId;

    private static readonly Dictionary<long, string> UserStates = new();

    public BotHostedService(IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
        _adminChatId = long.Parse(configuration["AdminChatId"]!);
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
        long userId;
        
        if (update.Message is { Text: not null, From: not null })
        {
            userId = update.Message!.From!.Id;
            var username = update.Message.From.Username;
            
            using var scope = _serviceProvider.CreateScope();
            var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
            var botService = scope.ServiceProvider.GetRequiredService<IBotService>();
            var isAdmin = update.Message.Chat.Id == _adminChatId;

            if (update.Message?.Text == "/start")
            {
                var token = await authService.CreateLoginLink(new CreateLoginLinkInputModel
                {
                    UserId = userId,
                    ChatId = update.Message.Chat.Id,
                    Username = username!,
                    IsAdmin = isAdmin
                });

                await botClient.SendMessage(
                    chatId: update.Message.Chat.Id,
                    text: token,
                    cancellationToken: cancellationToken);
                
                var userProfile = await botService.GetUserProfile(update.Message.From!.Id);

                var text = $"👤 Пользователь: {userProfile.Username}\n💵 Баланс: {userProfile.Data}\n\nНажмите кнопку ниже, чтобы пополнить баланс";
                var keyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
                    Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Пополнить баланс",
                        "replenish_start"));

                await _botClient.SendMessage(
                    update.Message.Chat.Id,
                    text,
                    replyMarkup: keyboard,
                    cancellationToken: cancellationToken);

                return;
            }
            
            if (update.Message?.Text == "/auth")
            {
                var token = await authService.CreateLoginLink(new CreateLoginLinkInputModel
                {
                    UserId = userId,
                    ChatId = update.Message.Chat.Id,
                    Username = username!,
                    IsAdmin = isAdmin
                });

                await botClient.SendMessage(
                    chatId: update.Message.Chat.Id,
                    text: token,
                    cancellationToken: cancellationToken);

                return;
            }

            if (update.Message?.Text == "/profile")
            {
                var userProfile = await botService.GetUserProfile(update.Message.From!.Id);

                var text = $"👤 Пользователь: {userProfile.Username}\n💵 Баланс: {userProfile.Data}\n\nНажмите кнопку ниже, чтобы пополнить баланс";
                var keyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
                    Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Пополнить баланс",
                        "replenish_start"));

                await _botClient.SendMessage(
                    update.Message.Chat.Id,
                    text,
                    replyMarkup: keyboard,
                    cancellationToken: cancellationToken);

                return;
            }

            if (GetUserState(userId) == States.UahDep)
            {
                if (!double.TryParse(update.Message!.Text, out var amount))
                {
                    ClearUserState(userId);
                    var userProfile = await botService.GetUserProfile(update.Message!.From!.Id);
                    var text = $"👤 Пользователь: {userProfile.Username}\n💵 Баланс: {userProfile.Data}\n\nНажмите кнопку ниже, чтобы пополнить баланс";
                    var keyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Пополнить баланс",
                            "replenish_start"));

                    await _botClient.SendMessage(
                        update.Message.Chat.Id,
                        text,
                        replyMarkup: keyboard,
                        cancellationToken: cancellationToken);

                    return;
                }

                await botService.CreateDep(update.Message!.From.Id, amount);

                await _botClient.SendMessage(
                    update.Message.Chat.Id,
                    "Введите метод оплаты:",
                    cancellationToken: cancellationToken);

                SetUserState(userId, States.Method);
                return;
            }

            if (GetUserState(userId) == States.Method)
            {
                ClearUserState(userId);

                var dep = await botService.AddMethod(update.Message!.From.Id, update.Message.Text);
                var userProfile = await botService.GetUserProfile(update.Message!.From!.Id);

                await _botClient.SendMessage(
                    update.Message.Chat.Id,
                    "Деп создан, ждите реквизиты",
                    cancellationToken: cancellationToken);

                var adminRequestMessage =
                    $"Запрос на пополнение:\n" +
                    $"👤 Пользователь: {userProfile.Username}\n" +
                    $"💵 Сумма: {dep.Amount}\n" +
                    $"📅 Дата: {DateTime.UtcNow}\n" +
                    $"Метод оплаты: {dep.Method}\n";

                var adminKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup([
                    [
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Выдать реквизиты",
                            $"approve_replenish_{dep.Id}"),
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Отклонить",
                            $"deny_replenish_{dep.Id}")
                    ]
                ]);

                await botClient.SendMessage(
                    chatId: _adminChatId,
                    text: adminRequestMessage,
                    replyMarkup: adminKeyboard,
                    cancellationToken: cancellationToken);

                return;
            }

            if (GetUserState(userId)?.StartsWith(States.Details) == true && update.Message?.Text is not null)
            {
                var depId = int.Parse(GetUserState(userId)!.Split("_")[1]);
                
                var dep = await botService.AddDetails(depId, update.Message.Text);
                ClearUserState(userId);
                
                await botClient.SendMessage(
                    chatId: dep.ChatId,
                    text: $"Реквизиты: {dep.Details}",
                    cancellationToken: cancellationToken);
                
                var adminRequestMessage =
                    $"Ожидание оплаты\n" +
                    $"👤 Пользователь: {dep.Username}\n" +
                    $"💵 Сумма: {dep.Amount}\n" +
                    $"📅 Дата: {dep.Date}\n" +
                    $"Метод оплаты: {dep.Method}\n" +
                    $"Реквизиты: {dep.Details}\n";
                
                var adminKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup([
                    [
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Подтвердить оплату",
                            $"approve_dep_{dep.Id}"),
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Отклонить",
                            $"deny_replenish_{dep.Id}")
                    ]
                ]);
                
                await botClient.SendMessage(
                    chatId: _adminChatId,
                    text: adminRequestMessage,
                    replyMarkup: adminKeyboard,
                    cancellationToken: cancellationToken);
            }
        }
        else if (update.CallbackQuery?.From != null)
        {
            userId = update.CallbackQuery.From.Id;
            
            if (update.CallbackQuery?.Data == "replenish_start")
            {
                SetUserState(userId, States.Method);

                var adminKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup([
                    [
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("uah", "uah"),
                        Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("crypto", "crypto")
                    ]
                ]);
                
                await _botClient.EditMessageText(
                    update.CallbackQuery.Message!.Chat.Id,
                    update.CallbackQuery.Message.Id,
                    "Метод оплаты:",
                    replyMarkup: adminKeyboard,
                    cancellationToken: cancellationToken);

                return;
            }

            if (update.CallbackQuery?.Data == "uah")
            {
                // "Введите сумму, которую вы хотите пополнить:",
                SetUserState(userId, States.UahDep);
            }

            if (update.CallbackQuery?.Data == "crypto")
            {
                // "Введите сумму, которую вы хотите пополнить:",
                SetUserState(userId, States.CryptoDep);
            }

            if (update.CallbackQuery?.Data?.StartsWith("approve_replenish_") == true)
            {
                var depId = int.Parse(update.CallbackQuery.Data.Split("_")[2]);

                await botClient.EditMessageText(
                    chatId: _adminChatId,
                    messageId: update.CallbackQuery.Message!.MessageId,
                    text: "Следующим сообщением отправьте реквизиты для оплаты:",
                    cancellationToken: cancellationToken);

                SetUserState(update.CallbackQuery.From.Id, $"{States.Details}_{depId}");
            }

            if (update.CallbackQuery?.Data?.StartsWith("approve_dep_") == true)
            {
                var depId = int.Parse(update.CallbackQuery.Data.Split("_")[2]);
                
                using var scope = _serviceProvider.CreateScope();
                var botService = scope.ServiceProvider.GetRequiredService<IBotService>();

                var dep = await botService.ApproveDep(depId);
                
                await botClient.EditMessageText(
                    chatId: _adminChatId,
                    messageId: update.CallbackQuery.Message!.MessageId,
                    text: $"Деп на {dep.Amount} юзеру {dep.Username} был подтвержден",
                    cancellationToken: cancellationToken);
                
                await botClient.SendMessage(
                    chatId: dep.ChatId,
                    text: $"Деп на {dep.Amount} был подтвержден",
                    cancellationToken: cancellationToken);
            }

            if (update.CallbackQuery?.Data?.StartsWith("approve_profile_") == true)
            {
                var profileId = Guid.Parse(update.CallbackQuery.Data.Split("_")[2]);
                
                using var scope = _serviceProvider.CreateScope();
                var botService = scope.ServiceProvider.GetRequiredService<IBotService>();

                var profile = await botService.ApproveProfile(profileId);

                await _botClient.EditMessageCaption(messageId: update.CallbackQuery.Message!.Id, chatId: update.CallbackQuery.Message.Chat.Id,
                    caption: $"Анкета '{profile.Name}' опубликована\nhttp://localhost:3000/{profile.Id}", cancellationToken: cancellationToken);
            }
            
            if (update.CallbackQuery?.Data?.StartsWith("deny_replenish_") == true)
            {
                var depId = int.Parse(update.CallbackQuery.Data.Split("_")[2]);
                
                using var scope = _serviceProvider.CreateScope();
                var botService = scope.ServiceProvider.GetRequiredService<IBotService>();

                var dep = await botService.RejectDep(depId);
                
                await botClient.EditMessageText(
                    chatId: _adminChatId,
                    messageId: update.CallbackQuery.Message!.MessageId,
                    text: $"Деп на {dep.Amount} юзеру {dep.Username} был отклонен",
                    cancellationToken: cancellationToken);
                
                await botClient.SendMessage(
                    chatId: dep.ChatId,
                    text: $"Деп на {dep.Amount} был отклонен",
                    cancellationToken: cancellationToken);
            }
            
            if (update.CallbackQuery?.Data?.StartsWith("deny_profile_") == true)
            {
                var profileId = Guid.Parse(update.CallbackQuery.Data.Split("_")[2]);

                using var scope = _serviceProvider.CreateScope();
                var botService = scope.ServiceProvider.GetRequiredService<IBotService>();

                var profile = await botService.RejectProfile(profileId);

                await _botClient.EditMessageCaption(messageId: update.CallbackQuery.Message!.Id, chatId: update.CallbackQuery.Message.Chat.Id,
                    caption: $"Анкета '{profile.Name}' отклонена\nhttp://localhost:3000/{profile.Id}", cancellationToken: cancellationToken);
            }
        }
    }

    private static Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Telegram bot error: {exception.Message}");
        return Task.CompletedTask;
    }

    private static void SetUserState(long userId, string state)
    {
        UserStates[userId] = state;
    }

    private static string? GetUserState(long userId)
    {
        return UserStates.GetValueOrDefault(userId);
    }

    private static void ClearUserState(long userId)
    {
        UserStates.Remove(userId);
    }
}