using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Services.Media;
using System.Security.Claims;
using sxkiev.Data;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public MediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost("upload")]
    public async Task<List<Media>> UploadMedia([FromForm] IFormFile[] files)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");
    
        var result = await _mediaService.UploadMediaAsync(files, long.Parse(userId));
    
        return result;
    }
}