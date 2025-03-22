using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;
using sxkiev.Services.Media;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace sxkiev.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly IRepository<SxKievUser> _userRepository;
    private readonly IRepository<SxKievProfile> _profileRepository;
    private readonly TelegramBotClient _botClient;
    private readonly IMediaService _mediaService;
    private readonly long _adminChatId;
    private readonly string _rootPath;

    public ProfileService(IRepository<SxKievProfile> profileRepository, IConfiguration configuration, 
        IServiceProvider serviceProvider, IRepository<SxKievUser> userRepository, 
        IMediaService mediaService, IWebHostEnvironment webHostEnvironment)
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _mediaService = mediaService;
        _rootPath = webHostEnvironment.WebRootPath;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
        _adminChatId = long.Parse(serviceProvider.GetRequiredService<IConfiguration>()["AdminChatId"]!);
    }

    public async Task<(int, IEnumerable<SxKievProfile>)> GetAllProfilesAsync(int skip, int take)
    {
        var query = await _profileRepository.AsQueryable();
        query = query
            .OrderByDescending(x => x.Type)
            .ThenByDescending(x => x.CreatedAt);
        
        var count = await query.CountAsync();
        
        query = query.Skip(skip).Take(take);
        
        var profiles = await query.ToListAsync();
        
        return (count, profiles);
    }

    public async Task<IEnumerable<ProfileResponseModel?>> GetProfilesByUser(long userId, int skip, int take)
    {
        return await _profileRepository
            .Query(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Select(x => new ProfileResponseModel
            {
                Age = x.Age,
                Breast = x.Breast,
                CreatedAt = x.CreatedAt,
                Description = x.Description,
                Height = x.Height,
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Weight = x.Weight,
                HourPrice = x.HourPrice,
                TwoHourPrice = x.TwoHourPrice,
                NightPrice = x.NightPrice,
                Apartment = x.Apartment,
                ToClient = x.ToClient,
                Photos = x.Media.Select(m => m.Media).Where(w => w.Type.Contains("image")).Select(y => y.Path),
                Videos = x.Media.Select(m => m.Media).Where(w => w.Type.Contains("video")).Select(y => y.Path),
                Districts = x.Districts.Select(y => y.District.ToString()),
                Favours = x.Favours.Select(y => y.Favour.ToString())
            })
            .ToListAsync();
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
            query = query.Where(x => x.Districts.Select(y => y.District).Contains(input.District));
        }

        if (input.Favour is not null)
        {
            query = query.Where(x => x.Favours.Select(y => y.Favour).Contains(input.Favour));
        }

        query = query
            .OrderByDescending(x => x.Type)
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
                Type = x.Type,
                Weight = x.Weight,
                HourPrice = x.HourPrice,
                TwoHourPrice = x.TwoHourPrice,
                NightPrice = x.NightPrice,
                Apartment = x.Apartment,
                ToClient = x.ToClient,
                Photos = x.Media.Select(m => m.Media).Where(w => w.Type.Contains("image")).Select(y => y.Path),
                Videos = x.Media.Select(m => m.Media).Where(w => w.Type.Contains("video")).Select(y => y.Path),
                Districts = x.Districts.Select(y => y.District.ToString()),
                Favours = x.Favours.Select(y => y.Favour.ToString())
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

        var price = profile.Type switch
        {
            ProfileType.Vip => PricePolicy.Vip,
            ProfileType.Gold => PricePolicy.Gold,
            ProfileType.Platinum => PricePolicy.Platinum,
            _ => PricePolicy.Basic
        };

        if (user.Balance < price) throw new Exception("Not enough balance");

        user.Balance -= price;

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

        Data.Media? firstPhoto = null;
        foreach (var media in profile.Media)
        {
            var upload = await _mediaService.GetMediaByIdAsync(media.MediaId);
            if (upload.Type.Contains("image") && firstPhoto is null)
            {
                firstPhoto = upload;
            }
        }

        if (firstPhoto is null)
        {
            throw new ArgumentException("Profile must have at least one photo");
        }

        var relativePath = firstPhoto.Path.TrimStart('/');
        relativePath = relativePath.Replace('/', '\\');
        var filePath = Path.Combine(_rootPath, relativePath);
        await using var stream = File.OpenRead(filePath);
        await _botClient.SendPhoto(chatId:_adminChatId, photo: new InputFileStream(stream),
            caption: $"Новая анкета: {profile.Name}\nhttp://localhost:3000/{profile.Id}", replyMarkup: adminKeyboard);

        return createdProfile;
    }

    public async Task DeleteProfileAsync(Guid id)
    {
        var profile = await GetProfileAsync(id);
        if (profile == null) throw new Exception("Profile not found");
        await _profileRepository.DeleteAsync(profile);
    }
}