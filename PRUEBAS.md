# Comandos para ejecutar pruebas

## auth-api (NestJS)

```bash
cd auth-api
```

### Pruebas unitarias con cobertura
```bash
npm run test:unit
```

### Pruebas de integración
```bash
npm run test:int
```

> Las pruebas de integración requieren que la base de datos esté corriendo (Docker).

---

## contenido-api (NestJS)

```bash
cd contenido-api
```

### Pruebas unitarias con cobertura
```bash
npm run test:unit
```

### Pruebas de integración
```bash
npm run test:int
```

> Las pruebas de integración requieren que la base de datos esté corriendo (Docker).

---

## citas-api (.NET)

```bash
cd api-net\citas-api.test
```

### Ejecutar todas las pruebas
```bash
dotnet test
```

### Ejecutar con cobertura (genera archivo XML)
```bash
dotnet test --settings coverlet.runsettings --collect:"XPlat Code Coverage"
```

### Generar reporte HTML de cobertura

Instalar la herramienta (solo la primera vez):
```bash
dotnet tool install -g dotnet-reportgenerator-globaltool
```

Generar el reporte:
```bash
reportgenerator -reports:"TestResults/**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
```

Abrir el reporte:
```bash
start coveragereport\index.html
```

> La cobertura está acotada a `Application.Logic` y `Domain.Entities` mediante `coverlet.runsettings`.
