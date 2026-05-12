namespace CitasApi.Application.Logic;

using CitasApi.Domain.DTOs;
using CitasApi.Domain.Entities;
using CitasApi.Domain.Exceptions;
using CitasApi.Domain.Interfaces.Repositories;

public class CrearCitaUseCase
{
    private readonly ICitaRepository _citaRepository;
    private readonly IClienteRepository _clienteRepository;

    public CrearCitaUseCase(ICitaRepository citaRepository, IClienteRepository clienteRepository)
    {
        _citaRepository = citaRepository;
        _clienteRepository = clienteRepository;
    }

    public async Task<Cita> Execute(CrearCitaDto dto)
    {
        var citaTemp = new Cita { Fecha = dto.Fecha, Hora = dto.Hora };

        if (!citaTemp.EsFechaFutura() || !citaTemp.EsDiaValido())
            throw new CitaInvalidaException("La fecha no es válida");

        if (!citaTemp.EsHoraValida())
            throw new CitaInvalidaException("La hora no está dentro del horario de atención");

        if (await _citaRepository.ExisteEnHorario(dto.Fecha, dto.Hora))
            throw new CitaNoDisponibleException();

        var cliente = await _clienteRepository.ObtenerPorEmail(dto.Email)
            ?? await _clienteRepository.Crear(new Cliente
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono,
                CreadoEn = DateTime.UtcNow,
            });

        var cita = new Cita
        {
            ClienteId = cliente.Id,
            Fecha = dto.Fecha.Date,
            Hora = dto.Hora,
            Estado = "pendiente",
            Notas = dto.Notas,
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow,
        };

        return await _citaRepository.Crear(cita);
    }
}
