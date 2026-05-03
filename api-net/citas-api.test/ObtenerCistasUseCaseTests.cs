namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class ObtenerCitasUseCaseTests
{
    private readonly Mock<ICitaRepository> _citaRepositoryMock;
    private readonly ObtenerCitasUseCase _useCase;

    public ObtenerCitasUseCaseTests()
    {
        _citaRepositoryMock = new Mock<ICitaRepository>();
        _useCase = new ObtenerCitasUseCase(_citaRepositoryMock.Object);
    }

    private Cita CrearCitaMock(int id = 1) => new Cita
    {
        Id = id,
        ClienteId = 1,
        Cliente = new Cliente { Id = 1, Nombre = "Juan", Email = "juan@test.com", Telefono = "618" },
        Fecha = DateTime.Today.AddDays(1),
        Hora = TimeSpan.FromHours(9),
        Estado = "pendiente",
        CreadoEn = DateTime.UtcNow,
        ActualizadoEn = DateTime.UtcNow,
    };

    [Fact]
    public async Task Execute_DebeRetornarListaVacia_CuandoNoHayCitas()
    {
        // Arrange
        _citaRepositoryMock.Setup(r => r.ObtenerTodas())
            .ReturnsAsync(new List<Cita>());

        // Act
        var resultado = await _useCase.Execute();

        // Assert
        Assert.Empty(resultado);
    }

    [Fact]
    public async Task Execute_DebeRetornarTodasLasCitas_CuandoExistenCitas()
    {
        // Arrange
        var citas = new List<Cita> { CrearCitaMock(1), CrearCitaMock(2) };
        _citaRepositoryMock.Setup(r => r.ObtenerTodas())
            .ReturnsAsync(citas);

        // Act
        var resultado = await _useCase.Execute();

        // Assert
        Assert.Equal(2, resultado.Count());
    }

    [Fact]
    public async Task Execute_DebeMapearCorrectamente_DatosDelCliente()
    {
        // Arrange
        var citas = new List<Cita> { CrearCitaMock() };
        _citaRepositoryMock.Setup(r => r.ObtenerTodas())
            .ReturnsAsync(citas);

        // Act
        var resultado = await _useCase.Execute();
        var citaDto = resultado.First();

        // Assert
        Assert.Equal("Juan", citaDto.NombreCliente);
        Assert.Equal("juan@test.com", citaDto.EmailCliente);
        Assert.Equal("pendiente", citaDto.Estado);
    }

    [Fact]
    public async Task Execute_DebeLlamarObtenerTodas_UnaVez()
    {
        // Arrange
        _citaRepositoryMock.Setup(r => r.ObtenerTodas())
            .ReturnsAsync(new List<Cita>());

        // Act
        await _useCase.Execute();

        // Assert
        _citaRepositoryMock.Verify(r => r.ObtenerTodas(), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeMapearCorrectamente_CuandoClienteEsNull()
    {
        // Arrange
        var citas = new List<Cita>
    {
        new Cita
        {
            Id = 1,
            ClienteId = 1,
            Cliente = null,
            Fecha = DateTime.Today.AddDays(1),
            Hora = TimeSpan.FromHours(9),
            Estado = "pendiente",
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        }
    };
        _citaRepositoryMock.Setup(r => r.ObtenerTodas()).ReturnsAsync(citas);

        // Act
        var resultado = await _useCase.Execute();
        var citaDto = resultado.First();

        // Assert
        Assert.Equal(string.Empty, citaDto.NombreCliente);
        Assert.Equal(string.Empty, citaDto.EmailCliente);
    }
}