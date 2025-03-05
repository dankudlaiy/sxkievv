using Microsoft.AspNetCore.Mvc;
using sxkiev.Models;
using sxkiev.Services.Auth;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    public async Task<CheckLoginLinkResponseModel> GetAuthToken([FromQuery] string botToken)
    {
        var response = await _authService.CheckLoginLink(botToken);
        return response;
    }
}