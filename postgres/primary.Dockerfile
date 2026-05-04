FROM postgres:16
COPY primary-init.sh /docker-entrypoint-initdb.d/02_replication.sh
RUN sed -i 's/\r//' /docker-entrypoint-initdb.d/02_replication.sh && \
    chmod +x /docker-entrypoint-initdb.d/02_replication.sh
