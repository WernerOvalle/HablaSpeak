# ---- Etapa 1: Instalar dependencias ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
# Activar pnpm via corepack (incluido en Node 20)
RUN corepack enable
WORKDIR /app

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-workspace.yaml ./

# Crear lockfile si no existe y luego instalar
RUN pnpm install --no-frozen-lockfile

# ---- Etapa 2: Build ----
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_GEMINI_API_KEY
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY

RUN pnpm build

# ---- Etapa 3: Runner de producción ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
