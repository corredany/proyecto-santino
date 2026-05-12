namespace CitasApi.Domain.DTOs;

using System.ComponentModel.DataAnnotations;

public class CrearCitaDto
{
    [Required]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Telefono { get; set; } = string.Empty;

    [Required]
    public DateTime Fecha { get; set; }

    [Required]
    public TimeSpan Hora { get; set; }

    [MaxLength(500)]
    public string? Notas { get; set; }
}
