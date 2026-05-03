namespace CitasApi.Tests;

using CitasApi.Domain.Entities;
using Xunit;

public class CitaTests
{
    private Cita CrearCitaConEstado(string estado) => new Cita
    {
        Id = 1,
        ClienteId = 1,
        Fecha = DateTime.Today.AddDays(1),
        Hora = TimeSpan.FromHours(9),
        Estado = estado,
        CreadoEn = DateTime.UtcNow,
        ActualizadoEn = DateTime.UtcNow,
    };

    [Fact]
    public void PuedeCancelarse_DebeRetornarTrue_CuandoEstadoEsPendiente()
    {
        var cita = CrearCitaConEstado("pendiente");
        Assert.True(cita.PuedeCancelarse());
    }

    [Fact]
    public void PuedeCancelarse_DebeRetornarTrue_CuandoEstadoEsConfirmada()
    {
        var cita = CrearCitaConEstado("confirmada");
        Assert.True(cita.PuedeCancelarse());
    }

    [Fact]
    public void PuedeCancelarse_DebeRetornarFalse_CuandoEstadoEsCompletada()
    {
        var cita = CrearCitaConEstado("completada");
        Assert.False(cita.PuedeCancelarse());
    }

    [Fact]
    public void PuedeConfirmarse_DebeRetornarTrue_CuandoEstadoEsPendiente()
    {
        var cita = CrearCitaConEstado("pendiente");
        Assert.True(cita.PuedeConfirmarse());
    }

    [Fact]
    public void PuedeConfirmarse_DebeRetornarFalse_CuandoEstadoEsConfirmada()
    {
        var cita = CrearCitaConEstado("confirmada");
        Assert.False(cita.PuedeConfirmarse());
    }

    [Fact]
    public void PuedeCompletarse_DebeRetornarTrue_CuandoEstadoEsConfirmada()
    {
        var cita = CrearCitaConEstado("confirmada");
        Assert.True(cita.PuedeCompletarse());
    }

    [Fact]
    public void PuedeCompletarse_DebeRetornarFalse_CuandoEstadoEsPendiente()
    {
        var cita = CrearCitaConEstado("pendiente");
        Assert.False(cita.PuedeCompletarse());
    }

    [Fact]
    public void EsHoraValida_DebeRetornarTrue_CuandoHoraEstaEnRango()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Hora = TimeSpan.FromHours(9);
        Assert.True(cita.EsHoraValida());
    }

    [Fact]
    public void EsHoraValida_DebeRetornarFalse_CuandoHoraEstaFueraDeRango()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Hora = TimeSpan.FromHours(15);
        Assert.False(cita.EsHoraValida());
    }

    [Fact]
    public void EsDiaValido_DebeRetornarFalse_CuandoEsSabado()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Fecha = new DateTime(2026, 3, 28); // Sábado
        Assert.False(cita.EsDiaValido());
    }

    [Fact]
    public void EsDiaValido_DebeRetornarFalse_CuandoEsDomingo()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Fecha = new DateTime(2026, 3, 29); // Domingo
        Assert.False(cita.EsDiaValido());
    }

    [Fact]
    public void EsDiaValido_DebeRetornarTrue_CuandoEsLunes()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Fecha = new DateTime(2026, 3, 30); // Lunes
        Assert.True(cita.EsDiaValido());
    }

    [Fact]
    public void EsFechaFutura_DebeRetornarTrue_CuandoFechaEsManana()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Fecha = DateTime.Today.AddDays(1);
        Assert.True(cita.EsFechaFutura());
    }

    [Fact]
    public void EsFechaFutura_DebeRetornarFalse_CuandoFechaEsAyer()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Fecha = DateTime.Today.AddDays(-1);
        Assert.False(cita.EsFechaFutura());
    }

    [Fact]
    public void EsHoraValida_DebeRetornarTrue_CuandoHoraEsExactamente8()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Hora = TimeSpan.FromHours(8);
        Assert.True(cita.EsHoraValida());
    }

    [Fact]
    public void EsHoraValida_DebeRetornarTrue_CuandoHoraEsExactamente13()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Hora = TimeSpan.FromHours(13);
        Assert.True(cita.EsHoraValida());
    }

    [Fact]
    public void EsFechaFutura_DebeRetornarTrue_CuandoFechaEsHoy()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Fecha = DateTime.Today;
        Assert.True(cita.EsFechaFutura());
    }

    [Fact]
    public void EsHoraValida_DebeRetornarFalse_CuandoHoraEsAntesDe8()
    {
        var cita = CrearCitaConEstado("pendiente");
        cita.Hora = TimeSpan.FromHours(7);
        Assert.False(cita.EsHoraValida());
    }
}