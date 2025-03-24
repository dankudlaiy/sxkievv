using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.Profile;

public interface IProfileService
{
    Task<ProfilesResponseModel> GetProfilesByUser(long userId, int skip, int take);
    Task<ActionsResponseModel> GetActionsAsync(Guid profileId);
    Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input);
    Task<ProfileResponseModel?> GetProfileAsync(Guid id);
    Task UpdateProfileAsync(Guid id, UpdateProfileInputModel inputModel, bool isAdmin = false);
    Task RenewProfileAsync(Guid id, long userId, int months);
    Task<SxKievProfile> AddProfileAsync(SxKievProfile profile);
    Task AddAction(Guid profileId, ActionInputModel inputModel);
    Task DeleteProfileAsync(Guid id);
}