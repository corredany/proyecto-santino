export class VideoNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Video con id ${id} no encontrado`);
    this.name = 'VideoNoEncontradoException';
  }
}

export class ErrorSubidaVideoException extends Error {
  constructor() {
    super('Error al guardar el video en el servidor');
    this.name = 'ErrorSubidaVideoException';
  }
}
