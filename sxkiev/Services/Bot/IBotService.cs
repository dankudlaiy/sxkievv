using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.Bot;

public interface IBotService
{
    public Task<UserProfileResponseModel> GetUserProfile(long userId);
    public Task CreateDep(long userId, double amount);
    public Task<Dep> AddMethod(long userId, string method);
    public Task<AddDetailsResponseModel> AddDetails(int depId, string details);
    public Task<AddDetailsResponseModel> ApproveDep(int depId);
    public Task<RejectDepResponseModel> RejectDep(int depId);
    public Task<SxKievProfile> ApproveProfile(Guid profileId);
    public Task<SxKievProfile> RejectProfile(Guid profileId);
}