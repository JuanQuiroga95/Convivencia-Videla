# Modelo Videla — Convivencia Activa 2026
## Sistema Formativo · Preventivo · Resolutivo
### Escuela N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza

---

## 🚀 CÓMO PUBLICAR EN VERCEL (Paso a paso)

### 1. Crear cuenta en GitHub
- Ir a [github.com](https://github.com) y crear una cuenta gratuita (si no tenés)

### 2. Subir el proyecto a GitHub
- Crear un repositorio nuevo llamado `videla-convivencia`
- Subir todos estos archivos al repositorio

### 3. Crear cuenta en Vercel
- Ir a [vercel.com](https://vercel.com) y conectar con tu cuenta de GitHub
- Hacer clic en "New Project" → seleccionar el repositorio `videla-convivencia`
- Vercel detecta automáticamente que es Next.js
- Hacer clic en "Deploy"

### 4. Crear la Base de Datos Postgres
- En el panel de Vercel, ir a **Storage** (en el menú izquierdo)
- Hacer clic en **Create Database** → elegir **Postgres**
- Darle un nombre: `videla-db`
- Hacer clic en **Connect to Project** → seleccionar tu proyecto

Vercel conecta automáticamente la DB al proyecto inyectando `POSTGRES_URL`.

### 5. Inicializar la base de datos
- Una vez deployado, abrir la app en el browser
- Ir a `/admin`
- Hacer clic en **"Inicializar base de datos"**
- ¡Listo! Los cursos se crean automáticamente.

---

## 📱 INSTALAR COMO APP EN EL CELULAR

### Android
1. Abrir la URL de la app en Chrome
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. Aparece el ícono como si fuera una app

### iPhone (iOS)
1. Abrir la URL en Safari
2. Botón Compartir → "Agregar a pantalla de inicio"
3. Aparece el ícono en la pantalla

---

## 🖥️ FUNCIONALIDADES

| Sección | URL | Descripción |
|---------|-----|-------------|
| Inicio | `/` | Panel principal con accesos rápidos |
| VAR | `/var` | Formulario de 3 pasos para registrar intervenciones |
| Indicadores | `/indicadores` | Carga mensual de datos por curso |
| Tablero | `/tablero` | Ranking y gráficos por mes |
| Reglas | `/reglas` | Criterios, rúbricas y protocolo VAR |
| QR | `/qr` | Generador de códigos QR por aula |
| Admin | `/admin` | Gestión de base de datos y registros |

---

## 📊 SISTEMA DE PUNTOS

| Dimensión | Puntos máx. | Indicadores |
|-----------|-------------|-------------|
| Resolutiva | 30 | VAR resueltos, actas, ICE |
| Formativa | 30 | Limpieza, uniforme, puntualidad, asistencia |
| Preventiva | 20 | Intervenciones tempranas, situaciones previas |
| Académica | 20 | % materias aprobadas |
| **TOTAL** | **100** | |

---

## 🔧 DESARROLLO LOCAL

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

Para base de datos local, crear archivo `.env.local` con:
```
POSTGRES_URL=postgres://...
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
videla-convivencia/
├── app/
│   ├── page.tsx          # Inicio
│   ├── var/page.tsx      # Formulario VAR
│   ├── indicadores/page.tsx  # Carga indicadores
│   ├── tablero/page.tsx  # Ranking y gráficos
│   ├── reglas/page.tsx   # Reglas y rúbricas
│   ├── qr/page.tsx       # Generador QR
│   ├── admin/page.tsx    # Administración
│   └── api/              # API Routes (backend)
├── components/
│   └── Nav.tsx           # Navegación
└── lib/
    ├── db.ts             # Base de datos
    └── scoring.ts        # Cálculo de puntajes
```

---

*Modelo Videla de Convivencia Activa 2026 · Esc. N° 4-012 · Luján de Cuyo, Mendoza*
