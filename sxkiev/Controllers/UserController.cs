using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sxkiev.Data;
using sxkiev.Services.User;

namespace sxkiev.Controllers;

[Authorize(Roles = "admin")]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> AddUser([FromBody] SxKievUser user)
    {
        await _userService.AddUserAsync(user);
        return CreatedAtAction(nameof(GetUserById), new { id = user.TelegramId }, user);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUser([FromBody] SxKievUser user)
    {
        await _userService.UpdateUserAsync(user);
        return NoContent();
    }
}
