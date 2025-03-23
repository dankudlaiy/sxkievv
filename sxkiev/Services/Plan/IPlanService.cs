using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.Plan;

public interface IPlanService
{
    Task<IEnumerable<ProfilePlan>> GetPlans();
    Task<ProfilePlan?> GetProfileById(int profileId);
    Task UpdateProfileAsync(ProfilePlan profile);
    Task<CurrentUserInfoResponseModel> GetUserInfo(long userId);
}