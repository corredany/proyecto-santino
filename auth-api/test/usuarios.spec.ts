import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { prisma } from '../src/infrastructure/database/prisma';
import { CrearUsuarioUseCase } from '../src/application/logic/usuarios/crear-usuario.usecase';
import { ActualizarUsuarioUseCase } from '../src/application/logic/usuarios/actualizar-usuario.usecase';
import { EliminarUsuarioUseCase } from '../src/application/logic/usuarios/eliminar-usuario.usecase';
import { ObtenerUsuariosUseCase } from '../src/application/logic/usuarios/obtener-usuarios.usecase';

jest.mock('../src/infrastructure/database/prisma', () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    tokenRefresco: {
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockPrisma = prisma as any;
const mockU = mockPrisma.usuario;
const mockTR = mockPrisma.tokenRefresco;

const USUARIO_DB = {
  id: 1,
  nombre: 'Admin',
  email: 'admin@test.com',
  contrasena: 'hash_encriptado',
  rolId: 1,
};

const USUARIO_SELECT = {
  id: 1,
  nombre: 'Admin',
  email: 'admin@test.com',
  rolId: 1,
  rol: { id: 1, nombre: 'admin' },
  creadoEn: new Date(),
  actualizadoEn: new Date(),
};

// ─────────────────────────────────────────────────────────────────────────────
describe('CrearUsuarioUseCase', () => {
  let useCase: CrearUsuarioUseCase;

  beforeEach(() => {
    useCase = new CrearUsuarioUseCase();
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash_encriptado');
  });

  describe('cuando el email ya existe', () => {
    beforeEach(() => {
      mockU.findUnique.mockResolvedValue(USUARIO_DB);
    });

    it('debe lanzar ConflictException', async () => {
      await expect(
        useCase.execute({ nombre: 'Test', email: 'admin@test.com', contrasena: '123456', rolId: 1 }),
      ).rejects.toThrow(ConflictException);
    });

    it('debe NO encriptar la contraseña', async () => {
      await expect(
        useCase.execute({ nombre: 'Test', email: 'admin@test.com', contrasena: '123456', rolId: 1 }),
      ).rejects.toThrow();

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('cuando el email es nuevo', () => {
    beforeEach(() => {
      mockU.findUnique.mockResolvedValue(null);
      mockU.create.mockResolvedValue(USUARIO_SELECT);
    });

    it('debe retornar el usuario creado', async () => {
      const resultado = await useCase.execute({
        nombre: 'Admin',
        email: 'admin@test.com',
        contrasena: '123456',
        rolId: 1,
      });
      expect(resultado).toEqual(USUARIO_SELECT);
    });

    it('debe llamar a bcrypt.hash con la contraseña y salt 10', async () => {
      await useCase.execute({
        nombre: 'Admin',
        email: 'admin@test.com',
        contrasena: '123456',
        rolId: 1,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('debe guardar la contraseña encriptada en BD', async () => {
      await useCase.execute({
        nombre: 'Admin',
        email: 'admin@test.com',
        contrasena: '123456',
        rolId: 1,
      });
      expect(mockU.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ contrasena: 'hash_encriptado' }),
        }),
      );
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('ActualizarUsuarioUseCase', () => {
  let useCase: ActualizarUsuarioUseCase;

  beforeEach(() => {
    useCase = new ActualizarUsuarioUseCase();
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('nuevo_hash');
  });

  describe('cuando el usuario no existe', () => {
    beforeEach(() => {
      mockU.findUnique.mockResolvedValue(null);
    });

    it('debe lanzar NotFoundException', async () => {
      await expect(useCase.execute(999, { nombre: 'Nuevo' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('cuando el email nuevo ya está en uso', () => {
    beforeEach(() => {
      mockU.findUnique
        .mockResolvedValueOnce(USUARIO_DB)
        .mockResolvedValueOnce({ id: 2, email: 'otro@test.com' });
    });

    it('debe lanzar ConflictException', async () => {
      await expect(
        useCase.execute(1, { email: 'otro@test.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('cuando los datos son válidos', () => {
    beforeEach(() => {
      mockU.findUnique.mockResolvedValue(USUARIO_DB);
      mockU.update.mockResolvedValue(USUARIO_SELECT);
    });

    it('debe retornar el usuario actualizado', async () => {
      const resultado = await useCase.execute(1, { nombre: 'Nuevo Nombre' });
      expect(resultado).toEqual(USUARIO_SELECT);
    });

    it('debe encriptar la contraseña si se proporciona una nueva', async () => {
      await useCase.execute(1, { contrasena: 'nueva123' });
      expect(bcrypt.hash).toHaveBeenCalledWith('nueva123', 10);
    });

    it('debe NO encriptar si no se proporciona contraseña', async () => {
      await useCase.execute(1, { nombre: 'Nuevo Nombre' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('EliminarUsuarioUseCase', () => {
  let useCase: EliminarUsuarioUseCase;

  beforeEach(() => {
    useCase = new EliminarUsuarioUseCase();
    jest.clearAllMocks();
  });

  describe('cuando el usuario no existe', () => {
    beforeEach(() => {
      mockU.findUnique.mockResolvedValue(null);
    });

    it('debe lanzar NotFoundException', async () => {
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cuando el usuario existe', () => {
    beforeEach(() => {
      mockU.findUnique.mockResolvedValue(USUARIO_DB);
      mockTR.deleteMany.mockResolvedValue({ count: 0 });
      mockU.delete.mockResolvedValue(USUARIO_DB);
    });

    it('debe eliminar los tokens y luego el usuario', async () => {
      await useCase.execute(1);
      expect(mockTR.deleteMany).toHaveBeenCalledWith({ where: { usuarioId: 1 } });
      expect(mockU.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe eliminar los tokens ANTES que el usuario', async () => {
      const callOrder: string[] = [];
      mockTR.deleteMany.mockImplementation(async () => {
        callOrder.push('deleteMany');
        return { count: 0 };
      });
      mockU.delete.mockImplementation(async () => {
        callOrder.push('delete');
        return USUARIO_DB;
      });

      await useCase.execute(1);
      expect(callOrder).toEqual(['deleteMany', 'delete']);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('ObtenerUsuariosUseCase', () => {
  let useCase: ObtenerUsuariosUseCase;

  beforeEach(() => {
    useCase = new ObtenerUsuariosUseCase();
    jest.clearAllMocks();
    mockU.findMany.mockResolvedValue([USUARIO_SELECT]);
  });

  it('debe retornar la lista de usuarios', async () => {
    const resultado = await useCase.execute();
    expect(resultado).toEqual([USUARIO_SELECT]);
  });

  it('debe ordenar los usuarios por id ascendente', async () => {
    await useCase.execute();
    expect(mockU.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { id: 'asc' },
      }),
    );
  });

  it('debe no incluir contrasena en el select', async () => {
    await useCase.execute();
    const callArg = mockU.findMany.mock.calls[0][0];
    expect(callArg.select).not.toHaveProperty('contrasena');
  });
});
