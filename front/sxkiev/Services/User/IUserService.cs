using sxkiev.Data;

namespace sxkiev.Services.User;

public interface IUserService
{
    Task<IEnumerable<SxKievUser>> GetAllUsersAsync();
    Task<SxKievUser?> GetUserByIdAsync(long id);
    Task AddUserAsync(SxKievUser user);
    Task UpdateUserAsync(SxKievUser user);
}