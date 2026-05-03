namespace CitasApi.Tests;

using CitasApi.Infrastructure.Helpers;
using Microsoft.Extensions.Configuration;
using Xunit;

public class TokenHelperTests
{
    private readonly TokenHelper _tokenHelper;
    private const string SecretValido = "clave_secreta_muy_larga_para_pruebas_12345678";

    public TokenHelperTests()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:Secret", SecretValido }
            })
            .Build();

        _tokenHelper = new TokenHelper(configuration);
    }

    [Fact]
    public void ValidarToken_DebeRetornarTrue_CuandoTokenEsValido()
    {
        // Arrange - generamos un token válido manualmente
        var tokenHelper = _tokenHelper;
        // Usamos un token JWT válido generado con la misma clave
        var token = GenerarTokenValido();

        // Act
        var resultado = _tokenHelper.ValidarToken(token);

        // Assert
        Assert.True(resultado);
    }

    [Fact]
    public void ValidarToken_DebeRetornarFalse_CuandoTokenEsInvalido()
    {
        // Act
        var resultado = _tokenHelper.ValidarToken("token_invalido");

        // Assert
        Assert.False(resultado);
    }

    [Fact]
    public void ValidarToken_DebeRetornarFalse_CuandoTokenEstaVacio()
    {
        // Act
        var resultado = _tokenHelper.ValidarToken(string.Empty);

        // Assert
        Assert.False(resultado);
    }

    [Fact]
    public void ObtenerUsuarioId_DebeRetornarId_CuandoTokenEsValido()
    {
        // Arrange
        var token = GenerarTokenValido();

        // Act
        var resultado = _tokenHelper.ObtenerUsuarioId(token);

        // Assert
        Assert.Equal(1, resultado);
    }

    [Fact]
    public void ObtenerUsuarioId_DebeRetornarCero_CuandoTokenNoTieneId()
    {
        // Arrange
        var token = GenerarTokenSinId();

        // Act
        var resultado = _tokenHelper.ObtenerUsuarioId(token);

        // Assert
        Assert.Equal(0, resultado);
    }

    private string GenerarTokenValido()
    {
        var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(SecretValido));
        var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
            key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            claims: new[] { new System.Security.Claims.Claim("id", "1") },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerarTokenSinId()
    {
        var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(SecretValido));
        var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
            key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    }

    [Fact]
    public void Constructor_DebeLanzarExcepcion_CuandoSecretEsNull()
    {
        // Arrange
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
            { "Jwt:Secret", null }
            })
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new TokenHelper(configuration));
    }
}