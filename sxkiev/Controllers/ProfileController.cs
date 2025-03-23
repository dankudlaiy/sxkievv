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
    public async Task<IActionResult> GetProfiles([FromQuery] int skip, [FromQuery] int take)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return BadRequest();

        var profiles = await _profileService.GetProfilesByUser(long.Parse(userId), skip, take);

        return Ok(profiles);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchProfiles(
        [FromQuery] double? minPrice, [FromQuery] double? maxPrice, 
        [FromQuery] int? minAge, [FromQuery] int? maxAge,
        [FromQuery] int? minWeight, [FromQuery] int? maxWeight,
        [FromQuery] int? minHeight, [FromQuery] int? maxHeight,
        [FromQuery] int? breastSize, [FromQuery] bool? apartment, [FromQuery] bool? toClient,
        [FromQuery] string? district, [FromQuery] string? favour,
        [FromQuery] int skip, [FromQuery] int take
        )
    {
        var response = await _profileService.SearchProfilesAsync(new SearchProfilesInputModel
        {
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            MinWeight = minWeight,
            MaxWeight = maxWeight,
            MinAge = minAge,
            MaxAge = maxAge,
            MinHeight = minHeight,
            MaxHeight = maxHeight,
            BreastSize = breastSize,
            Apartment = apartment,
            ToClient = toClient,
            District = district,
            Favour = favour,
            Skip = skip,
            Take = take
        });

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProfileById(Guid id)
    {
        var profile = await _profileService.GetProfileAsync(id);

        if (profile == null)
        {
            return NotFound();
        }

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
            Phone = profileInputModel.Phone,
            UserId = long.Parse(userId),
            PlanId = profileInputModel.PlanId,
            // IsPromoted = profileInputModel.IsPromoted,
            Age = profileInputModel.Age,
            Weight = profileInputModel.Weight,
            Breast = profileInputModel.Breast,
            Height = profileInputModel.Height,
            HourPrice = profileInputModel.HourPrice,
            TwoHourPrice = profileInputModel.TwoHourPrice,
            NightPrice = profileInputModel.NightPrice,
            Apartment = profileInputModel.Apartment,
            ToClient = profileInputModel.ToClient,
            Media = new List<ProfileMedia>(),
            Districts = new List<ProfileDistrict>(),
            Favours = new List<ProfileFavour>()
        };

        if (profileInputModel.Media is { Length: > 0 })
        {
            foreach (var media in profileInputModel.Media)
            {
                profile.Media.Add(new ProfileMedia
                {
                    ProfileId = profile.Id,
                    MediaId = media
                });
            }
        }

        if (profileInputModel.Districts is { Length: > 0 })
        {
            foreach (var district in profileInputModel.Districts)
            {
                profile.Districts.Add(new ProfileDistrict
                {
                    ProfileId = profile.Id,
                    District = district
                });
            }
        }

        if (profileInputModel.Favours is { Length: > 0 })
        {
            foreach (var favour in profileInputModel.Favours)
            {
                profile.Favours.Add(new ProfileFavour
                {
                    ProfileId = profile.Id,
                    Favour = favour
                });
            }
        }

        await _profileService.AddProfileAsync(profile);

        return Ok(profile.Id);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] SxKievProfile profile)
    {
        await _profileService.UpdateProfileAsync(profile);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await _profileService.DeleteProfileAsync(id);
        return NoContent();
    }
}