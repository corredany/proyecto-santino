namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.DTOs;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Exceptions;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class CrearCitaUseCaseTests
{
    private readonly Mock<ICitaRepository> _citaRepositoryMock;
    private readonly Mock<IClienteRepository> _clienteRepositoryMock;
    private readonly CrearCitaUseCase _useCase;

    // Constantes
    private readonly DateTime FechaValida = new DateTime(2026, 6, 1); // Lunes
    private readonly TimeSpan HoraValida = TimeSpan.FromHours(9);
    private const string NombreValido = "Juan Pérez";
    private const string EmailValido = "juan@test.com";
    private const string TelefonoValido = "6181234567";

    public CrearCitaUseCaseTests()
    {
        _citaRepositoryMock = new Mock<ICitaRepository>();
        _clienteRepositoryMock = new Mock<IClienteRepository>();
        _useCase = new CrearCitaUseCase(_citaRepositoryMock.Object, _clienteRepositoryMock.Object);
    }

    private CrearCitaDto CrearDtoValido(DateTime? fecha = null, TimeSpan? hora = null) => new CrearCitaDto
    {
        Nombre = NombreValido,
        Email = EmailValido,
        Telefono = TelefonoValido,
        Fecha = fecha ?? FechaValida,
        Hora = hora ?? HoraValida,
        Notas = "Me interesa una cocina",
    };

    private Cliente CrearClienteMock() => new Cliente
    {
        Id = 1,
        Nombre = NombreValido,
        Email = EmailValido,
        Telefono = TelefonoValido,
        CreadoEn = DateTime.UtcNow,
    };

    private Cita CrearCitaMock() => new Cita
    {
        Id = 1,
        ClienteId = 1,
        Fecha = FechaValida,
        Hora = HoraValida,
        Estado = "pendiente",
        CreadoEn = DateTime.UtcNow,
        ActualizadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoFechaEsPasada()
    {
        // Arrange
        var dto = CrearDtoValido(fecha: DateTime.Today.AddDays(-1));

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() => _useCase.Execute(dto));
    }

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoEsFinDeSemana()
    {
        // Arrange
        var dto = CrearDtoValido(fecha: new DateTime(2026, 6, 6)); // Sábado

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() => _useCase.Execute(dto));
    }

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoHoraEstaFueraDeRango()
    {
        // Arrange
        var dto = CrearDtoValido(hora: TimeSpan.FromHours(15));

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() => _useCase.Execute(dto));
    }

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoHorarioEstaOcupado()
    {
        // Arrange
        var dto = CrearDtoValido();
        _citaRepositoryMock.Setup(r => r.ExisteEnHorario(FechaValida, HoraValida))
            .ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<CitaNoDisponibleException>(() => _useCase.Execute(dto));
    }

    [Fact]
    public async Task Execute_DebeCrearClienteNuevo_CuandoClienteNoExiste()
    {
        // Arrange
        var dto = CrearDtoValido();
        var clienteNuevo = CrearClienteMock();
        var citaNueva = CrearCitaMock();

        _citaRepositoryMock.Setup(r => r.ExisteEnHorario(FechaValida, HoraValida))
            .ReturnsAsync(false);
        _clienteRepositoryMock.Setup(r => r.ObtenerPorEmail(EmailValido))
            .ReturnsAsync((Cliente?)null);
        _clienteRepositoryMock.Setup(r => r.Crear(It.IsAny<Cliente>()))
            .ReturnsAsync(clienteNuevo);
        _citaRepositoryMock.Setup(r => r.Crear(It.IsAny<Cita>()))
            .ReturnsAsync(citaNueva);

        // Act
        var resultado = await _useCase.Execute(dto);

        // Assert
        _clienteRepositoryMock.Verify(r => r.Crear(It.IsAny<Cliente>()), Times.Once);
        Assert.Equal("pendiente", resultado.Estado);
    }

    [Fact]
    public async Task Execute_DebeUsarClienteExistente_CuandoClienteYaExiste()
    {
        // Arrange
        var dto = CrearDtoValido();
        var clienteExistente = CrearClienteMock();
        var citaNueva = CrearCitaMock();

        _citaRepositoryMock.Setup(r => r.ExisteEnHorario(FechaValida, HoraValida))
            .ReturnsAsync(false);
        _clienteRepositoryMock.Setup(r => r.ObtenerPorEmail(EmailValido))
            .ReturnsAsync(clienteExistente);
        _citaRepositoryMock.Setup(r => r.Crear(It.IsAny<Cita>()))
            .ReturnsAsync(citaNueva);

        // Act
        var resultado = await _useCase.Execute(dto);

        // Assert
        _clienteRepositoryMock.Verify(r => r.Crear(It.IsAny<Cliente>()), Times.Never);
        Assert.Equal("pendiente", resultado.Estado);
    }

    [Fact]
    public async Task Execute_DebeNOVerificarHorario_CuandoFechaEsInvalida()
    {
        // Arrange
        var dto = CrearDtoValido(fecha: DateTime.Today.AddDays(-1));

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() => _useCase.Execute(dto));
        _citaRepositoryMock.Verify(r => r.ExisteEnHorario(It.IsAny<DateTime>(), It.IsAny<TimeSpan>()), Times.Never);
    }
}