namespace API.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

public class TokenService {
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;

    public TokenService(UserManager<User> userManager, IConfiguration config) {
        _userManager = userManager;
        _config = config;
    }

    public async Task<string> GenerateToken(User user) {
        // Claim means show who I am.
        var claims = new List<Claim> {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName),
        };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles) {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var secretKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey2"]));

        var creds = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha512);

        var jwt = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
        );

        // just write to string.
        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

}
