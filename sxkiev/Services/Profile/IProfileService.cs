using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.Profile;

public interface IProfileService
{
    Task<(int, IEnumerable<SxKievProfile>)> GetAllProfilesAsync(int skip, int take);
    Task<IEnumerable<ProfileResponseModel?>> GetProfilesByUser(long userId, int skip, int take);
    Task<ActionsResponseModel> GetActionsAsync(Guid profileId, string action);
    Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input);
    Task<ProfileResponseModel?> GetProfileAsync(Guid id);
    Task UpdateProfileAsync(Guid id, UpdateProfileInputModel inputModel);
    Task<SxKievProfile> AddProfileAsync(SxKievProfile profile);
    Task AddAction(Guid profileId, ActionInputModel inputModel);
    Task DeleteProfileAsync(Guid id);
}