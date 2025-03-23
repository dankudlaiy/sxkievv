using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Data;
using sxkiev.Services.Plan;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlanController : ControllerBase
{
    private readonly IPlanService _planService;

    public PlanController(IPlanService planService)
    {
        _planService = planService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlans()
    {
        return Ok(await _planService.GetPlans());
    }

    [HttpGet("info")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUserInfo()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return BadRequest();

        var currentUserInfo = await _planService.GetUserInfo(long.Parse(userId));

        return Ok(currentUserInfo);
    }

    [HttpPut]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdatePlan([FromBody] ProfilePlan plan)
    {
        await _planService.UpdateProfileAsync(plan);
        return Ok();
    }
}