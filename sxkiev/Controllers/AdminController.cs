using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Data;
using sxkiev.Services.Profile;
using sxkiev.Services.User;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IProfileService _profileService;
    
    public AdminController(IUserService userService, IProfileService profileService)
    {
        _userService = userService;
        _profileService = profileService;
    }

    #region Users

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int skip, [FromQuery] int take)
    {
        var users = await _userService.GetAllUsersAsync(skip, take);
        return Ok(new { Count = users.Item1, Users = users.Item2 });
    }

    [HttpGet("users/{id:int}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPut("users")]
    public async Task<IActionResult> UpdateUser([FromBody] SxKievUser user)
    {
        await _userService.UpdateUserAsync(user);
        return NoContent();
    }

    #endregion

    #region Profiles

    [HttpGet("profiles")]
    public async Task<IActionResult> GetAllProfiles([FromQuery] int skip, [FromQuery] int take)
    {
        var profiles = await _profileService.GetAllProfilesAsync(skip, take);
        return Ok(new { Count = profiles.Item1, Profiles = profiles.Item2 });
    }

    [HttpGet("profiles/{id:guid}")]
    public async Task<IActionResult> GetProfileById(Guid id)
    {
        var profile = await _profileService.GetProfileAsync(id);

        if (profile == null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    [HttpPut("profiles")]
    public async Task<IActionResult> UpdateProfile([FromBody] SxKievProfile profile)
    {
        await _profileService.UpdateProfileAsync(profile);
        return NoContent();
    }

    [HttpDelete("profiles/{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await _profileService.DeleteProfileAsync(id);
        return NoContent();
    }

    #endregion
}