# 🚀 El Canario Virtual - Guía de Configuración

## Paso 1: Configurar PostgreSQL con Supabase (Recomendado)

### ¿Por qué Supabase?
- ✅ Free tier generoso (500MB DB, 2GB bandwidth)
- ✅ Interfaz visual fácil de usar
- ✅ Backup automático
- ✅ Ya incluye autenticación (podemos usarla si queremos)

### Instrucciones:

1. **Ir a Supabase:**
   - Visitar: https://supabase.com
   - Click en "Start your project"
   - Crear cuenta (puedes usar tu Gmail)

2. **Crear Proyecto:**
   - Click en "New Project"
   - Nombre: `canario-virtual`
   - Database Password: **[GUARDAR EN LUGAR SEGURO]**
   - Region: Elegir más cercana (South America - São Paulo recommended)
   - Click en "Create new project" (toma ~2 minutos)

3. **Obtener Connection String:**
   - Una vez created el proyecto, ir a Settings (engranaje) → Database
   - Buscar "Connection String" → "URI"
   - Copiar la URL que se ve así:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
     ```
   - Reemplazar `[YOUR-PASSWORD]` con la password que usaste en el paso 2

4. **Copiar a .env.local:**
   ```bash
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.abc123xyz.supabase.co:5432/postgres"
   ```

5. **Crear Tablas (SQL Editor en Supabase):**
   - En Supabase, ir a "SQL Editor" (ícono de código)
   - Click en "New query"
   - Copiar y pegar el siguiente SQL:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'socio' CHECK (role IN ('socio', 'admin')),
  last_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de eventos (partidos)
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  fecha_hora TIMESTAMP NOT NULL,
  precio INTEGER NOT NULL,
  foto_portada_url TEXT,
  youtube_video_id VARCHAR(50),
  stream_enabled BOOLEAN DEFAULT FALSE,
  ventas_habilitadas BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de compras
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  mercadopago_payment_id VARCHAR(255) UNIQUE,
  mercadopago_preference_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  amount INTEGER NOT NULL,
  cupon_compensacion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, event_id)
);

-- Tabla de sesiones activas (session lock)
CREATE TABLE active_sessions (
  email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  session_token VARCHAR(255) PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  last_ping TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_purchases_email ON purchases(email);
CREATE INDEX idx_purchases_event ON purchases(event_id);
CREATE INDEX idx_active_sessions_email ON active_sessions(email);
CREATE INDEX idx_events_fecha ON events(fecha_hora);
```

   - Click en "Run" (abajo a la derecha)
   - Verificar que se crearon las tablas (ir a "Table Editor" → ver 4 tablas)

---

## Paso 2: Configurar Google OAuth

### Instrucciones:

1. **Ir a Google Cloud Console:**
   - Visitar: https://console.cloud.google.com
   - Login con tu Gmail

2. **Crear Proyecto:**
   - Click en el selector de proyectos (arriba, al lado del logo de Google Cloud)
   - Click en "New Project"
   - Nombre: `El Canario Virtual`
   - Click en "Create"

3. **Habilitar Google+ API:**
   - En el menú lateral → "APIs & Services" → "Library"
   - Buscar "Google+ API"
   - Click en "Enable"

4. **Configurar OAuth Consent Screen:**
   - En el menú lateral → "APIs & Services" → "OAuth consent screen"
   - User Type: "External"
   - Click en "Create"
   - Llenar solo los campos obligatorios:
     - App name: `El Canario Virtual`
     - User support email: [tu email]
     - Developer contact email: [tu email]
   - Click en "Save and Continue" (3 veces hasta llegar al resumen)

5. **Crear Credentials:**
   - En el menú lateral → "APIs & Services" → "Credentials"
   - Click en "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `El Canario Virtual Web Client`
   - Authorized redirect URIs → Click en "Add URI":
     - `http://localhost:3000/api/auth/callback/google` (para desarrollo)
     - (Después del deploy agregarás: `https://tu-dominio.vercel.app/api/auth/callback/google`)
   - Click en "Create"

6. **Copiar Credentials:**
   - Se mostrará un modal con:
     - **Client ID:** `123456789-abc.apps.googleusercontent.com`
     - **Client Secret:** `GOCSPX-abc123xyz`
   - **COPIAR AMBOS** y agregarlos a `.env.local`:

```bash
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz"
```

---

## Paso 3: Configurar Variables de Entorno

Crear/actualizar el archivo `app/.env.local` con TODAS estas variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.abc123xyz.supabase.co:5432/postgres"

# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz"

# NextAuth (generar secret random)
NEXTAUTH_SECRET="[GENERAR_SECRET_AQUI]"
NEXTAUTH_URL="http://localhost:3000"

# MercadoPago (ya tienes esto)
MERCADOPAGO_ACCESS_TOKEN="APP_USR-xxxx"
MERCADOPAGO_PUBLIC_KEY="APP_USR_xxxx"
```

### ¿Cómo generar NEXTAUTH_SECRET?

**Opción 1 - PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Opción 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opción 3 - Online (rápido):**
- Visitar: https://generate-secret.vercel.app/32
- Copiar el secret generado

---

## Paso 4: Verificar Configuración

Una vez completados los pasos anteriores:

1. **Verificar que .env.local tiene todas las variables:**
   ```bash
   DATABASE_URL=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=http://localhost:3000
   MERCADOPAGO_ACCESS_TOKEN=...
   MERCADOPAGO_PUBLIC_KEY=...
   ```

2. **Probar conexión a DB:**
   - En Supabase → "SQL Editor"
   - Ejecutar: `SELECT * FROM users LIMIT 1;`
   - Debería retornar vacío pero sin errores

3. **Listo para comenzar el desarrollo! 🎉**

---

## Resumen de Credenciales Necesarias

| Servicio | Qué necesitas | Dónde obtenerlo |
|----------|---------------|-----------------|
| **Supabase** | `DATABASE_URL` | https://supabase.com → Settings → Database |
| **Google OAuth** | `CLIENT_ID` + `CLIENT_SECRET` | https://console.cloud.google.com → Credentials |
| **NextAuth** | `NEXTAUTH_SECRET` | Generar random (ver arriba) |
| **MercadoPago** | `ACCESS_TOKEN` (ya lo tienes) | Ya configurado |

---

## Problemas Comunes

### Error: "Connection refused" al conectar a DB
- **Solución:** Verificar que la IP esté permitida en Supabase (Settings → Database → Network → debería estar en "Allow all")

### Error: "Redirect URI mismatch" en Google OAuth
- **Solución:** Verificar que la URI en Google Cloud Console sea EXACTAMENTE `http://localhost:3000/api/auth/callback/google`

### Error: "Invalid secret" en NextAuth
- **Solución:** Regenerar el `NEXTAUTH_SECRET` y asegurarte de que tenga al menos 32 caracteres

---

**¿Listo para continuar?** Una vez tengas todas las credenciales configuradas en `.env.local`, avísame y comenzaremos con el código! 🚀
