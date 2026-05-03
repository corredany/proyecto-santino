import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const secciones = [
  {
    nombre: 'Cocinas',
    descripcionPrincipal: 'Diseñamos cocinas personalizadas que organizan tu espacio y reflejan tu estilo, con la calidad que mereces.',
    descripcionSeccion: null,
    esFija: true,
    visible: true,
    orden: 1,
    imagenes: ['cocina1.jpg', 'cocina2.jpeg', 'cocina3.jpg', 'cocinacomp.jpeg'],
  },
  {
    nombre: 'Closets',
    descripcionPrincipal: 'Diseñamos muebles que transforman tus espacios en lugares únicos.',
    descripcionSeccion: 'Creamos muebles personalizados que combinan funcionalidad, durabilidad y diseño exclusivo.',
    esFija: true,
    visible: true,
    orden: 2,
    imagenes: ['closet1.jpg', 'closet2.jpeg', 'closet3.jpg', 'closetcomp.jpg'],
  },
  {
    nombre: 'Muebles de baño',
    descripcionPrincipal: 'Muebles de baño que combinan diseño, funcionalidad y calidad, creados para transformar tu espacio.',
    descripcionSeccion: null,
    esFija: true,
    visible: true,
    orden: 3,
    imagenes: ['banos1.jpg', 'banos2.jpg', 'banos3.jpg', 'banocomp.jpg'],
  },
  {
    nombre: 'Vestidores',
    descripcionPrincipal: 'Vestidores únicos, hechos para tu estilo de vida y pensados con compromiso en cada detalle.',
    descripcionSeccion: null,
    esFija: true,
    visible: true,
    orden: 4,
    imagenes: ['vestidor1.jpg', 'vestidor2.jpg', 'vestidor3.jpg', 'vestidorcomp.jpg'],
  },
  {
    nombre: 'Diseño de interiores',
    descripcionPrincipal: 'Transformamos tus espacios con equilibrio entre estética y funcionalidad, creando ambientes únicos que se adaptan a tu estilo de vida.',
    descripcionSeccion: null,
    esFija: true,
    visible: true,
    orden: 5,
    imagenes: ['diseno1.jpeg', 'diseno2.jpeg', 'diseno3.jpeg'],
  },
];

async function main() {
  const API_URL = process.env.API_URL ?? 'http://localhost:3000';

  for (const s of secciones) {
    // Crear o recuperar la sección
    let seccion = await prisma.seccion.findFirst({ where: { nombre: s.nombre } });
    if (!seccion) {
      seccion = await prisma.seccion.create({
        data: {
          nombre: s.nombre,
          descripcionPrincipal: s.descripcionPrincipal,
          descripcionSeccion: s.descripcionSeccion,
          esFija: s.esFija,
          visible: s.visible,
          orden: s.orden,
        },
      });
    } else {
      await prisma.seccion.update({
        where: { id: seccion.id },
        data: {
          descripcionPrincipal: s.descripcionPrincipal,
          descripcionSeccion: s.descripcionSeccion,
          esFija: s.esFija,
          visible: s.visible,
          orden: s.orden,
        },
      });
    }

    // Asignar imágenes a la sección
    for (let i = 0; i < s.imagenes.length; i++) {
      const filename = s.imagenes[i];
      const url = `${API_URL}/uploads/imagenes/${filename}`;
      const updated = await prisma.imagen.updateMany({
        where: { url },
        data: { seccionId: seccion.id, orden: i + 1 },
      });
      if (updated.count > 0) {
        console.log(`  ✔ ${s.nombre} ← ${filename}`);
      } else {
        console.warn(`  ⚠ No encontrada en BD: ${filename}`);
      }
    }

    console.log(`✅ Sección "${s.nombre}" (id=${seccion.id}) lista.`);
  }

  console.log('\nSeed de secciones completado.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
