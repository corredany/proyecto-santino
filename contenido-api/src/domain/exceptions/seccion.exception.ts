export class SeccionNoEncontradaException extends Error {
  constructor(id: number) {
    super(`Sección con id ${id} no encontrada`);
    this.name = 'SeccionNoEncontradaException';
  }
}

export class SeccionFijaException extends Error {
  constructor() {
    super('Esta sección no puede eliminarse porque es fija');
    this.name = 'SeccionFijaException';
  }
}