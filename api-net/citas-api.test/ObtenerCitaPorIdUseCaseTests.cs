namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Exceptions;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class ObtenerCitaPorIdUseCaseTests
{
    private readonly Mock<ICitaRepository> _citaRepositoryMock;
    private readonly ObtenerCitaPorIdUseCase _useCase;

    public ObtenerCitaPorIdUseCaseTests()
    {
        _citaRepositoryMock = new Mock<ICitaRepository>();
        _useCase = new ObtenerCitaPorIdUseCase(_citaRepositoryMock.Object);
    }

    private Cita CrearCitaMock() => new Cita
    {
        Id = 1,
        ClienteId = 1,
        Cliente = new Cliente { Id = 1, Nombre = "Juan", Email = "juan@test.com", Telefono = "618" },
        Fecha = DateTime.Today.AddDays(1),
        Hora = TimeSpan.FromHours(9),
        Estado = "pendiente",
        CreadoEn = DateTime.UtcNow,
        ActualizadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoCitaNoExiste()
    {
        // Arrange
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(999))
            .ReturnsAsync((Cita?)null);

        // Act & Assert
        await Assert.ThrowsAsync<CitaNoEncontradaException>(() => _useCase.Execute(999));
    }

    [Fact]
    public async Task Execute_DebeRetornarCita_CuandoExiste()
    {
        // Arrange
        var cita = CrearCitaMock();
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cita);

        // Act
        var resultado = await _useCase.Execute(1);

        // Assert
        Assert.Equal(1, resultado.Id);
        Assert.Equal("Juan", resultado.NombreCliente);
        Assert.Equal("pendiente", resultado.Estado);
    }

    [Fact]
    public async Task Execute_DebeNOLlamarRepositorio_CuandoIdEsInvalido()
    {
        // Arrange
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(999))
            .ReturnsAsync((Cita?)null);

        // Act & Assert
        await Assert.ThrowsAsync<CitaNoEncontradaException>(() => _useCase.Execute(999));
        _citaRepositoryMock.Verify(r => r.ObtenerPorId(999), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeMapearCorrectamente_TodosLosCampos()
    {
        // Arrange
        var cita = new Cita
        {
            Id = 1,
            ClienteId = 1,
            Cliente = new Cliente { Id = 1, Nombre = "Juan", Email = "juan@test.com", Telefono = "618" },
            Fecha = new DateTime(2026, 3, 30),
            Hora = TimeSpan.FromHours(9),
            Estado = "confirmada",
            Notas = "Me interesa una cocina",
            AtendidoPor = "Admin",
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        };

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);

        // Act
        var resultado = await _useCase.Execute(1);

        // Assert
        Assert.Equal(1, resultado.Id);
        Assert.Equal("Juan", resultado.NombreCliente);
        Assert.Equal("juan@test.com", resultado.EmailCliente);
        Assert.Equal("618", resultado.TelefonoCliente);
        Assert.Equal("confirmada", resultado.Estado);
        Assert.Equal("Me interesa una cocina", resultado.Notas);
        Assert.Equal("Admin", resultado.AtendidoPor);
    }

    [Fact]
    public async Task Execute_DebeMapearCorrectamente_CuandoClienteEsNull()
    {
        // Arrange
        var cita = new Cita
        {
            Id = 1,
            ClienteId = 1,
            Cliente = null,
            Fecha = new DateTime(2026, 3, 30),
            Hora = TimeSpan.FromHours(9),
            Estado = "pendiente",
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        };

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);

        // Act
        var resultado = await _useCase.Execute(1);

        // Assert
        Assert.Equal(string.Empty, resultado.NombreCliente);
        Assert.Equal(string.Empty, resultado.EmailCliente);
        Assert.Equal(string.Empty, resultado.TelefonoCliente);
    }
}