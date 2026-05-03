/*
  Warnings:

  - You are about to drop the column `publicId` on the `Imagen` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Patrocinador` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `TokenRefresco` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rutaArchivo` to the `Imagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rutaArchivo` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rutaArchivo` to the `Patrocinador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rutaArchivo` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TokenRefresco" DROP CONSTRAINT "TokenRefresco_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Imagen" DROP COLUMN "publicId",
ADD COLUMN     "rutaArchivo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "publicId",
ADD COLUMN     "rutaArchivo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patrocinador" DROP COLUMN "publicId",
ADD COLUMN     "rutaArchivo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "publicId",
ADD COLUMN     "rutaArchivo" TEXT NOT NULL;

-- DropTable
DROP TABLE "TokenRefresco";
