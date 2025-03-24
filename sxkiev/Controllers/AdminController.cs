using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Models;
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
        
        if (user == null) return NotFound();

        return Ok(user);
    }

    [HttpPut("users")]
    public async Task<IActionResult> UpdateUser([FromQuery] long id, [FromBody] UpdateUserInputModel inputModel)
    {
        var user = await _userService.UpdateUserAsync(id, inputModel);
        return Ok(user);
    }

    #endregion

    #region Profiles

    [HttpGet("profiles")]
    public async Task<IActionResult> GetProfiles([FromQuery] long userId, [FromQuery] int skip, [FromQuery] int take)
    {
        var profiles = await _profileService.GetProfilesByUser(userId, skip, take);
        return Ok(profiles);
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
    public async Task<IActionResult> UpdateProfile([FromQuery] Guid id, [FromBody] UpdateProfileInputModel profile)
    {
        await _profileService.UpdateProfileAsync(id, profile, true);
        return NoContent();
    }
    
    [HttpPut("renew")]
    public async Task<IActionResult> RenewProfile([FromQuery] Guid id, [FromQuery] int days)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return BadRequest();

        await _profileService.AdminRenewProfileAsync(id, days);
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