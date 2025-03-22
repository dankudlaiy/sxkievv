using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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

    [HttpGet("role")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUserRole()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");
        var role = await _authService.GetRole(long.Parse(userId));
        return Ok(new { Role = role });
    }
}