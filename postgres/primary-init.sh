#!/bin/bash
set -e

# Crea el usuario de replicación
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER replicator REPLICATION LOGIN PASSWORD '$REPL_PASSWORD';
EOSQL

# Permite conexiones de replicación desde cualquier host
echo "host replication replicator all md5" >> "$PGDATA/pg_hba.conf"

echo "Usuario replicator y pg_hba.conf configurados."
