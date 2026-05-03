namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Exceptions;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class ObtenerClientePorIdUseCaseTests
{
    private readonly Mock<IClienteRepository> _clienteRepositoryMock;
    private readonly ObtenerClientePorIdUseCase _useCase;

    public ObtenerClientePorIdUseCaseTests()
    {
        _clienteRepositoryMock = new Mock<IClienteRepository>();
        _useCase = new ObtenerClientePorIdUseCase(_clienteRepositoryMock.Object);
    }

    private Cliente CrearClienteMock() => new Cliente
    {
        Id = 1,
        Nombre = "Juan Pérez",
        Email = "juan@test.com",
        Telefono = "6181234567",
        CreadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task Execute_DebeLanzarExcepcion_CuandoClienteNoExiste()
    {
        // Arrange
        _clienteRepositoryMock.Setup(r => r.ObtenerPorId(999))
            .ReturnsAsync((Cliente?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ClienteNoEncontradoException>(() => _useCase.Execute(999));
    }

    [Fact]
    public async Task Execute_DebeRetornarCliente_CuandoExiste()
    {
        // Arrange
        var cliente = CrearClienteMock();
        _clienteRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(cliente);

        // Act
        var resultado = await _useCase.Execute(1);

        // Assert
        Assert.Equal(1, resultado.Id);
        Assert.Equal("Juan Pérez", resultado.Nombre);
        Assert.Equal("juan@test.com", resultado.Email);
    }

    [Fact]
    public async Task Execute_DebeLlamarObtenerPorId_UnaVez()
    {
        // Arrange
        _clienteRepositoryMock.Setup(r => r.ObtenerPorId(1))
            .ReturnsAsync(CrearClienteMock());

        // Act
        await _useCase.Execute(1);

        // Assert
        _clienteRepositoryMock.Verify(r => r.ObtenerPorId(1), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeNOLlamarObtenerPorId_CuandoClienteNoExiste()
    {
        // Arrange
        _clienteRepositoryMock.Setup(r => r.ObtenerPorId(999))
            .ReturnsAsync((Cliente?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ClienteNoEncontradoException>(() => _useCase.Execute(999));
        _clienteRepositoryMock.Verify(r => r.ObtenerPorId(999), Times.Once);
    }
}