namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class ObtenerClientesUseCaseTests
{
    private readonly Mock<IClienteRepository> _clienteRepositoryMock;
    private readonly ObtenerClientesUseCase _useCase;

    public ObtenerClientesUseCaseTests()
    {
        _clienteRepositoryMock = new Mock<IClienteRepository>();
        _useCase = new ObtenerClientesUseCase(_clienteRepositoryMock.Object);
    }

    private Cliente CrearClienteMock(int id = 1) => new Cliente
    {
        Id = id,
        Nombre = "Juan Pérez",
        Email = "juan@test.com",
        Telefono = "6181234567",
        CreadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task Execute_DebeRetornarListaVacia_CuandoNoHayClientes()
    {
        // Arrange
        _clienteRepositoryMock.Setup(r => r.ObtenerTodos())
            .ReturnsAsync(new List<Cliente>());

        // Act
        var resultado = await _useCase.Execute();

        // Assert
        Assert.Empty(resultado);
    }

    [Fact]
    public async Task Execute_DebeRetornarTodosLosClientes_CuandoExistenClientes()
    {
        // Arrange
        var clientes = new List<Cliente> { CrearClienteMock(1), CrearClienteMock(2) };
        _clienteRepositoryMock.Setup(r => r.ObtenerTodos())
            .ReturnsAsync(clientes);

        // Act
        var resultado = await _useCase.Execute();

        // Assert
        Assert.Equal(2, resultado.Count());
    }

    [Fact]
    public async Task Execute_DebeLlamarObtenerTodos_UnaVez()
    {
        // Arrange
        _clienteRepositoryMock.Setup(r => r.ObtenerTodos())
            .ReturnsAsync(new List<Cliente>());

        // Act
        await _useCase.Execute();

        // Assert
        _clienteRepositoryMock.Verify(r => r.ObtenerTodos(), Times.Once);
    }
}