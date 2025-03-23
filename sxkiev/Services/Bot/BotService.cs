using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;

namespace sxkiev.Services.Bot;

public class BotService : IBotService
{
    private readonly IRepository<SxKievUser> _userRepository;
    private readonly IRepository<Dep> _depRepository;
    private readonly IRepository<SxKievProfile> _profileRepository;

    public BotService(IRepository<SxKievUser> userRepository, IRepository<Dep> depRepository, IRepository<SxKievProfile> profileRepository)
    {
        _userRepository = userRepository;
        _depRepository = depRepository;
        _profileRepository = profileRepository;
    }

    public async Task<UserProfileResponseModel> GetUserProfile(long userId)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == userId);

        if (user is null) throw new Exception("User not found");

        return new UserProfileResponseModel
        {
            Username = user.Username,
            Balance = user.Balance
        };
    }

    public async Task CreateDep(long userId, double amount)
    {
        var dep = new Dep
        {
            UserId = userId,
            Amount = amount
        };
        
        await _depRepository.AddAsync(dep);
    }

    public async Task<Dep> AddMethod(long userId, string method)
    {
        var dep = await _depRepository.FirstOrDefaultAsync(x => x.UserId == userId && x.IsRejected != true && x.IsApproved != true);
        
        if (dep is null) throw new Exception("No deposit found");
        
        dep.Method = method;
        await _depRepository.UpdateAsync(dep);

        return dep;
    }

    public async Task<AddDetailsResponseModel> AddDetails(int depId, string details)
    {
        var dep = await _depRepository.FirstOrDefaultAsync(x => x.Id == depId && x.IsRejected != true && x.IsApproved != true);
        
        if (dep is null) throw new Exception("No deposit found");
        
        dep.Details = details;
        await _depRepository.UpdateAsync(dep);
        
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == dep.UserId);
        
        if (user is null) throw new Exception("User not found");

        return new AddDetailsResponseModel
        {
            Id = dep.Id,
            ChatId = user.ChatId,
            Amount = dep.Amount!.Value,
            Details = dep.Details,
            Username = user.Username,
            Date = dep.CreatedAt,
            Method = dep.Method!
        };
    }

    public async Task<AddDetailsResponseModel> ApproveDep(int depId)
    {
        var dep = await _depRepository.FirstOrDefaultAsync(x => x.Id == depId && x.IsRejected != true && x.IsApproved != true);
        
        if (dep is null) throw new Exception("No deposit found");

        dep.IsApproved = true;
        await _depRepository.UpdateAsync(dep);
        
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == dep.UserId);
        
        if (user is null) throw new Exception("User not found");
        
        user.Balance += dep.Amount!.Value;
        await _userRepository.UpdateAsync(user);
        
        return new AddDetailsResponseModel
        {
            Id = dep.Id,
            ChatId = user.ChatId,
            Amount = dep.Amount!.Value,
            Details = dep.Details!,
            Username = user.Username,
            Date = dep.CreatedAt,
            Method = dep.Method!
        };
    }

    public async Task<RejectDepResponseModel> RejectDep(int depId)
    {
        var dep = await _depRepository.FirstOrDefaultAsync(x => x.Id == depId && x.IsRejected != true && x.IsApproved != true);
        
        if (dep is null) throw new Exception("No deposit found");
        
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == dep.UserId);
        
        if (user is null) throw new Exception("User not found");
        
        dep.IsRejected = true;
        await _depRepository.UpdateAsync(dep);

        return new RejectDepResponseModel
        {
            Id = dep.Id,
            ChatId = user.ChatId,
            Amount = dep.Amount!.Value,
            Date = dep.CreatedAt,
            Username = user.Username
        };
    }

    public async Task<SxKievProfile> ApproveProfile(Guid profileId)
    {
        var profile = await _profileRepository.FirstOrDefaultAsync(x => x.Id == profileId);
        
        if (profile is null) throw new Exception("No profile found");

        profile.Status = ProfileStatus.Active;
        await _profileRepository.UpdateAsync(profile);

        return profile;
    }

    public async Task<SxKievProfile> RejectProfile(Guid profileId)
    {
        var profile = await _profileRepository.FirstOrDefaultAsync(x => x.Id == profileId);
        
        if (profile is null) throw new Exception("No profile found");

        profile.Status = ProfileStatus.Rejected;
        await _profileRepository.UpdateAsync(profile);

        return profile;
    }
}