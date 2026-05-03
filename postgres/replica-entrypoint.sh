#!/bin/bash
set -e

PGDATA=${PGDATA:-/var/lib/postgresql/data}

# Si corre como root, ajusta permisos y se re-ejecuta como usuario postgres
if [ "$(id -u)" = "0" ]; then
  mkdir -p "$PGDATA"
  chmod 700 "$PGDATA"
  chown -R postgres:postgres "$PGDATA"
  exec gosu postgres "$0" "$@"
fi

echo "Esperando al primario en $MASTER_HOST..."
until pg_isready -h "$MASTER_HOST" -U postgres -q; do
  sleep 1
done
echo "Primario listo."

# Solo corre pg_basebackup la primera vez (cuando el directorio está vacío)
if [ ! -f "$PGDATA/PG_VERSION" ]; then
  echo "Inicializando réplica con pg_basebackup..."
  PGPASSWORD="$REPL_PASSWORD" pg_basebackup \
    -h "$MASTER_HOST" \
    -U replicator \
    -D "$PGDATA" \
    -Fp -Xs -P -R
  echo "pg_basebackup completado."
fi

echo "Iniciando PostgreSQL en modo standby..."
exec postgres -c hot_standby=on
