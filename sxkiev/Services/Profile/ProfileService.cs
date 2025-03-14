using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;
using Telegram.Bot;

namespace sxkiev.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly IRepository<SxKievUser> _userRepository;
    private readonly IRepository<SxKievProfile> _profileRepository;
    private readonly TelegramBotClient _botClient;
    private readonly long _adminChatId;

    public ProfileService(IRepository<SxKievProfile> profileRepository, IConfiguration configuration, IServiceProvider serviceProvider, IRepository<SxKievUser> userRepository)
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
        _adminChatId = long.Parse(serviceProvider.GetRequiredService<IConfiguration>()["AdminChatId"]!);
    }

    public async Task<IEnumerable<SxKievProfile>> GetAllProfilesAsync()
    {
        return await _profileRepository.GetAllAsync();
    }

    public async Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input)
    {
        var query = _profileRepository.Query(x =>
                x.IsActive && x.IsRejected != true && x.IsBanned != true && x.ExpirationDate > DateTime.UtcNow)
            .OrderByDescending(x => x.Priority);

        var count = await query.CountAsync();

        var mapped = await query
            .Skip(input.Skip).Take(input.Take)
            .Select(x => new ProfileResponseModel
            {
                Age = x.Age,
                Breast = x.Breast,
                CreatedAt = x.CreatedAt,
                Description = x.Description,
                ExpirationDate = x.ExpirationDate,
                Height = x.Height,
                Id = x.Id,
                Name = x.Name,
                Priority = x.Priority,
                UpdatedAt = x.UpdatedAt,
                Weight = x.Weight
            }).ToListAsync();

        var responseModel = new SearchProfilesResponseModel
        {
            TotalCount = count,
            Profiles = mapped
        };

        return responseModel;
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
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == profile.UserId);
        
        if (user is null) throw new Exception("User not found");

        if (user.Balance < PricePolicy.Profile) throw new Exception("Not enough balance");

        user.Balance -= PricePolicy.Profile;

        var createdProfile = await _profileRepository.AddAsync(profile);

        await _userRepository.UpdateAsync(user);

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