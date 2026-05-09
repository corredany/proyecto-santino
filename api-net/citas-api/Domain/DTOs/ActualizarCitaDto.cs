namespace CitasApi.Domain.DTOs;

using System.ComponentModel.DataAnnotations;

public class ActualizarCitaDto
{
    public DateTime? Fecha { get; set; }
    public TimeSpan? Hora { get; set; }

    [MaxLength(20)]
    public string? Estado { get; set; }

    [MaxLength(500)]
    public string? Notas { get; set; }

    [MaxLength(100)]
    public string? AtendidoPor { get; set; }
}