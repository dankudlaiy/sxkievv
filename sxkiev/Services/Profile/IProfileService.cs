using sxkiev.Data;

namespace sxkiev.Services.Profile;

public interface IProfileService
{
    Task<IEnumerable<SxKievProfile>> GetAllProfilesAsync();
    Task<SxKievProfile?> GetProfileAsync(Guid id);
    Task UpdateProfileAsync(SxKievProfile profile);
    Task AddProfileAsync(SxKievProfile profile);
    Task DeleteProfileAsync(Guid id);
}