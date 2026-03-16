# HablaSpeak — Deploy Guide

## Lo que hicimos (Azure + Dokploy)

### 1. Crear VM en Azure
- Tamaño: `Standard_B2s` (2 vCPU, 4GB RAM)
- Region: `Canada Central`
- OS: Ubuntu 24.04 LTS
- Puertos abiertos en NSG: `22` (SSH), `80`, `443`, `3000` (Dokploy), `4000` (App)

### 2. Conectarse por SSH (Windows)
```bash
chmod 400 dokploy-key.pem
ssh -i dokploy-key.pem azureuser@<IP>
```

### 3. Instalar Dokploy
```bash
sudo curl -sSL https://dokploy.com/install.sh | sudo sh
```
Panel disponible en: `http://<IP>:3000`

### 4. Copiar proyecto al servidor
```bash
scp -i dokploy-key.pem -r ./HablaSpeak azureuser@<IP>:/opt/hablaspeak
```

### 5. .dockerignore correcto
El `.dockerignore` debe excluir los `.env` para que las variables vengan del entorno:
```
node_modules
.next
.git
.env
.env.local
.env.*
*.md
```

### 6. docker-compose.yml correcto (sin build context, variables sin valor por defecto)
```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: habla
      POSTGRES_PASSWORD: speakpass
      POSTGRES_DB: hablaspeak
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  hablaspeak:
    image: hablaspeak:latest
    container_name: hablaspeak-app
    ports:
      - "4000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://habla:speakpass@db:5432/hablaspeak?schema=public
      - NEXTAUTH_URL
      - NEXTAUTH_SECRET
      - GROQ_API_KEY
      - GROQ_MODEL=llama-3.1-8b-instant
      - GROQ_STT_MODEL=whisper-large-v3-turbo
    depends_on:
      - db
    restart: unless-stopped

volumes:
  pgdata:
```

### 7. Variables de entorno en Dokploy (tab Environment)
```
NEXTAUTH_URL=http://<IP>:4000
NEXTAUTH_SECRET=un-secreto-largo-aqui
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

### 8. Build manual de la imagen
```bash
cd /opt/hablaspeak
sudo docker build -t hablaspeak:latest .
```

### 9. Deploy desde Dokploy
- En Dokploy → proyecto → **Deploy**
- Si Dokploy no toma la nueva imagen, eliminar el contenedor primero:
```bash
sudo docker stop hablaspeak-app && sudo docker rm hablaspeak-app
```
Luego dar **Deploy** nuevamente.

### 10. Dominio gratuito + HTTPS con nip.io

Para HTTPS sin comprar dominio (ideal para pruebas):

1. En Dokploy → servicio → pestaña **Domains** → **Add Domain**
2. Host: `<IP>.nip.io` (ej: `4.172.214.90.nip.io`)
3. Container Port: `3000`
4. Activar toggle **HTTPS** → **Create**
5. Actualizar variable de entorno:
```
NEXTAUTH_URL=https://<IP>.nip.io
```
6. **Deploy**

El certificado SSL se genera automáticamente con Let's Encrypt en 1-2 minutos.

> Para producción real usa un dominio propio (~$10-15/año en Namecheap o Cloudflare).

### Problema encontrado: Antivirus bloquea POST
Bitdefender bloqueaba las solicitudes POST a la IP directa sin HTTPS.
- Causa: POST requests a IP sin HTTPS son bloqueados por antivirus
- Solución: usar dominio + HTTPS (ver paso 10)

### Problema encontrado: MediaRecorder no funciona
Los browsers bloquean el micrófono en sitios HTTP.
- Solución: HTTPS obligatorio (ver paso 10)

---

## Subir cambios rápidamente (flujo actual sin Git)

```bash
# 1. Copiar archivos modificados al servidor
scp -i dokploy-key.pem -r ./HablaSpeak azureuser@<IP>:/opt/hablaspeak

# 2. Rebuildar la imagen en el servidor
ssh -i dokploy-key.pem azureuser@<IP> "cd /opt/hablaspeak && sudo docker build -t hablaspeak:latest ."

# 3. Recrear el contenedor
ssh -i dokploy-key.pem azureuser@<IP> "sudo docker stop hablaspeak-app && sudo docker rm hablaspeak-app"

# 4. Deploy desde Dokploy (o via CLI)
ssh -i dokploy-key.pem azureuser@<IP> "cd /opt/hablaspeak && sudo docker compose -p hablaspeak-gp55s0 up -d --remove-orphans"
```

---

## Recomendación: usar GitHub (MEJOR opción para Digital Ocean)

**Sí, usa GitHub.** Es mucho más limpio y rápido.

### Ventajas con GitHub + Dokploy:
- Push a `main` → Dokploy hace build y deploy automático
- No necesitas copiar archivos manualmente
- Dokploy clona el repo, buildea y despliega solo
- Solo le das acceso a ese repo específico (seguro)

### Flujo con GitHub:
```
git add .
git commit -m "cambio x"
git push origin main
# Dokploy detecta el push y hace deploy automático
```

### Setup en Dokploy:
1. Settings → Git → Connect GitHub
2. Instalar GitHub App → seleccionar solo el repo `HablaSpeak`
3. En el servicio Docker Compose → cambiar Source de "Raw" a "GitHub"
4. Seleccionar repo + branch `main`
5. Activar **Autodeploy**

### Para Digital Ocean:
Mismo proceso. Dokploy en un droplet de $6/mes + GitHub = deploy automático con cada push.
