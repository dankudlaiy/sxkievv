using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Services.Profile;
using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles()
    {
        var profiles = await _profileService.GetAllProfilesAsync();
        return Ok(profiles);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfileById(Guid id)
    {
        var profile = await _profileService.GetProfileAsync(id);
        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPost]
    public async Task<IActionResult> AddProfile([FromBody] AddProfileInputModel profileInputModel)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return BadRequest();
        var profile = new SxKievProfile
        {
            Name = profileInputModel.Name,
            Description = profileInputModel.Description,
            UserId = long.Parse(userId),
            Age = profileInputModel.Age,
            Weight = profileInputModel.Weight,
            Breast = profileInputModel.Breast,
            Height = profileInputModel.Height
        };

        await _profileService.AddProfileAsync(profile);
        return CreatedAtAction(nameof(GetProfileById), new { id = profile.Id }, profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] SxKievProfile profile)
    {
        await _profileService.UpdateProfileAsync(profile);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await _profileService.DeleteProfileAsync(id);
        return NoContent();
    }
}