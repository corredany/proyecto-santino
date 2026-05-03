namespace CitasApi.Tests;

using CitasApi.Domain.Entities;
using CitasApi.Infrastructure.Database;
using CitasApi.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class ClienteRepositoryTests
{
    private AppDbContext CrearContexto()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private Cliente CrearClienteMock() => new Cliente
    {
        Nombre = "Juan Pérez",
        Email = "juan@test.com",
        Telefono = "6181234567",
        CreadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task ObtenerTodos_DebeRetornarListaVacia_CuandoNoHayClientes()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new ClienteRepository(context);

        // Act
        var resultado = await repository.ObtenerTodos();

        // Assert
        Assert.Empty(resultado);
    }

    [Fact]
    public async Task ObtenerTodos_DebeRetornarClientes_CuandoExistenClientes()
    {
        // Arrange
        using var context = CrearContexto();
        context.Clientes.Add(CrearClienteMock());
        await context.SaveChangesAsync();

        var repository = new ClienteRepository(context);

        // Act
        var resultado = await repository.ObtenerTodos();

        // Assert
        Assert.Single(resultado);
    }

    [Fact]
    public async Task ObtenerPorId_DebeRetornarNull_CuandoClienteNoExiste()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new ClienteRepository(context);

        // Act
        var resultado = await repository.ObtenerPorId(999);

        // Assert
        Assert.Null(resultado);
    }

    [Fact]
    public async Task ObtenerPorId_DebeRetornarCliente_CuandoExiste()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();

        var repository = new ClienteRepository(context);

        // Act
        var resultado = await repository.ObtenerPorId(cliente.Id);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(cliente.Id, resultado.Id);
    }

    [Fact]
    public async Task ObtenerPorEmail_DebeRetornarNull_CuandoClienteNoExiste()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new ClienteRepository(context);

        // Act
        var resultado = await repository.ObtenerPorEmail("noexiste@test.com");

        // Assert
        Assert.Null(resultado);
    }

    [Fact]
    public async Task ObtenerPorEmail_DebeRetornarCliente_CuandoExiste()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();

        var repository = new ClienteRepository(context);

        // Act
        var resultado = await repository.ObtenerPorEmail("juan@test.com");

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal("juan@test.com", resultado.Email);
    }

    [Fact]
    public async Task Crear_DebeGuardarCliente_Correctamente()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new ClienteRepository(context);
        var cliente = CrearClienteMock();

        // Act
        var resultado = await repository.Crear(cliente);

        // Assert
        Assert.NotNull(resultado);
        Assert.True(resultado.Id > 0);
        Assert.Equal("juan@test.com", resultado.Email);
    }
}