using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;

namespace sxkiev.Services.User;

public class UserService : IUserService
{
    private readonly IRepository<SxKievUser> _userRepository;

    public UserService(IRepository<SxKievUser> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<(int, IEnumerable<SxKievUserResponseModel>)> GetAllUsersAsync(int skip, int take)
    {
        var query = await _userRepository.AsQueryable();
        query = query.OrderByDescending(x => x.IsAdmin).ThenByDescending(x => x.TelegramId);

        var count = await query.CountAsync();

        var users = await query
            .Skip(skip)
            .Take(take)
            .Select(x => new SxKievUserResponseModel
            {
                Data = x.Data,
                ChatId = x.ChatId,
                CreatedAt = x.CreatedAt,
                TelegramId = x.TelegramId,
                IsAdmin = x.IsAdmin,
                Username = x.Username,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UpdatedAt = x.UpdatedAt,
                Deposit = x.Deps.Where(dep => dep.Amount.HasValue).Sum(dep => dep.Amount) ?? 0
            }).ToListAsync();
        
        return (count, users);
    }

    public async Task<SxKievUser?> GetUserByIdAsync(long id)
    {
        return await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == id);
    }

    public async Task AddUserAsync(SxKievUser user)
    {
        await _userRepository.AddAsync(user);
    }

    public async Task<SxKievUser> UpdateUserAsync(long id, UpdateUserInputModel inputModel)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == id);
        
        if (user is null) throw new Exception("User not found");
        
        if (inputModel.IsAdmin.HasValue) user.IsAdmin = inputModel.IsAdmin.Value;
        if (inputModel.Data.HasValue) user.Data = inputModel.Data.Value;
        
        await _userRepository.UpdateAsync(user);
        
        return user;
    }
}