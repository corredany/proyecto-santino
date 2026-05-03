import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Secciones ──────────────────────────────────────────────────────────────
const secciones = [
  { nombre: 'inicio', esFija: true, orden: 1 },
  { nombre: 'servicios', esFija: true, orden: 2 },
  { nombre: 'nosotros', esFija: true, orden: 3 },
  { nombre: 'contacto', esFija: true, orden: 4 },
];

for (const s of secciones) {
  await prisma.seccion.upsert({
    where: { nombre: s.nombre },
    update: {},
    create: s,
  });
}

console.log('Seed completado: secciones base creadas en contenido_db.');
await prisma.$disconnect();
