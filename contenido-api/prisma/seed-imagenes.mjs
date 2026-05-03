import { PrismaClient } from '@prisma/client';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const SRC    = join(__dirname, '../../front/santino-web/public/img');
const DEST_IMG  = join(__dirname, '../uploads/imagenes');
const DEST_PAT  = join(__dirname, '../uploads/patrocinadores');

if (!existsSync(DEST_IMG))  mkdirSync(DEST_IMG,  { recursive: true });
if (!existsSync(DEST_PAT))  mkdirSync(DEST_PAT, { recursive: true });

// ---------- Imágenes de galería ----------
const imagenes = [
  // Baños
  { file: 'banos1.jpg',      orden: 1 },
  { file: 'banos2.jpg',      orden: 2 },
  { file: 'banos3.jpg',      orden: 3 },
  { file: 'banocomp.jpg',    orden: 4 },
  // Cocinas
  { file: 'cocina1.jpg',     orden: 1 },
  { file: 'cocina2.jpeg',    orden: 2 },
  { file: 'cocina3.jpg',     orden: 3 },
  { file: 'cocinacomp.jpeg', orden: 4 },
  // Closets
  { file: 'closet1.jpg',     orden: 1 },
  { file: 'closet2.jpeg',    orden: 2 },
  { file: 'closet3.jpg',     orden: 3 },
  { file: 'closetcomp.jpg',  orden: 4 },
  // Vestidores
  { file: 'vestidor1.jpg',    orden: 1 },
  { file: 'vestidor2.jpg',    orden: 2 },
  { file: 'vestidor3.jpg',    orden: 3 },
  { file: 'vestidorcomp.jpg', orden: 4 },
  // Diseño
  { file: 'diseno1.jpeg', orden: 1 },
  { file: 'diseno2.jpeg', orden: 2 },
  { file: 'diseno3.jpeg', orden: 3 },
  // Materiales
  { file: 'granito.jpg', orden: 1 },
  { file: 'marmol.jpg',  orden: 2 },
  { file: 'madera.jpg',  orden: 3 },
  { file: 'madera2.jpg', orden: 4 },
  // Nosotros
  { file: 'nosotros1.jpg',  orden: 1 },
  { file: 'nosotros2.jpeg', orden: 2 },
  { file: 'nosotros3.jpeg', orden: 3 },
];

// ---------- Logos de marcas ----------
const patrocinadores = [
  { file: 'blum.png',    nombre: 'Blum',    url: 'https://www.blum.com' },
  { file: 'arauco.png',  nombre: 'Arauco',  url: 'https://www.arauco.cl' },
  { file: 'hafele.jpg',  nombre: 'Häfele',  url: 'https://www.hafele.com' },
  { file: 'krono.jpg',   nombre: 'Krono',   url: 'https://www.kronobuild.com' },
  { file: 'rehau.jpg',   nombre: 'Rehau',   url: 'https://www.rehau.com' },
  { file: 'brucco.jpg',  nombre: 'Brucco',  url: 'https://www.brucco.mx' },
  { file: 'hinge.jpg',   nombre: 'Hinge',   url: '#' },
  { file: 'promob.jpg',  nombre: 'Promob',  url: 'https://www.promob.com' },
];

async function main() {
  console.log('Copiando y registrando imágenes de galería...');
  for (const img of imagenes) {
    const srcPath  = join(SRC, img.file);
    const destPath = join(DEST_IMG, img.file);
    if (!existsSync(srcPath)) { console.warn(`  ⚠ No encontrado: ${img.file}`); continue; }

    copyFileSync(srcPath, destPath);

    const rutaArchivo = `imagenes/${img.file}`;
    const url         = `${API_URL}/uploads/${rutaArchivo}`;

    await prisma.imagen.upsert({
      where:  { url },
      update: {},
      create: { url, rutaArchivo, orden: img.orden },
    });
    console.log(`  ✔ ${img.file}`);
  }

  console.log('\nCopiando y registrando logos de patrocinadores...');
  for (const pat of patrocinadores) {
    const srcPath  = join(SRC, pat.file);
    const destPath = join(DEST_PAT, pat.file);
    if (!existsSync(srcPath)) { console.warn(`  ⚠ No encontrado: ${pat.file}`); continue; }

    copyFileSync(srcPath, destPath);

    const rutaArchivo = `patrocinadores/${pat.file}`;
    const logoUrl     = `${API_URL}/uploads/${rutaArchivo}`;

    await prisma.patrocinador.upsert({
      where:  { nombre: pat.nombre },
      update: {},
      create: { nombre: pat.nombre, url: pat.url, rutaArchivo, orden: 0 },
    });
    console.log(`  ✔ ${pat.nombre}`);
  }

  console.log('\nSeed de imágenes completado.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
