namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.DTOs;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Exceptions;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class ActualizarCitaUseCaseTests
{
    private readonly Mock<ICitaRepository> _citaRepositoryMock;
    private readonly ActualizarCitaUseCase _useCase;

    public ActualizarCitaUseCaseTests()
    {
        _citaRepositoryMock = new Mock<ICitaRepository>();
        _useCase = new ActualizarCitaUseCase(_citaRepositoryMock.Object);
    }

    private Cita CrearCitaMock(string estado = "pendiente") => new Cita
    {
        Id = 1,
        ClienteId = 1,
        Cliente = new Cliente { Id = 1, Nombre = "Juan", Email = "juan@test.com", Telefono = "618" },
        Fecha = DateTime.Today.AddDays(1),
        Hora = TimeSpan.FromHours(9),
        Estado = estado,
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
        await Assert.ThrowsAsync<CitaNoEncontradaException>(() =>
            _useCase.Execute(999, new ActualizarCitaDto()));
    }

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoSeIntentaConfirmarCitaYaConfirmada()
    {
        // Arrange
        var cita = CrearCitaMock("confirmada");
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cita);

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() =>
            _useCase.Execute(1, new ActualizarCitaDto { Estado = "confirmada" }));
    }

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoSeIntentaCompletarCitaPendiente()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cita);

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() =>
            _useCase.Execute(1, new ActualizarCitaDto { Estado = "completada" }));
    }

    [Fact]
    public async Task Execute_DebeActualizarCita_CuandoDatosValidos()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = CrearCitaMock("confirmada");
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>()))
            .ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Estado = "confirmada" });

        // Assert
        _citaRepositoryMock.Verify(r => r.Actualizar(It.IsAny<Cita>()), Times.Once);
        Assert.Equal("confirmada", resultado.Estado);
    }

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoSeIntentaCancelarCitaCompletada()
    {
        // Arrange
        var cita = CrearCitaMock("completada");
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cita);

        // Act & Assert
        await Assert.ThrowsAsync<CitaInvalidaException>(() =>
            _useCase.Execute(1, new ActualizarCitaDto { Estado = "cancelada" }));
    }

    [Fact]
    public async Task Execute_DebeActualizarFecha_CuandoFechaEsValida()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var nuevaFecha = DateTime.Today.AddDays(5);
        var citaActualizada = CrearCitaMock("pendiente");
        citaActualizada.Fecha = nuevaFecha;

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Fecha = nuevaFecha });

        // Assert
        _citaRepositoryMock.Verify(r => r.Actualizar(It.IsAny<Cita>()), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeActualizarHora_CuandoHoraEsValida()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var nuevaHora = TimeSpan.FromHours(10);
        var citaActualizada = CrearCitaMock("pendiente");
        citaActualizada.Hora = nuevaHora;

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Hora = nuevaHora });

        // Assert
        _citaRepositoryMock.Verify(r => r.Actualizar(It.IsAny<Cita>()), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeActualizarNotas_CuandoNotasNoEsNull()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = CrearCitaMock("pendiente");
        citaActualizada.Notas = "Nuevas notas";

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Notas = "Nuevas notas" });

        // Assert
        _citaRepositoryMock.Verify(r => r.Actualizar(It.IsAny<Cita>()), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeActualizarAtendidoPor_CuandoAtendidoPorNoEsNull()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = CrearCitaMock("pendiente");
        citaActualizada.AtendidoPor = "Admin";

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { AtendidoPor = "Admin" });

        // Assert
        _citaRepositoryMock.Verify(r => r.Actualizar(It.IsAny<Cita>()), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeCancelarCita_CuandoEstadoEsCancelada()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = CrearCitaMock("cancelada");

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Estado = "cancelada" });

        // Assert
        Assert.Equal("cancelada", resultado.Estado);
    }

    [Fact]
    public async Task Execute_DebeActualizarSoloEstado_CuandoOtrosCamposSonNull()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = CrearCitaMock("confirmada");
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto
        {
            Estado = "confirmada",
            Fecha = null,
            Hora = null,
            Notas = null,
            AtendidoPor = null
        });

        // Assert
        Assert.Equal("confirmada", resultado.Estado);
    }

    [Fact]
    public async Task Execute_DebeMapearCorrectamente_CuandoNotasYAtendidoPorSonNull()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = new Cita
        {
            Id = 1,
            ClienteId = 1,
            Cliente = new Cliente { Id = 1, Nombre = "Juan", Email = "juan@test.com", Telefono = "618" },
            Fecha = DateTime.Today.AddDays(1),
            Hora = TimeSpan.FromHours(9),
            Estado = "confirmada",
            Notas = null,
            AtendidoPor = null,
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        };

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Estado = "confirmada" });

        // Assert
        Assert.Null(resultado.Notas);
        Assert.Null(resultado.AtendidoPor);
    }
    [Fact]
    public async Task Execute_DebeMapearCorrectamente_CuandoClienteEsNull()
    {
        // Arrange
        var cita = CrearCitaMock("pendiente");
        var citaActualizada = new Cita
        {
            Id = 1,
            ClienteId = 1,
            Cliente = null,
            Fecha = DateTime.Today.AddDays(1),
            Hora = TimeSpan.FromHours(9),
            Estado = "confirmada",
            Notas = null,
            AtendidoPor = null,
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        };

        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1)).ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Actualizar(It.IsAny<Cita>())).ReturnsAsync(citaActualizada);

        // Act
        var resultado = await _useCase.Execute(1, new ActualizarCitaDto { Estado = "confirmada" });

        // Assert
        Assert.Equal(string.Empty, resultado.NombreCliente);
        Assert.Equal(string.Empty, resultado.EmailCliente);
        Assert.Equal(string.Empty, resultado.TelefonoCliente);
        Assert.Null(resultado.Notas);
        Assert.Null(resultado.AtendidoPor);
    }
}