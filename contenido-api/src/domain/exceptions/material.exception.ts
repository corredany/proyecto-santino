export class MaterialNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Material con id ${id} no encontrado`);
    this.name = 'MaterialNoEncontradoException';
  }
}

export class ErrorSubidaMaterialException extends Error {
  constructor() {
    super('Error al guardar el material en el servidor');
    this.name = 'ErrorSubidaMaterialException';
  }
}
