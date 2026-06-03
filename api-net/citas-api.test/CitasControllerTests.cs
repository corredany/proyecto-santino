namespace CitasApi.Tests;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using CitasApi.Infrastructure.Database;
using CitasApi.Domain.Entities;
using CitasApi.Domain.DTOs;
using System.Net;
using System.Net.Http.Json;
using Xunit;

public class CitasControllerTests : BaseIntegrationTest
{
    public CitasControllerTests(WebApplicationFactory<Program> factory) : base(factory) { }

    private async Task SeedData()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var cliente = new Cliente
        {
            Nombre = "Juan Pérez",
            Email = "juan@test.com",
            Telefono = "6181234567",
            CreadoEn = DateTime.UtcNow,
        };
        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();

        context.Citas.Add(new Cita
        {
            ClienteId = cliente.Id,
            Fecha = new DateTime(2026, 6, 1),
            Hora = TimeSpan.FromHours(9),
            Estado = "pendiente",
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        });

        await context.SaveChangesAsync();
    }
    private Task<int> ObtenerPrimerCitaId()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var cita = context.Citas.First();
        return Task.FromResult(cita.Id);
    }

    private static DateTime GetProximoDiaHabil()
    {
        var fecha = DateTime.Today.AddDays(1);
        while (fecha.DayOfWeek == DayOfWeek.Saturday || fecha.DayOfWeek == DayOfWeek.Sunday)
            fecha = fecha.AddDays(1);
        return fecha;
    }

    [Fact]
    public async Task POST_Citas_DebeRetornar201_CuandoDatosValidos()
    {
        var dto = new CrearCitaDto
        {
            Nombre = "Ana García",
            Email = "ana@test.com",
            Telefono = "6189876543",
            Fecha = GetProximoDiaHabil(),
            Hora = TimeSpan.FromHours(10),
            Notas = "Me interesa un closet",
        };

        var response = await _client.PostAsJsonAsync("/api/citas", dto);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task POST_Citas_DebeRetornar400_CuandoFechaEsFinDeSemana()
    {
        var dto = new CrearCitaDto
        {
            Nombre = "Ana García",
            Email = "ana@test.com",
            Telefono = "6189876543",
            Fecha = new DateTime(2026, 6, 6),
            Hora = TimeSpan.FromHours(9),
        };

        var response = await _client.PostAsJsonAsync("/api/citas", dto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task POST_Citas_DebeRetornar400_CuandoHoraFueraDeRango()
    {
        var dto = new CrearCitaDto
        {
            Nombre = "Ana García",
            Email = "ana@test.com",
            Telefono = "6189876543",
            Fecha = new DateTime(2026, 6, 1),
            Hora = TimeSpan.FromHours(15),
        };

        var response = await _client.PostAsJsonAsync("/api/citas", dto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GET_Citas_DebeRetornar401_SinToken()
    {
        var response = await _client.GetAsync("/api/citas");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GET_Citas_DebeRetornar401_ConTokenInvalido()
    {
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "token_invalido");

        var response = await _client.GetAsync("/api/citas");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task GET_Citas_DebeRetornar200_ConTokenValido()
    {
        await SeedData();
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.GetAsync("/api/citas");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task GET_Citas_PorId_DebeRetornar404_CuandoNoExiste()
    {
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.GetAsync("/api/citas/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task GET_Citas_PorId_DebeRetornar200_CuandoExiste()
    {
        await SeedData();
        var id = await ObtenerPrimerCitaId();
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.GetAsync($"/api/citas/{id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task PUT_Citas_DebeRetornar200_CuandoDatosValidos()
    {
        await SeedData();
        var id = await ObtenerPrimerCitaId();
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var dto = new ActualizarCitaDto { Estado = "confirmada" };
        var response = await _client.PutAsJsonAsync($"/api/citas/{id}", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task PUT_Citas_DebeRetornar404_CuandoCitaNoExiste()
    {
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var dto = new ActualizarCitaDto { Estado = "confirmada" };
        var response = await _client.PutAsJsonAsync("/api/citas/999", dto);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task DELETE_Citas_DebeRetornar200_CuandoCitaExiste()
    {
        await SeedData();
        var id = await ObtenerPrimerCitaId();
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.DeleteAsync($"/api/citas/{id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task DELETE_Citas_DebeRetornar404_CuandoCitaNoExiste()
    {
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.DeleteAsync("/api/citas/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }
}