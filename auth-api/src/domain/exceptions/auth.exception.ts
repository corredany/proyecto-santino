export class CredencialesInvalidasException extends Error {
  constructor() {
    super('Credenciales inválidas');
    this.name = 'CredencialesInvalidasException';
  }
}

export class TokenInvalidoException extends Error {
  constructor() {
    super('Token inválido o expirado');
    this.name = 'TokenInvalidoException';
  }
}

export class TokenRevocadoException extends Error {
  constructor() {
    super('El token ha sido revocado');
    this.name = 'TokenRevocadoException';
  }
}

export class UsuarioNoEncontradoException extends Error {
  constructor() {
    super('Usuario no encontrado');
    this.name = 'UsuarioNoEncontradoException';
  }
}