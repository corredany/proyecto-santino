namespace CitasApi.Tests;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CitasApi.Infrastructure.Database;

public class BaseIntegrationTest : IClassFixture<WebApplicationFactory<Program>>
{
    protected readonly HttpClient _client;
    protected readonly WebApplicationFactory<Program> _factory;

    public BaseIntegrationTest(WebApplicationFactory<Program> factory)
    {
        Environment.SetEnvironmentVariable("Jwt__Secret", "tu_clave_secreta_muy_larga_y_segura");

        var dbName = Guid.NewGuid().ToString();

        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var toRemove = services.Where(d =>
                    d.ServiceType.FullName != null &&
                    (d.ServiceType.FullName.Contains("EntityFramework") ||
                     d.ServiceType.FullName.Contains("DbContext") ||
                     d.ServiceType == typeof(AppDbContext))).ToList();

                foreach (var descriptor in toRemove)
                    services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase(dbName)); // ← mismo nombre para todas las operaciones
            });
        });

        _client = _factory.CreateClient();
    }

    protected string GenerarTokenValido()
    {
        var secret = "tu_clave_secreta_muy_larga_y_segura";
        var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(secret));
        var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
            key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            claims: new[] { new System.Security.Claims.Claim("id", "1") },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    }
}