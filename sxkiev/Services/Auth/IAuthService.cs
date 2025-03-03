using sxkiev.Models;

namespace sxkiev.Services.Auth;

public interface IAuthService
{
    Task<string> CreateLoginLink(CreateLoginLinkInputModel inputModel);
    Task<CheckLoginLinkResponseModel> CheckLoginLink(string token);
}