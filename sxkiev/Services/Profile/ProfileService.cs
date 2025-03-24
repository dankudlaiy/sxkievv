using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;
using sxkiev.Services.Media;
using sxkiev.Services.Plan;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace sxkiev.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly IRepository<SxKievUser> _userRepository;
    private readonly IRepository<SxKievProfile> _profileRepository;
    private readonly IRepository<ProfileDistrict> _districtRepository;
    private readonly IRepository<ProfileFavour> _favourRepository;
    private readonly IRepository<ProfileMedia> _mediaRepository;
    private readonly IRepository<ProfileAction> _actionRepository;
    private readonly IRepository<ProfilePlan> _planRepository;
    private readonly TelegramBotClient _botClient;
    private readonly IMediaService _mediaService;
    private readonly IPlanService _planService;
    private readonly long _adminChatId;
    private readonly string _rootPath;

    public ProfileService(IRepository<SxKievProfile> profileRepository, IConfiguration configuration, 
        IServiceProvider serviceProvider, IRepository<SxKievUser> userRepository, 
        IMediaService mediaService, IWebHostEnvironment webHostEnvironment, IPlanService planService, 
        IRepository<ProfileDistrict> districtRepository, IRepository<ProfileFavour> favourRepository, 
        IRepository<ProfileMedia> mediaRepository, IRepository<ProfileAction> actionRepository, IRepository<ProfilePlan> planRepository)
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _mediaService = mediaService;
        _planService = planService;
        _districtRepository = districtRepository;
        _favourRepository = favourRepository;
        _mediaRepository = mediaRepository;
        _actionRepository = actionRepository;
        _planRepository = planRepository;
        _rootPath = webHostEnvironment.WebRootPath;
        _botClient = new TelegramBotClient(configuration["BotToken"]!);
        _adminChatId = long.Parse(serviceProvider.GetRequiredService<IConfiguration>()["AdminChatId"]!);
    }

    public async Task<ProfilesResponseModel> GetProfilesByUser(long userId, int skip, int take)
    {
        var query = _profileRepository
            .Query(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ProfileResponseModel
            {
                Age = x.Age,
                Breast = x.Breast,
                CreatedAt = x.CreatedAt,
                ExpirationDate = x.ExpirationDate,
                Description = x.Description,
                Phone = x.Phone,
                Height = x.Height,
                Id = x.Id,
                Name = x.Name,
                Type = x.Plan.Type,
                Status = x.Status,
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
            });

        var count = await query.CountAsync();
        
        var paginated = await query
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return new ProfilesResponseModel
        {
            Count = count,
            Profiles = paginated
        };
    }

    public async Task<ActionsResponseModel> GetActionsAsync(Guid profileId)
    {
        var query = _actionRepository
            .Query(x => x.ProfileId == profileId)
            .GroupBy(x => x.Action)
            .Select(actionGroup => new ActionResponseModel
            {
                Action = actionGroup.Key,
                Dates = actionGroup
                    .GroupBy(a => a.Date.Date)
                    .Select(dateGroup => new ActionDateResponseModel
                    {
                        Date = dateGroup.Key,
                        Count = dateGroup.Count()
                    })
                    .OrderByDescending(d => d.Date)
                    .ToList()
            })
            .OrderByDescending(a => a.Action);

        var response = new ActionsResponseModel
        {
            Actions = await query.ToListAsync()
        };

        return response;
    }

    public async Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input)
    {
        var query = _profileRepository.Query(x =>
            x.Status == ProfileStatus.Active && x.ExpirationDate > DateTime.UtcNow);

        if (input.MinPrice is not null)
        {
            query = query.Where(x => x.HourPrice >= input.MinPrice);
        }

        if (input.MaxPrice is not null)
        {
            query = query.Where(x => x.HourPrice <= input.MaxPrice);
        }

        if (input.MinAge is not null && input.MaxAge is not null)
        {
            query = query.Where(x => x.Age >= input.MinAge);
        }

        if (input.MaxAge is not null)
        {
            query = query.Where(x => x.Age <= input.MaxAge);
        }

        if (input.MinHeight is not null)
        {
            query = query.Where(x => x.Height >= input.MinHeight);
        }

        if (input.MaxHeight is not null)
        {
            query = query.Where(x => x.Height <= input.MaxHeight);
        }

        if (input.MinWeight is not null && input.MaxWeight is not null)
        {
            query = query.Where(x => x.Weight >= input.MinWeight);
        }

        if (input.MaxWeight is not null)
        {
            query = query.Where(x => x.Weight <= input.MaxWeight);
        }

        if (input.BreastSize is not null)
        {
            query = query.Where(x => x.Breast == input.BreastSize);
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
            .OrderByDescending(x => x.Plan.Type)
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
                ExpirationDate = x.ExpirationDate,
                Description = x.Description,
                Phone = x.Phone,
                Height = x.Height,
                Id = x.Id,
                Name = x.Name,
                Type = x.Plan.Type,
                Status = x.Status,
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

    public async Task<ProfileResponseModel?> GetProfileAsync(Guid id)
    {
        var profile = await _profileRepository
            .Query(x => x.Id == id)
            .Select(x => new ProfileResponseModel
            {
                Age = x.Age,
                Breast = x.Breast,
                CreatedAt = x.CreatedAt,
                ExpirationDate = x.ExpirationDate,
                Description = x.Description,
                Phone = x.Phone,
                Height = x.Height,
                Id = x.Id,
                Name = x.Name,
                Type = x.Plan.Type,
                Status = x.Status,
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
            }).FirstOrDefaultAsync();
        
        return profile;
    }

    public async Task UpdateProfileAsync(Guid id, UpdateProfileInputModel inputModel, bool isAdmin = false)
    {
        var profile = await _profileRepository.FirstOrDefaultAsync(x => x.Id == id);
        
        if (profile is null) throw new Exception("Profile not found");

        if (!string.IsNullOrEmpty(inputModel.Name)) profile.Name = inputModel.Name;

        if (!string.IsNullOrEmpty(inputModel.Description)) profile.Description = inputModel.Description;
        
        if (!string.IsNullOrEmpty(inputModel.Phone)) profile.Phone = inputModel.Phone;

        if (inputModel.Age is not null) profile.Age = inputModel.Age.Value;

        if (inputModel.Height is not null) profile.Height = inputModel.Height.Value;

        if (inputModel.Breast is not null) profile.Breast = inputModel.Breast.Value;

        if (inputModel.Weight is not null) profile.Weight = inputModel.Weight.Value;

        if (inputModel.HourPrice is not null) profile.HourPrice = inputModel.HourPrice.Value;

        if (inputModel.TwoHourPrice is not null) profile.TwoHourPrice = inputModel.TwoHourPrice.Value;

        if (inputModel.NightPrice is not null) profile.NightPrice = inputModel.NightPrice.Value;
        
        if (inputModel.Apartment is not null) profile.Apartment = inputModel.Apartment.Value;

        if (inputModel.ToClient is not null) profile.ToClient = inputModel.ToClient.Value;

        if (inputModel.PlanId is not null)
        {
            var oldPlan = await _planService.GetProfileById(profile.PlanId);
            var plan = await _planService.GetProfileById(inputModel.PlanId.Value);

            if (plan is null || oldPlan is null) throw new Exception("Plan not found");

            if (DateTime.UtcNow < profile.ExpirationDate && !isAdmin)
            {
                var daysLeft = profile.ExpirationDate - DateTime.UtcNow;
                var oldPricePerDay = oldPlan.Price /(double) oldPlan.Duration * 30;
                var newPricePerDay = plan.Price /(double) plan.Duration * 30;

                var cof = oldPricePerDay / newPricePerDay;
                var newDaysLeft = daysLeft * cof;
                profile.ExpirationDate = DateTime.UtcNow.Add(newDaysLeft);
            }

            profile.PlanId = inputModel.PlanId.Value;
        }

        if (inputModel.Status is not null &&
            (!isAdmin && profile.Status is ProfileStatus.Active or ProfileStatus.Hidden &&
                inputModel.Status is ProfileStatus.Active or ProfileStatus.Hidden || isAdmin))
        {
            profile.Status = inputModel.Status.Value;
        }

        if (inputModel.Districts is not null)
        {
            await _districtRepository.DeleteAsync(x => x.ProfileId == profile.Id);
            
            foreach (var district in inputModel.Districts)
            {
                profile.Districts.Add(new ProfileDistrict
                {
                    ProfileId = profile.Id,
                    District = district
                });
            }
        }

        if (inputModel.Favours is not null)
        {
            await _favourRepository.DeleteAsync(x => x.ProfileId == profile.Id);
            
            foreach (var favour in inputModel.Favours)
            {
                profile.Favours.Add(new ProfileFavour
                {
                    ProfileId = profile.Id,
                    Favour = favour
                });
            }
        }

        if (inputModel.Media is not null)
        {
            await _mediaRepository.DeleteAsync(x => x.ProfileId == profile.Id);

            foreach (var media in inputModel.Media)
            {
                profile.Media.Add(new ProfileMedia
                {
                    ProfileId = profile.Id,
                    MediaId = media
                });
            }
        }
        
        await _profileRepository.UpdateAsync(profile);
    }

    public async Task RenewProfileAsync(Guid id, long userId, int months)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == userId);
        
        if (user is null) throw new Exception("User not found");
        
        var profile = await _profileRepository
            .Query(x => x.Id == id)
            .Include(x => x.Plan)
            .FirstOrDefaultAsync();
        
        if (profile is null || profile.UserId != userId) throw new Exception("Profile not found");

        if (profile.Status != ProfileStatus.Active && profile.Status != ProfileStatus.Expired &&
            profile.Status != ProfileStatus.Hidden)
        {
            throw new Exception("Profile is not active");
        }
        
        var plan = await _planRepository.FirstOrDefaultAsync(x => x.Type == profile.Plan.Type && x.Duration == months);
        
        if (plan is null) throw new Exception("Plan not found");
        
        if (user.Balance < plan.Price) throw new Exception("Not enough balance");

        user.Balance -= plan.Price;
        
        var start = DateTime.UtcNow;

        if (profile.ExpirationDate > start)
        {
            start = profile.ExpirationDate;
        }

        profile.ExpirationDate = start.AddMonths(plan.Duration);
        
        await _profileRepository.UpdateAsync(profile);
        
        await _userRepository.UpdateAsync(user);
    }

    public async Task<SxKievProfile> AddProfileAsync(SxKievProfile profile)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == profile.UserId);
        
        if (user is null) throw new Exception("User not found");

        var plan = await _planService.GetProfileById(profile.PlanId);
        
        if (plan is null) throw new Exception("Plan not found");

        if (user.Balance < plan.Price) throw new Exception("Not enough balance");

        user.Balance -= plan.Price;

        profile.ExpirationDate = DateTime.UtcNow.AddMonths(plan.Duration);

        profile.Payments = new List<Payment>
        {
            new()
            {
                Amount = plan.Price,
                Date = DateTime.UtcNow,
                ProfileId = profile.Id,
                Description = $"Оплата анкеты {profile.Name}"
            }
        };

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

    public async Task AddAction(Guid profileId, ActionInputModel inputModel)
    {
        var action = new ProfileAction
        {
            Action = inputModel.Action,
            ProfileId = profileId,
            Date = DateTime.UtcNow
        };

        await _actionRepository.AddAsync(action);
    }

    public async Task DeleteProfileAsync(Guid id)
    {
        var profile = await _profileRepository.FirstOrDefaultAsync(x => x.Id == id);
        if (profile == null) throw new Exception("Profile not found");
        await _profileRepository.DeleteAsync(profile);
    }
}