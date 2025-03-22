using sxkiev.Data;

namespace sxkiev.Services.User;

public interface IUserService
{
    Task<(int, IEnumerable<SxKievUser>)> GetAllUsersAsync(int skip, int take);
    Task<SxKievUser?> GetUserByIdAsync(long id);
    Task AddUserAsync(SxKievUser user);
    Task UpdateUserAsync(SxKievUser user);
}