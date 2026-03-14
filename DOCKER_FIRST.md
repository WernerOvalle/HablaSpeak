# Docker First (HablaSpeak)

Este proyecto trabaja en modo **Docker-first**. La idea es no depender de instalaciones locales para correr la app o scripts.

## Comandos base

- Levantar servicios:
  - `docker compose up --build`
- Ver logs:
  - `docker compose logs -f hablaspeak`
- Entrar al contenedor de app:
  - `docker compose exec hablaspeak sh`

## Scripts Node/Next

Ejecutar siempre dentro del contenedor:

- `docker compose exec hablaspeak npm run dev`
- `docker compose exec hablaspeak npm run build`
- `docker compose exec hablaspeak npm run lint`

## Prisma

Tambien dentro del contenedor:

- `docker compose exec hablaspeak npx prisma migrate dev`
- `docker compose exec hablaspeak npx prisma db seed`
- `docker compose exec hablaspeak npx prisma studio`

## Regla operativa

Si algo falla, primero revisar contenedores y logs.  
Evitar instalar paquetes o ejecutar scripts directamente en el host salvo que se pida explicitamente.
