using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.User;

public interface IUserService
{
    Task<(int, IEnumerable<SxKievUserResponseModel>)> GetAllUsersAsync(int skip, int take);
    Task<SxKievUser?> GetUserByIdAsync(long id);
    Task AddUserAsync(SxKievUser user);
    Task<SxKievUser> UpdateUserAsync(long id, UpdateUserInputModel inputModel);
}