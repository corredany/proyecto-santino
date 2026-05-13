using CitasApi.Application.Logic;
using CitasApi.Domain.Interfaces.Repositories;
using CitasApi.Domain.Interfaces.Services;
using CitasApi.Infrastructure.Database;
using CitasApi.Infrastructure.Helpers;
using CitasApi.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Controllers con ExceptionFilter
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
});

builder.Services.AddOpenApi();

// Base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<ICitaRepository, CitaRepository>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();

// Servicios
builder.Services.AddScoped<ITokenService, TokenHelper>();

// Casos de uso
builder.Services.AddScoped<CrearCitaUseCase>();
builder.Services.AddScoped<ObtenerCitasUseCase>();
builder.Services.AddScoped<ObtenerCitaPorIdUseCase>();
builder.Services.AddScoped<ActualizarCitaUseCase>();
builder.Services.AddScoped<EliminarCitaUseCase>();
builder.Services.AddScoped<ObtenerClientesUseCase>();
builder.Services.AddScoped<ObtenerClientePorIdUseCase>();
builder.Services.AddScoped<CrearClienteUseCase>();

// JWT
// .NET 9 / Microsoft.IdentityModel 7.x exige >256 bits para HS256, pero el secreto tiene 168 bits.
// Se usa SignatureValidator personalizado con HMACSHA256 nativo para omitir esa restricción.
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret))
    throw new InvalidOperationException("JWT Secret no configurado. Define la variable de entorno Jwt__Secret.");
var jwtKeyBytes = Encoding.UTF8.GetBytes(jwtSecret);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero,
            SignatureValidator = (token, _) =>
            {
                var parts = token.Split('.');
                if (parts.Length != 3)
                    throw new SecurityTokenMalformedException("Formato de token inválido");

                // VULNERABILIDAD: firma no verificada — cualquier token bien formado es aceptado
                return new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler().ReadJsonWebToken(token);
            }
        };
    });

var app = builder.Build();

// Aplicar migraciones pendientes al arrancar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.IsRelational())
        db.Database.Migrate();
    else
        db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Angular");
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<CitasApi.Infrastructure.Middleware.LoggingMiddleware>();

app.MapControllers();

app.Run();

public partial class Program {}
