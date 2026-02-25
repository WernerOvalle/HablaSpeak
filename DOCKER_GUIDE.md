# 🐳 HablaSpeak — Guía Docker

> Todo se corre desde la carpeta del proyecto:
> `C:\Users\werne\Desktop\HablaSpeak`

---

## 🚀 PRIMERA VEZ — Arrancar desde cero

### Paso 1 — Abre una terminal en la carpeta del proyecto

En VS Code: `Ctrl + `` ` (terminal integrada)  
O en Windows: clic derecho en la carpeta → **"Abrir en Terminal"**

### Paso 2 — (Opcional) Configura tu API Key de Gemini

Abre el archivo `.env.local` y rellena tu clave:

```env
NEXT_PUBLIC_GEMINI_API_KEY=AIza...tu_clave_aqui
```

> Sin clave, la app funciona en **modo demo** con respuestas simuladas. ✅

### Paso 3 — Construir y levantar el contenedor

```bash
docker-compose up --build
```

Este comando hace **todo automáticamente**:
1. 📦 Descarga la imagen base Node 20
2. 📥 Instala dependencias con `pnpm`
3. 🏗️ Compila Next.js (puede tardar 3–8 min la primera vez)
4. ▶️ Levanta el servidor en el puerto 3000

### Paso 4 — Abrir la app en el navegador

```
http://localhost:3000
```

Verás la pantalla de login de HablaSpeak. ✅

---

## 🔄 HACER CAMBIOS — Workflow de desarrollo

Cada vez que modifiques código, sigue este flujo:

### Opción A — Reconstruir completo (recomendado tras cambios grandes)

```bash
# 1. Detener el contenedor actual
docker-compose down

# 2. Reconstruir con los nuevos cambios
docker-compose up --build
```

### Opción B — Solo reiniciar sin reconstruir (si no cambiaste dependencias)

```bash
# Detener y volver a levantar SIN reconstruir la imagen
docker-compose down
docker-compose up
```

> ⚠️ Esto NO incluye cambios de código, solo reinicia el servidor.
> Usa `--build` siempre que cambies archivos `.tsx`, `.css`, etc.

### Opción C — Reconstruir en background (sin bloquear la terminal)

```bash
docker-compose up --build -d
```

El `-d` lo corre en segundo plano. Para ver los logs:

```bash
docker-compose logs -f
```

Para detenerlo cuando esté en background:

```bash
docker-compose down
```

---

## 🧹 LIMPIAR — Si algo falla o quieres un fresh start

```bash
# Detener y eliminar contenedores + redes
docker-compose down

# Eliminar la imagen construida (fuerza reconstrucción total)
docker rmi hablaspeak:latest

# Volver a construir desde cero
docker-compose up --build
```

Para limpieza **total** de caché de Docker (nuclear option ☢️):

```bash
docker system prune -a
```

> ⚠️ Esto elimina TODAS las imágenes y caché de Docker, no solo las de este proyecto.

---

## 📋 COMANDOS DE DIAGNÓSTICO

```bash
# Ver contenedores corriendo
docker ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de solo el servicio
docker-compose logs -f hablaspeak

# Entrar al contenedor (para debug)
docker exec -it hablaspeak-app sh

# Ver uso de recursos
docker stats
```

---

## ⚡ REFERENCIA RÁPIDA

| Situación | Comando |
|-----------|---------|
| **Primera vez / cambié código** | `docker-compose up --build` |
| **Solo reiniciar el servidor** | `docker-compose down && docker-compose up` |
| **Correr en background** | `docker-compose up --build -d` |
| **Ver qué está pasando** | `docker-compose logs -f` |
| **Apagar todo** | `docker-compose down` |
| **Limpiar y empezar de cero** | `docker rmi hablaspeak:latest && docker-compose up --build` |

---

## 🌐 URLs

| Entorno | URL |
|---------|-----|
| App principal | http://localhost:3000 |
| Login | http://localhost:3000 (pantalla inicial) |

---

## 💡 Tips

- **La primera build siempre es lenta** (~5-10 min) porque pnpm descarga todas las dependencias y Next.js compila todo. Las siguientes son más rápidas gracias al caché de Docker.
- **Cambiar `.env.local` NO requiere tocar el código** — pero sí requiere `--build` para que el valor llegue al build de Next.js.
- **El modo demo funciona sin API Key** — perfecto para testear el UI sin gastar cuota de Gemini.
- Si el puerto 3000 está ocupado, cambia en `docker-compose.yml`: `"3001:3000"` y accede en `http://localhost:3001`.
