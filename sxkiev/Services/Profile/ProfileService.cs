using sxkiev.Data;
using sxkiev.Repositories.Generic;
using Telegram.Bot;

namespace sxkiev.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly IRepository<SxKievProfile> _profileRepository;
    private readonly TelegramBotClient _botClient;
    private readonly long _adminChatId;

    public ProfileService(IRepository<SxKievProfile> profileRepository, IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _profileRepository = profileRepository;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
        _adminChatId = long.Parse(serviceProvider.GetRequiredService<IConfiguration>()["AdminChatId"]!);
    }

    public async Task<IEnumerable<SxKievProfile>> GetAllProfilesAsync()
    {
        return await _profileRepository.GetAllAsync();
    }

    public async Task<SxKievProfile?> GetProfileAsync(Guid id)
    {
        return await _profileRepository.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task UpdateProfileAsync(SxKievProfile profile)
    {
        await _profileRepository.UpdateAsync(profile);
    }

    public async Task AddProfileAsync(SxKievProfile profile)
    {
        var createdProfile = await _profileRepository.AddAsync(profile);
        
        var adminKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup([
            [
                Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Опубликовать",
                    $"approve_profile_{createdProfile.Id}"),
                Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Отклонить",
                    $"deny_profile_{createdProfile.Id}")
            ]
        ]);

        await _botClient.SendMessage(chatId:_adminChatId, text: $"Новая анкета: {profile.Name}", replyMarkup: adminKeyboard);
    }

    public async Task DeleteProfileAsync(Guid id)
    {
        var profile = await GetProfileAsync(id);
        if (profile == null) throw new Exception("Profile not found");
        await _profileRepository.DeleteAsync(profile);
    }
}