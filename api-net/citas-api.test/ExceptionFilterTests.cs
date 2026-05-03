namespace CitasApi.Tests;

using CitasApi.Domain.Exceptions;
using CitasApi.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Moq;
using Xunit;

public class ExceptionFilterTests
{
    private ExceptionContext CrearExceptionContext(Exception exception)
    {
        var actionContext = new ActionContext(
            new DefaultHttpContext(),
            new RouteData(),
            new ActionDescriptor()
        );

        return new ExceptionContext(actionContext, new List<IFilterMetadata>())
        {
            Exception = exception
        };
    }

    [Fact]
    public void OnException_DebeRetornar404_CuandoCitaNoEncontrada()
    {
        // Arrange
        var filter = new ExceptionFilter();
        var context = CrearExceptionContext(new CitaNoEncontradaException(1));

        // Act
        filter.OnException(context);

        // Assert
        var result = Assert.IsType<NotFoundObjectResult>(context.Result);
        Assert.True(context.ExceptionHandled);
    }

    [Fact]
    public void OnException_DebeRetornar404_CuandoClienteNoEncontrado()
    {
        // Arrange
        var filter = new ExceptionFilter();
        var context = CrearExceptionContext(new ClienteNoEncontradoException(1));

        // Act
        filter.OnException(context);

        // Assert
        Assert.IsType<NotFoundObjectResult>(context.Result);
        Assert.True(context.ExceptionHandled);
    }

    [Fact]
    public void OnException_DebeRetornar400_CuandoCitaInvalida()
    {
        // Arrange
        var filter = new ExceptionFilter();
        var context = CrearExceptionContext(new CitaInvalidaException("Error de validación"));

        // Act
        filter.OnException(context);

        // Assert
        Assert.IsType<BadRequestObjectResult>(context.Result);
        Assert.True(context.ExceptionHandled);
    }

    [Fact]
    public void OnException_DebeRetornar400_CuandoCitaNoDisponible()
    {
        // Arrange
        var filter = new ExceptionFilter();
        var context = CrearExceptionContext(new CitaNoDisponibleException());

        // Act
        filter.OnException(context);

        // Assert
        Assert.IsType<BadRequestObjectResult>(context.Result);
        Assert.True(context.ExceptionHandled);
    }

    [Fact]
    public void OnException_DebeRetornar500_CuandoExcepcionDesconocida()
    {
        // Arrange
        var filter = new ExceptionFilter();
        var context = CrearExceptionContext(new Exception("Error desconocido"));

        // Act
        filter.OnException(context);

        // Assert
        var result = Assert.IsType<ObjectResult>(context.Result);
        Assert.Equal(500, result.StatusCode);
        Assert.True(context.ExceptionHandled);
    }
}