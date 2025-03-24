using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Data;
using sxkiev.Repositories.Generic;
using sxkiev.Services.Plan;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlanController : ControllerBase
{
    private readonly IPlanService _planService;
    private readonly IRepository<SiteOptions> _siteOptionsRepository;

    public PlanController(IPlanService planService, IRepository<SiteOptions> siteOptionsRepository)
    {
        _planService = planService;
        _siteOptionsRepository = siteOptionsRepository;
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

    [HttpGet("options")]
    [AllowAnonymous]
    public async Task<SiteOptions> GetSiteOptions()
    { 
        var options = await _siteOptionsRepository.FirstOrDefaultAsync(x => x.Id == 1);
         
        if (options == null) throw new Exception("Site options not found");
        
        return options;
    }
    
    [HttpPut("options")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateSiteOptions([FromBody] SiteOptions options)
    {
        await _siteOptionsRepository.UpdateAsync(options);
        return Ok();
    }
}