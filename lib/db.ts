export async function getSQL(): Promise<any | null> {
  if (!process.env.POSTGRES_URL) return null
  try {
    const mod = await import('@vercel/postgres')
    return mod.sql
  } catch { return null }
}

export async function setupDatabase() {
  const sql = await getSQL()
  if (!sql) throw new Error('POSTGRES_URL no configurada.')

  await sql`CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    division VARCHAR(5) NOT NULL,
    anio INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`

  await sql`INSERT INTO cursos (nombre, division, anio) VALUES
    ('1°1°', '1', 1), ('1°2°', '2', 1), ('1°3°', '3', 1),
    ('2°1°', '1', 2), ('2°2°', '2', 2), ('2°3°', '3', 2),
    ('3°1°', '1', 3), ('3°2°', '2', 3), ('3°3°', '3', 3),
    ('4°1°', '1', 4), ('4°2°', '2', 4), ('4°3°', '3', 4),
    ('5°1°', '1', 5), ('5°2°', '2', 5), ('5°3°', '3', 5)
    ON CONFLICT (nombre) DO NOTHING`

  await sql`CREATE TABLE IF NOT EXISTS var_registros (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES cursos(id),
    tipo_situacion VARCHAR(100) NOT NULL,
    resuelto BOOLEAN NOT NULL DEFAULT false,
    tipo_reparacion VARCHAR(100),
    intervino VARCHAR(50) NOT NULL,
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`

  await sql`CREATE TABLE IF NOT EXISTS indicadores (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES cursos(id),
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    limpieza INTEGER,
    uniforme VARCHAR(20),
    puntualidad DECIMAL(5,2),
    asistencia DECIMAL(5,2),
    actas INTEGER DEFAULT 0,
    ice_puntos INTEGER DEFAULT 0,
    interv_tempranas INTEGER DEFAULT 0,
    situaciones_previas INTEGER DEFAULT 0,
    pct_aprobados DECIMAL(5,2),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id, mes, anio)
  )`

  return { ok: true }
}

export async function setupUsuarios() {
  const sql = await getSQL()
  if (!sql) throw new Error('POSTGRES_URL no configurada.')

  await sql`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`

  await sql`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`

  return { ok: true }
}
