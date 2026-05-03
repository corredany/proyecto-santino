-- AlterTable: unique constraint on Imagen.url
CREATE UNIQUE INDEX IF NOT EXISTS "Imagen_url_key" ON "Imagen"("url");

-- AlterTable: unique constraint on Patrocinador.nombre
CREATE UNIQUE INDEX IF NOT EXISTS "Patrocinador_nombre_key" ON "Patrocinador"("nombre");
