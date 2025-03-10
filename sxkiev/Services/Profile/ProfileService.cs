using sxkiev.Data;
using sxkiev.Repositories.Generic;

namespace sxkiev.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly IRepository<SxKievProfile> _profileRepository;

    public ProfileService(IRepository<SxKievProfile> profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public async Task<IEnumerable<SxKievProfile>> GetAllProfilesAsync()
    {
        return await _profileRepository.GetAllAsync();
    }

    public async Task<SxKievProfile?> GetProfileAsync(Guid id)
    {
        return await _profileRepository.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task UpdateProfileAsync(SxKievProfile profile)
    {
        await _profileRepository.UpdateAsync(profile);
    }

    public async Task AddProfileAsync(SxKievProfile profile)
    {
        await _profileRepository.AddAsync(profile);
    }

    public async Task DeleteProfileAsync(Guid id)
    {
        var profile = await GetProfileAsync(id);
        if (profile == null) throw new Exception("Profile not found");
        await _profileRepository.DeleteAsync(profile);
    }
}