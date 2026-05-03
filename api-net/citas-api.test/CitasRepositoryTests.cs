namespace CitasApi.Tests;

using CitasApi.Domain.Entities;
using CitasApi.Infrastructure.Database;
using CitasApi.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class CitaRepositoryTests
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
        Id = 1,
        Nombre = "Juan Pérez",
        Email = "juan@test.com",
        Telefono = "6181234567",
        CreadoEn = DateTime.UtcNow,
    };

    private Cita CrearCitaMock(int clienteId = 1) => new Cita
    {
        ClienteId = clienteId,
        Fecha = new DateTime(2026, 3, 30),
        Hora = TimeSpan.FromHours(9),
        Estado = "pendiente",
        CreadoEn = DateTime.UtcNow,
        ActualizadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task ObtenerTodas_DebeRetornarListaVacia_CuandoNoHayCitas()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new CitaRepository(context);

        // Act
        var resultado = await repository.ObtenerTodas();

        // Assert
        Assert.Empty(resultado);
    }

    [Fact]
    public async Task ObtenerTodas_DebeRetornarCitas_CuandoExistenCitas()
    {
        // Arrange
        using var context = CrearContexto();
        context.Clientes.Add(CrearClienteMock());
        context.Citas.Add(CrearCitaMock());
        await context.SaveChangesAsync();

        var repository = new CitaRepository(context);

        // Act
        var resultado = await repository.ObtenerTodas();

        // Assert
        Assert.Single(resultado);
    }

    [Fact]
    public async Task ObtenerPorId_DebeRetornarNull_CuandoCitaNoExiste()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new CitaRepository(context);

        // Act
        var resultado = await repository.ObtenerPorId(999);

        // Assert
        Assert.Null(resultado);
    }

    [Fact]
    public async Task ObtenerPorId_DebeRetornarCita_CuandoExiste()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        var cita = CrearCitaMock();
        context.Citas.Add(cita);
        await context.SaveChangesAsync();

        var repository = new CitaRepository(context);

        // Act
        var resultado = await repository.ObtenerPorId(cita.Id);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(cita.Id, resultado.Id);
    }

    [Fact]
    public async Task ExisteEnHorario_DebeRetornarTrue_CuandoHorarioOcupado()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        var cita = CrearCitaMock();
        context.Citas.Add(cita);
        await context.SaveChangesAsync();

        var repository = new CitaRepository(context);

        // Act
        var resultado = await repository.ExisteEnHorario(cita.Fecha, cita.Hora);

        // Assert
        Assert.True(resultado);
    }

    [Fact]
    public async Task ExisteEnHorario_DebeRetornarFalse_CuandoHorarioLibre()
    {
        // Arrange
        using var context = CrearContexto();
        var repository = new CitaRepository(context);

        // Act
        var resultado = await repository.ExisteEnHorario(new DateTime(2026, 3, 30), TimeSpan.FromHours(9));

        // Assert
        Assert.False(resultado);
    }

    [Fact]
    public async Task Crear_DebeGuardarCita_Correctamente()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();

        var repository = new CitaRepository(context);
        var cita = CrearCitaMock();

        // Act
        var resultado = await repository.Crear(cita);

        // Assert
        Assert.NotNull(resultado);
        Assert.True(resultado.Id > 0);
    }

    [Fact]
    public async Task Actualizar_DebeActualizarCita_Correctamente()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        var cita = CrearCitaMock();
        context.Citas.Add(cita);
        await context.SaveChangesAsync();

        var repository = new CitaRepository(context);
        cita.Estado = "confirmada";

        // Act
        var resultado = await repository.Actualizar(cita);

        // Assert
        Assert.Equal("confirmada", resultado.Estado);
    }

    [Fact]
    public async Task Eliminar_DebeEliminarCita_Correctamente()
    {
        // Arrange
        using var context = CrearContexto();
        var cliente = CrearClienteMock();
        context.Clientes.Add(cliente);
        var cita = CrearCitaMock();
        context.Citas.Add(cita);
        await context.SaveChangesAsync();

        var repository = new CitaRepository(context);

        // Act
        await repository.Eliminar(cita.Id);

        // Assert
        var citaEliminada = await context.Citas.FindAsync(cita.Id);
        Assert.Null(citaEliminada);
    }
}