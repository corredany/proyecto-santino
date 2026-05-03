import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ── Roles ──────────────────────────────────────────────────────────────────
const rolAdmin = await prisma.rol.upsert({
  where: { nombre: 'admin' },
  update: {},
  create: { nombre: 'admin' },
});

const rolEditor = await prisma.rol.upsert({
  where: { nombre: 'editor' },
  update: {},
  create: { nombre: 'editor' },
});

await prisma.rol.upsert({
  where: { nombre: 'recepcionista' },
  update: {},
  create: { nombre: 'recepcionista' },
});

// ── Permisos ───────────────────────────────────────────────────────────────
const permContenido = await prisma.permiso.upsert({
  where: { nombre: 'contenido:gestionar' },
  update: {},
  create: { nombre: 'contenido:gestionar' },
});

const permUsuarios = await prisma.permiso.upsert({
  where: { nombre: 'usuarios:gestionar' },
  update: {},
  create: { nombre: 'usuarios:gestionar' },
});

// ── Asignación rol → permisos ──────────────────────────────────────────────
// admin: contenido + usuarios
await prisma.rolPermiso.upsert({
  where: { rolId_permisoId: { rolId: rolAdmin.id, permisoId: permContenido.id } },
  update: {},
  create: { rolId: rolAdmin.id, permisoId: permContenido.id },
});

await prisma.rolPermiso.upsert({
  where: { rolId_permisoId: { rolId: rolAdmin.id, permisoId: permUsuarios.id } },
  update: {},
  create: { rolId: rolAdmin.id, permisoId: permUsuarios.id },
});

// editor: solo contenido
await prisma.rolPermiso.upsert({
  where: { rolId_permisoId: { rolId: rolEditor.id, permisoId: permContenido.id } },
  update: {},
  create: { rolId: rolEditor.id, permisoId: permContenido.id },
});

// ── Usuario admin ──────────────────────────────────────────────────────────
const hash = await bcrypt.hash('admin123', 10);

await prisma.usuario.upsert({
  where: { email: 'admin@santino.com' },
  update: {},
  create: {
    nombre: 'Administrador',
    email: 'admin@santino.com',
    contrasena: hash,
    rolId: rolAdmin.id,
  },
});

console.log('Seed completado: roles, permisos y usuario admin listos en auth_db.');
await prisma.$disconnect();
