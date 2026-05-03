export class ImagenNoEncontradaException extends Error {
  constructor(id: number) {
    super(`Imagen con id ${id} no encontrada`);
    this.name = 'ImagenNoEncontradaException';
  }
}

export class ErrorSubidaImagenException extends Error {
  constructor() {
    super('Error al subir la imagen');
    this.name = 'ErrorSubidaImagenException';
  }
}