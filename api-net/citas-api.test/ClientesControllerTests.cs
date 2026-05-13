namespace CitasApi.Tests;

using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using CitasApi.Infrastructure.Database;
using CitasApi.Domain.Entities;
using System.Net;
using Xunit;

public class ClientesControllerTests : BaseIntegrationTest
{
    public ClientesControllerTests(WebApplicationFactory<Program> factory) : base(factory) { }

    private async Task<int> SeedData()
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
        return cliente.Id; // devuelve el Id generado
    }
    [Fact]
    public async Task GET_Clientes_DebeRetornar401_SinToken()
    {
        var response = await _client.GetAsync("/api/clientes");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GET_Clientes_DebeRetornar200_ConTokenValido()
    {
        await SeedData();
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.GetAsync("/api/clientes");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task GET_Clientes_PorId_DebeRetornar401_SinToken()
    {
        var response = await _client.GetAsync("/api/clientes/1");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GET_Clientes_PorId_DebeRetornar404_CuandoNoExiste()
    {
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.GetAsync("/api/clientes/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task GET_Clientes_PorId_DebeRetornar200_CuandoExiste()
    {
        var id = await SeedData();
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerarTokenValido());

        var response = await _client.GetAsync($"/api/clientes/{id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task POST_Clientes_DebeCrearClienteNuevo()
    {
        var dto = new { nombre = "Nuevo Cliente", email = "nuevo@test.com", telefono = "6189876543" };
        var content = new System.Net.Http.StringContent(
            System.Text.Json.JsonSerializer.Serialize(dto),
            System.Text.Encoding.UTF8,
            "application/json");

        var response = await _client.PostAsync("/api/clientes", content);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task POST_Clientes_DebeRetornarClienteExistente_CuandoEmailYaRegistrado()
    {
        await SeedData();

        var dto = new { nombre = "Juan Pérez", email = "juan@test.com", telefono = "6181234567" };
        var content = new System.Net.Http.StringContent(
            System.Text.Json.JsonSerializer.Serialize(dto),
            System.Text.Encoding.UTF8,
            "application/json");

        var response = await _client.PostAsync("/api/clientes", content);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}