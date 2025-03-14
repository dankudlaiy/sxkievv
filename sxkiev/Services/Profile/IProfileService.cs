using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.Profile;

public interface IProfileService
{
    Task<IEnumerable<SxKievProfile>> GetAllProfilesAsync();
    Task<IEnumerable<SxKievProfile?>> GetProfilesByUser(long userId, int skip, int take);
    Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input);
    Task<SxKievProfile?> GetProfileAsync(Guid id);
    Task UpdateProfileAsync(SxKievProfile profile);
    Task AddProfileAsync(SxKievProfile profile);
    Task DeleteProfileAsync(Guid id);
}