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

    public async Task<IEnumerable<SxKievProfile?>> GetProfilesByUser(long userId, int skip, int take)
    {
        return await _profileRepository
            .Query(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<int> GetOrderByPriority(int priority)
    {
        return await _profileRepository.Query(x => x.Priority > priority).CountAsync();
    }

    public async Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input)
    {
        var query = _profileRepository.Query(x =>
            x.IsActive && x.IsRejected != true && x.IsBanned != true && x.ExpirationDate > DateTime.UtcNow);

        if (input.MinPrice is not null && input.MaxPrice is not null)
        {
            query = query.Where(x => x.HourPrice >= input.MinPrice && x.HourPrice <= input.MaxPrice);
        }

        if (input.MinAge is not null && input.MaxAge is not null)
        {
            query = query.Where(x => x.Age >= input.MinAge && x.Age <= input.MaxAge);
        }

        if (input.MinHeight is not null && input.MaxHeight is not null)
        {
            query = query.Where(x => x.Height >= input.MinHeight && x.Height <= input.MaxHeight);
        }

        if (input.MinWeight is not null && input.MaxWeight is not null)
        {
            query = query.Where(x => x.Weight >= input.MinWeight && x.Weight <= input.MaxWeight);
        }

        if (input.Apartment is true)
        {
            query = query.Where(x => x.Apartment == input.Apartment);
        }

        if (input.ToClient is true)
        {
            query = query.Where(x => x.ToClient == input.ToClient);
        }

        if (input.District is not null)
        {
            query = query.Where(x => x.Districts.Select(y => y.District).Contains(input.District.Value));
        }

        if (input.Favour is not null)
        {
            query = query.Where(x => x.Favours.Select(y => y.Favour).Contains(input.Favour.Value));
        }

        query = query
            .OrderByDescending(x => x.Priority)
            .ThenByDescending(x => x.CreatedAt);

        var count = await query.CountAsync();

        var mapped = await query
            .Skip(input.Skip)
            .Take(input.Take)
            .Select(x => new ProfileResponseModel
            {
                Age = x.Age,
                Breast = x.Breast,
                CreatedAt = x.CreatedAt,
                Description = x.Description,
                Height = x.Height,
                Id = x.Id,
                Name = x.Name,
                Priority = x.Priority,
                Weight = x.Weight,
                HourPrice = x.HourPrice,
                TwoHourPrice = x.TwoHourPrice,
                NightPrice = x.NightPrice,
                Apartment = x.Apartment,
                ToClient = x.ToClient,
                Media = x.Media.Select(m => m.Media).Select(y => y.Path)
            })
            .ToListAsync();

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

    public async Task<SxKievProfile> AddProfileAsync(SxKievProfile profile)
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

        return createdProfile;
    }

    public async Task DeleteProfileAsync(Guid id)
    {
        var profile = await GetProfileAsync(id);
        if (profile == null) throw new Exception("Profile not found");
        await _profileRepository.DeleteAsync(profile);
    }
}