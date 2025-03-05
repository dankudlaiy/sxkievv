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

    public async Task<IEnumerable<SxKievUser>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllAsync();
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