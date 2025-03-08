using System.Security.Claims;

namespace sxkiev.Services.Jwt;

public interface IJwtService
{
    string GenerateToken(long userId, string role);
    ClaimsPrincipal? ValidateToken(string token);
}