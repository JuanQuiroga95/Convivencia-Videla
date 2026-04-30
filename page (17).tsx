export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

// ── Datos fijos de demo ────────────────────────────────────────────────────

const ANIO = 2026
const MESES_DEMO = [3, 4] // Marzo y Abril

// Situaciones VIR por categoría
const VIR_POOL = [
  { categoria_id: 'pares',   tipo: 'Conflicto verbal entre estudiantes',         reparacion: 'Disculpa explícita' },
  { categoria_id: 'pares',   tipo: 'Hostigamiento (burla, provocación, empujones)', reparacion: 'Reflexión guiada' },
  { categoria_id: 'pares',   tipo: 'Esconder materiales de estudio',              reparacion: 'Acción reparadora concreta' },
  { categoria_id: 'docente', tipo: 'Desobediencia a indicaciones',                reparacion: 'Reflexión guiada' },
  { categoria_id: 'docente', tipo: 'Respuesta verbal inadecuada',                 reparacion: 'Disculpa explícita' },
  { categoria_id: 'entorno', tipo: 'Desorden del espacio de trabajo',             reparacion: 'Acción reparadora concreta' },
  { categoria_id: 'entorno', tipo: 'Suciedad del espacio',                        reparacion: 'Acción reparadora concreta' },
  { categoria_id: 'entorno', tipo: 'Intervención sobre superficies (rayar, pintar)', reparacion: 'Acción reparadora concreta' },
  { categoria_id: 'clase',   tipo: 'Uso indebido del celular',                   reparacion: 'Reflexión guiada' },
  { categoria_id: 'clase',   tipo: 'Interrupción reiterada de la clase',          reparacion: 'Disculpa explícita' },
  { categoria_id: 'clase',   tipo: 'Ingreso tardío al aula (posterior al timbre)', reparacion: 'Reflexión guiada' },
]

const INTERVINIENTES = ['Preceptor/a', 'Docente', 'SOE']

const ACCIONES_CAMPO = [
  { tipo: 'Participación en actos escolares',                          desc: 'Participación destacada en el acto conmemorativo institucional' },
  { tipo: 'Representación institucional en actividades externas',      desc: 'Representaron a la escuela en olimpíadas intercolegiales' },
  { tipo: 'Proyecto solidario',                                        desc: 'Organizaron una colecta de útiles escolares para donación' },
  { tipo: 'Producción institucional (flyer, campaña, streaming)',      desc: 'Diseñaron flyers para la campaña de concientización ambiental' },
  { tipo: 'Propuesta del curso (ej: día del niño, actividad interna)', desc: 'Organizaron actividad recreativa de integración con 1er año' },
]

const DOCENTES = [
  'María González', 'Carlos Pérez', 'Laura Sánchez', 'Roberto Díaz',
  'Alejandra López', 'Martín Fernández', 'Claudia Romero', 'Diego Morales',
]

const ACTIVADORES = [
  'Ana Martínez', 'Luis Torres', 'Patricia Vega', 'Hernán Suárez',
  'Silvina Castro', 'Facundo Ríos', 'Verónica Molina',
]

// Perfil por curso: define cuántos VIR, qué indicadores, etc.
// Variedad para que el tablero se vea interesante
interface CursoProfile {
  vir_count: number        // VIR en marzo
  vir_count_abril: number  // VIR en abril
  resolucion_pct: number   // % resueltos
  limpieza: number         // 1-5
  uniforme: string         // '>95%' | '85-95%' | '<85%'
  asistencia: number       // porcentaje
  actas: number            // 0-3
  ice: number              // 0-15
  campo_pts_marzo: number  // puntos de aportes en marzo (0 = sin acción)
  campo_pts_abril: number  // puntos de aportes en abril (0 = sin acción)
  pct_aprobados: number    // para período académico
}

