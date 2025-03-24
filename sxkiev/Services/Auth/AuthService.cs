using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;
using sxkiev.Services.Jwt;

namespace sxkiev.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IRepository<SxKievUser> _userRepository;
    private readonly IRepository<BotToken> _botTokenRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IRepository<SxKievUser> userRepository, IRepository<BotToken> botTokenRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _botTokenRepository = botTokenRepository;
        _jwtService = jwtService;
    }

    public async Task<string> CreateLoginLink(CreateLoginLinkInputModel inputModel)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == inputModel.UserId);

        if (user is null && !inputModel.IsAdmin)
        {
            await _userRepository.AddAsync(new SxKievUser
            {
                TelegramId = inputModel.UserId,
                ChatId = inputModel.ChatId,
                Username = inputModel.Username,
                FirstName = inputModel.FirstName,
                LastName = inputModel.LastName
            });
        }

        var guid = Guid.NewGuid();

        var token = new BotToken
        {
            Token = guid,
            UserId = inputModel.UserId
        };

        if (inputModel.IsAdmin)
        {
            var admin = await _userRepository.FirstOrDefaultAsync(x => x.IsAdmin);

            if (admin != null)
            {
                token.UserId = admin.TelegramId;
            }
        }

        await _botTokenRepository.AddAsync(token);

        var str = guid.ToString();
        
        var href = "https://night-kiev.site/auth?token=" + str;
        
        return href;
    }

    public async Task<CheckLoginLinkResponseModel> CheckLoginLink(string token)
    {
        var tokens = await _botTokenRepository.FindAsync(x => x.Token.ToString().Equals(token));
        var existing = tokens.FirstOrDefault();

        var response = new CheckLoginLinkResponseModel
        {
            IsSuccess = false,
            ErrorMessage = "Invalid or expired token"
        };

        if (existing is null || existing.CreatedAt.AddMinutes(10) < DateTime.UtcNow)
        {
            return response;
        }

        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == existing.UserId);

        if (user is null)
        {
            response.ErrorMessage = "Invalid user";
            return response;
        }

        var authToken = _jwtService.GenerateToken(user.TelegramId, user.IsAdmin ? "admin" : "user");

        response.IsSuccess = true;
        response.ErrorMessage = null;
        response.IsAdmin = user.IsAdmin;
        response.Token = authToken;

        return response;
    }

    public async Task<string> GetRole(long userId)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == userId);
        return user?.IsAdmin == true ? "admin" : "user";
    }
}