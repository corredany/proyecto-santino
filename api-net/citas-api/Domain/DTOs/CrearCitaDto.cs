namespace CitasApi.Domain.DTOs;

using System.ComponentModel.DataAnnotations;

public class CrearCitaDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "ClienteId debe ser un ID válido")]
    public int ClienteId { get; set; }

    [Required]
    public DateTime Fecha { get; set; }

    [MaxLength(500)]
    public string? Descripcion { get; set; }
}
