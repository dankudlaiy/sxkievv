using System.Security.Claims;

namespace sxkiev.Services.Jwt;

public interface IJwtService
{
    string GenerateToken(string username, string role);
    ClaimsPrincipal? ValidateToken(string token);
}