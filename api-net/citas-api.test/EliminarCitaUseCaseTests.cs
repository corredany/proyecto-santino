namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Exceptions;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class EliminarCitaUseCaseTests
{
    private readonly Mock<ICitaRepository> _citaRepositoryMock;
    private readonly EliminarCitaUseCase _useCase;

    public EliminarCitaUseCaseTests()
    {
        _citaRepositoryMock = new Mock<ICitaRepository>();
        _useCase = new EliminarCitaUseCase(_citaRepositoryMock.Object);
    }

    private Cita CrearCitaMock() => new Cita
    {
        Id = 1,
        ClienteId = 1,
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
    public async Task Execute_DebeEliminarCita_CuandoCitaExiste()
    {
        // Arrange
        var cita = CrearCitaMock();
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cita);
        _citaRepositoryMock.Setup(r => r.Eliminar(1))
            .Returns(Task.CompletedTask);

        // Act
        await _useCase.Execute(1);

        // Assert
        _citaRepositoryMock.Verify(r => r.Eliminar(1), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeNOLlamarEliminar_CuandoCitaNoExiste()
    {
        // Arrange
        _citaRepositoryMock.Setup(r => r.ObtenerPorId(999))
            .ReturnsAsync((Cita?)null);

        // Act & Assert
        await Assert.ThrowsAsync<CitaNoEncontradaException>(() => _useCase.Execute(999));
        _citaRepositoryMock.Verify(r => r.Eliminar(It.IsAny<int>()), Times.Never);
    }
}