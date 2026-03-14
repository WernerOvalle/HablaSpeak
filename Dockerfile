# ---- Etapa 1: Instalar dependencias ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
# Activar pnpm via corepack (incluido en Node 20)
RUN corepack enable
WORKDIR /app

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-workspace.yaml* ./
COPY prisma ./prisma

# Crear lockfile si no existe y luego instalar
RUN pnpm install --no-frozen-lockfile
RUN npx prisma generate

# ---- Etapa 2: Build ----
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---- Etapa 3: Runner de producción ----
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app /app

EXPOSE 3000

# Espera DB lista, sincroniza Prisma, siembra y arranca Next
CMD ["sh", "-c", "until npx prisma db push; do echo 'Esperando PostgreSQL...'; sleep 2; done; npm run db:seed; npm run start"]
