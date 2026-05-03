-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT IF EXISTS "Usuario_rolId_fkey";

-- DropForeignKey
ALTER TABLE "RolPermiso" DROP CONSTRAINT IF EXISTS "RolPermiso_rolId_fkey";

-- DropForeignKey
ALTER TABLE "RolPermiso" DROP CONSTRAINT IF EXISTS "RolPermiso_permisoId_fkey";

-- DropTable
DROP TABLE IF EXISTS "RolPermiso";

-- DropTable
DROP TABLE IF EXISTS "Permiso";

-- DropTable
DROP TABLE IF EXISTS "Usuario";

-- DropTable
DROP TABLE IF EXISTS "Rol";
