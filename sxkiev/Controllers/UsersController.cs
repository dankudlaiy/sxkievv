using Microsoft.AspNetCore.Mvc;
using sxkiev.Data;
using sxkiev.Services.User;

namespace sxkiev.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _usersService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _usersService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> AddUser([FromBody] SxKievUser user)
    {
        await _usersService.AddUserAsync(user);
        return CreatedAtAction(nameof(GetUserById), new { id = user.TelegramId }, user);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] SxKievUser user)
    {
        if (id != user.TelegramId)
            return BadRequest();

        await _usersService.UpdateUserAsync(user);
        return NoContent();
    }
}
