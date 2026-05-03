export class PatrocinadorNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Patrocinador con id ${id} no encontrado`);
    this.name = 'PatrocinadorNoEncontradoException';
  }
}

export class ErrorSubidaPatrocinadorException extends Error {
  constructor() {
    super('Error al guardar el logo del patrocinador en el servidor');
    this.name = 'ErrorSubidaPatrocinadorException';
  }
}