// 23 cursos con perfiles variados para mostrar diversidad en el tablero
const PERFILES: CursoProfile[] = [
  // 1er año (5 cursos) — turno mañana
  { vir_count:2, vir_count_abril:1, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:97, actas:0, ice:0,  campo_pts_marzo:8,  campo_pts_abril:6,  pct_aprobados:92 },
  { vir_count:4, vir_count_abril:3, resolucion_pct:75,  limpieza:4, uniforme:'>95%',   asistencia:91, actas:1, ice:3,  campo_pts_marzo:0,  campo_pts_abril:4,  pct_aprobados:85 },
  { vir_count:6, vir_count_abril:4, resolucion_pct:67,  limpieza:3, uniforme:'85-95%', asistencia:86, actas:1, ice:5,  campo_pts_marzo:6,  campo_pts_abril:0,  pct_aprobados:78 },
  { vir_count:3, vir_count_abril:2, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:95, actas:0, ice:0,  campo_pts_marzo:10, campo_pts_abril:8,  pct_aprobados:90 },
  { vir_count:8, vir_count_abril:5, resolucion_pct:50,  limpieza:2, uniforme:'<85%',   asistencia:79, actas:2, ice:8,  campo_pts_marzo:0,  campo_pts_abril:0,  pct_aprobados:65 },
  // 2do año (5 cursos) — turno mañana
  { vir_count:3, vir_count_abril:2, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:96, actas:0, ice:0,  campo_pts_marzo:8,  campo_pts_abril:10, pct_aprobados:88 },
  { vir_count:5, vir_count_abril:3, resolucion_pct:80,  limpieza:4, uniforme:'85-95%', asistencia:89, actas:1, ice:4,  campo_pts_marzo:4,  campo_pts_abril:6,  pct_aprobados:82 },
  { vir_count:7, vir_count_abril:6, resolucion_pct:57,  limpieza:2, uniforme:'<85%',   asistencia:81, actas:2, ice:7,  campo_pts_marzo:0,  campo_pts_abril:0,  pct_aprobados:70 },
  { vir_count:2, vir_count_abril:1, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:98, actas:0, ice:0,  campo_pts_marzo:10, campo_pts_abril:8,  pct_aprobados:95 },
  { vir_count:4, vir_count_abril:3, resolucion_pct:75,  limpieza:3, uniforme:'85-95%', asistencia:87, actas:1, ice:5,  campo_pts_marzo:6,  campo_pts_abril:4,  pct_aprobados:76 },
  // 3er año (5 cursos) — turno tarde
  { vir_count:3, vir_count_abril:2, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:94, actas:0, ice:0,  campo_pts_marzo:8,  campo_pts_abril:6,  pct_aprobados:87 },
  { vir_count:6, vir_count_abril:4, resolucion_pct:67,  limpieza:3, uniforme:'85-95%', asistencia:85, actas:2, ice:6,  campo_pts_marzo:0,  campo_pts_abril:4,  pct_aprobados:73 },
  { vir_count:2, vir_count_abril:1, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:97, actas:0, ice:0,  campo_pts_marzo:10, campo_pts_abril:8,  pct_aprobados:91 },
  { vir_count:9, vir_count_abril:6, resolucion_pct:44,  limpieza:1, uniforme:'<85%',   asistencia:74, actas:3, ice:12, campo_pts_marzo:0,  campo_pts_abril:0,  pct_aprobados:58 },
  { vir_count:4, vir_count_abril:3, resolucion_pct:75,  limpieza:4, uniforme:'85-95%', asistencia:90, actas:1, ice:3,  campo_pts_marzo:6,  campo_pts_abril:8,  pct_aprobados:83 },
  // 4to año (4 cursos) — turno tarde
  { vir_count:3, vir_count_abril:2, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:95, actas:0, ice:0,  campo_pts_marzo:8,  campo_pts_abril:10, pct_aprobados:89 },
  { vir_count:5, vir_count_abril:4, resolucion_pct:80,  limpieza:3, uniforme:'85-95%', asistencia:88, actas:1, ice:5,  campo_pts_marzo:4,  campo_pts_abril:6,  pct_aprobados:79 },
  { vir_count:4, vir_count_abril:2, resolucion_pct:75,  limpieza:4, uniforme:'85-95%', asistencia:91, actas:1, ice:4,  campo_pts_marzo:6,  campo_pts_abril:4,  pct_aprobados:84 },
  { vir_count:7, vir_count_abril:5, resolucion_pct:57,  limpieza:2, uniforme:'<85%',   asistencia:80, actas:2, ice:9,  campo_pts_marzo:0,  campo_pts_abril:0,  pct_aprobados:67 },
  // 5to año (4 cursos) — turno tarde
  { vir_count:2, vir_count_abril:1, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:96, actas:0, ice:0,  campo_pts_marzo:8,  campo_pts_abril:6,  pct_aprobados:93 },
  { vir_count:4, vir_count_abril:3, resolucion_pct:75,  limpieza:4, uniforme:'>95%',   asistencia:92, actas:0, ice:2,  campo_pts_marzo:6,  campo_pts_abril:8,  pct_aprobados:86 },
  { vir_count:6, vir_count_abril:4, resolucion_pct:67,  limpieza:3, uniforme:'85-95%', asistencia:84, actas:1, ice:6,  campo_pts_marzo:4,  campo_pts_abril:0,  pct_aprobados:74 },
  { vir_count:3, vir_count_abril:2, resolucion_pct:100, limpieza:5, uniforme:'>95%',   asistencia:95, actas:0, ice:0,  campo_pts_marzo:10, campo_pts_abril:8,  pct_aprobados:90 },
]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export async function POST() {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })

  try {
    // 1. Obtener cursos de la DB
    const cursosRes = await sql`SELECT * FROM cursos ORDER BY anio, division`
    const cursos = cursosRes.rows
    if (cursos.length === 0) return NextResponse.json({ ok: false, error: 'No hay cursos. Ejecutá Setup primero.' }, { status: 400 })

    // 2. Limpiar datos demo anteriores de marzo y abril 2026
    await sql`DELETE FROM var_registros    WHERE anio = ${ANIO} AND mes = ANY(${MESES_DEMO})`
    await sql`DELETE FROM indicadores      WHERE anio = ${ANIO} AND mes = ANY(${MESES_DEMO})`
    await sql`DELETE FROM campo_positivo   WHERE anio = ${ANIO} AND mes = ANY(${MESES_DEMO})`

    let virCount = 0, indCount = 0, campoCount = 0

    for (let i = 0; i < cursos.length; i++) {
      const curso = cursos[i]
      const perfil = PERFILES[i] || PERFILES[0]

      for (const mes of MESES_DEMO) {
        const isAbril = mes === 4
        const virTotal = isAbril ? perfil.vir_count_abril : perfil.vir_count
        const resueltosPct = perfil.resolucion_pct / 100

        // ── VIR ──────────────────────────────────────────────────────────
        for (let v = 0; v < virTotal; v++) {
          const vir = VIR_POOL[v % VIR_POOL.length]
          const resuelto = v < Math.round(virTotal * resueltosPct)
          const intervino = pick(INTERVINIENTES)
          const activador = pick(ACTIVADORES)
          // Fecha dentro del mes
          const dia = 5 + (v * 3) % 20
          await sql`
            INSERT INTO var_registros
              (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, mes, anio, created_at)
            VALUES (
              ${curso.id}, ${vir.categoria_id}, ${vir.tipo},
              ${resuelto}, ${resuelto ? vir.reparacion : null},
              ${intervino}, ${activador},
              ${mes}, ${ANIO},
              ${new Date(ANIO, mes - 1, dia).toISOString()}
            )
          `
          virCount++
        }

        // ── INDICADORES ──────────────────────────────────────────────────
        await sql`
          INSERT INTO indicadores
            (curso_id, mes, anio, limpieza, uniforme, asistencia, actas, ice_puntos, interv_tempranas, situaciones_previas, updated_at)
          VALUES (
            ${curso.id}, ${mes}, ${ANIO},
            ${perfil.limpieza}, ${perfil.uniforme}, ${perfil.asistencia},
            ${perfil.actas}, ${perfil.ice}, 0, 0, NOW()
          )
          ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
            limpieza = EXCLUDED.limpieza, uniforme = EXCLUDED.uniforme,
            asistencia = EXCLUDED.asistencia, actas = EXCLUDED.actas,
            ice_puntos = EXCLUDED.ice_puntos, updated_at = NOW()
        `
        indCount++

        // ── DESEMPEÑO ACADÉMICO (solo en pct_aprobados, primer período) ─
        await sql`
          UPDATE indicadores SET pct_aprobados = ${perfil.pct_aprobados}
          WHERE curso_id = ${curso.id} AND mes = ${mes} AND anio = ${ANIO}
        `

        // ── APORTES A LA CONVIVENCIA ─────────────────────────────────────
        const campoPts = isAbril ? perfil.campo_pts_abril : perfil.campo_pts_marzo
        if (campoPts > 0) {
          const accion = ACCIONES_CAMPO[(i + mes) % ACCIONES_CAMPO.length]
          const docente = pick(DOCENTES)
          const dia = 10 + (i % 12)
          await sql`
            INSERT INTO campo_positivo
              (curso_id, tipo_accion, descripcion, puntos, fecha, mes, anio, nombre_docente)
            VALUES (
              ${curso.id}, ${accion.tipo}, ${accion.desc},
              ${campoPts},
              ${new Date(ANIO, mes - 1, dia).toISOString().split('T')[0]},
              ${mes}, ${ANIO}, ${docente}
            )
          `
          campoCount++
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Demo cargado: ${virCount} VIR · ${indCount} indicadores · ${campoCount} aportes (Marzo y Abril ${ANIO})`,
    })
  } catch (e: any) {
    console.error('Demo error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE() {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    await sql`DELETE FROM var_registros    WHERE anio = ${ANIO} AND mes = ANY(${MESES_DEMO})`
    await sql`DELETE FROM indicadores      WHERE anio = ${ANIO} AND mes = ANY(${MESES_DEMO})`
    await sql`DELETE FROM campo_positivo   WHERE anio = ${ANIO} AND mes = ANY(${MESES_DEMO})`
    return NextResponse.json({ ok: true, message: 'Datos demo eliminados correctamente.' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
