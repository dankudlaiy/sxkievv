using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Repositories.Generic;

namespace sxkiev.Services.User;

public class UserService : IUserService
{
    private readonly IRepository<SxKievUser> _userRepository;

    public UserService(IRepository<SxKievUser> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<(int, IEnumerable<SxKievUser>)> GetAllUsersAsync(int skip, int take)
    {
        var query = await _userRepository.AsQueryable();
        query = query.OrderByDescending(x => x.IsAdmin).ThenByDescending(x => x.TelegramId);

        var count = await query.CountAsync();
        
        query = query.Skip(skip).Take(take);
        
        var users = await query.ToListAsync();
        
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

    public async Task UpdateUserAsync(SxKievUser user)
    {
        await _userRepository.UpdateAsync(user);
    }
}