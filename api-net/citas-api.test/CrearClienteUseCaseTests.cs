namespace CitasApi.Tests;

using CitasApi.Application.Logic;
using CitasApi.Domain.DTOs;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Interfaces.Repositories;
using Moq;
using Xunit;

public class CrearClienteUseCaseTests
{
    private readonly Mock<IClienteRepository> _repo;
    private readonly CrearClienteUseCase _useCase;

    public CrearClienteUseCaseTests()
    {
        _repo = new Mock<IClienteRepository>();
        _useCase = new CrearClienteUseCase(_repo.Object);
    }

    private static CrearClienteDto DtoValido() => new()
    {
        Nombre = "Ana López",
        Email = "ana@test.com",
        Telefono = "6181234567",
    };

    [Fact]
    public async Task Execute_DebeRetornarClienteExistente_CuandoEmailYaEstaRegistrado()
    {
        var existente = new Cliente { Id = 5, Nombre = "Ana López", Email = "ana@test.com", Telefono = "6181234567" };
        _repo.Setup(r => r.ObtenerPorEmail("ana@test.com")).ReturnsAsync(existente);

        var resultado = await _useCase.Execute(DtoValido());

        Assert.Equal(5, resultado.Id);
        _repo.Verify(r => r.Crear(It.IsAny<Cliente>()), Times.Never);
    }

    [Fact]
    public async Task Execute_DebeCrearCliente_CuandoEmailNoExiste()
    {
        var creado = new Cliente { Id = 1, Nombre = "Ana López", Email = "ana@test.com", Telefono = "6181234567" };
        _repo.Setup(r => r.ObtenerPorEmail("ana@test.com")).ReturnsAsync((Cliente?)null);
        _repo.Setup(r => r.Crear(It.IsAny<Cliente>())).ReturnsAsync(creado);

        var resultado = await _useCase.Execute(DtoValido());

        Assert.Equal(1, resultado.Id);
        _repo.Verify(r => r.Crear(It.IsAny<Cliente>()), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeUsarDatosDelDto_AlCrearCliente()
    {
        _repo.Setup(r => r.ObtenerPorEmail(It.IsAny<string>())).ReturnsAsync((Cliente?)null);
        _repo.Setup(r => r.Crear(It.IsAny<Cliente>())).ReturnsAsync(new Cliente());

        var dto = DtoValido();
        await _useCase.Execute(dto);

        _repo.Verify(r => r.Crear(It.Is<Cliente>(c =>
            c.Nombre == dto.Nombre &&
            c.Email == dto.Email &&
            c.Telefono == dto.Telefono
        )), Times.Once);
    }

    [Fact]
    public async Task Execute_DebeAsignarFechaCreacion_AlCrearCliente()
    {
        _repo.Setup(r => r.ObtenerPorEmail(It.IsAny<string>())).ReturnsAsync((Cliente?)null);
        _repo.Setup(r => r.Crear(It.IsAny<Cliente>())).ReturnsAsync(new Cliente());

        var antes = DateTime.UtcNow;
        await _useCase.Execute(DtoValido());
        var despues = DateTime.UtcNow;

        _repo.Verify(r => r.Crear(It.Is<Cliente>(c =>
            c.CreadoEn >= antes && c.CreadoEn <= despues
        )), Times.Once);
    }
}
