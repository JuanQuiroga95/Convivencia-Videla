export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

export async function POST(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const body = await request.json()
    const { curso_id, mes, anio, es_cierre_academico } = body

    if (es_cierre_academico) {
      // Solo actualizar pct_aprobados sin tocar los otros campos mensuales
      await sql`
        INSERT INTO indicadores (curso_id, mes, anio, pct_aprobados, updated_at)
        VALUES (${curso_id}, ${mes}, ${anio}, ${body.pct_aprobados}, NOW())
        ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
          pct_aprobados = EXCLUDED.pct_aprobados,
          updated_at    = NOW()
      `
    } else {
      // Carga mensual normal (sin tocar pct_aprobados si ya existe)
      const {
        limpieza, uniforme, asistencia,
        actas, ice_puntos, interv_tempranas, situaciones_previas
      } = body

      await sql`
        INSERT INTO indicadores
          (curso_id, mes, anio, limpieza, uniforme, asistencia,
           actas, ice_puntos, interv_tempranas, situaciones_previas, updated_at)
        VALUES
          (${curso_id}, ${mes}, ${anio}, ${limpieza}, ${uniforme || null}, ${asistencia},
           ${actas}, ${ice_puntos}, ${interv_tempranas ?? 0}, ${situaciones_previas ?? 0}, NOW())
        ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
          limpieza            = EXCLUDED.limpieza,
          uniforme            = EXCLUDED.uniforme,
          asistencia          = EXCLUDED.asistencia,
          actas               = EXCLUDED.actas,
          ice_puntos          = EXCLUDED.ice_puntos,
          interv_tempranas    = EXCLUDED.interv_tempranas,
          situaciones_previas = EXCLUDED.situaciones_previas,
          updated_at          = NOW()
      `
    }

    return NextResponse.json({ ok: true, message: 'Guardado exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json([])
  try {
    const { searchParams } = new URL(request.url)
    const mes  = searchParams.get('mes')
    const anio = searchParams.get('anio') || new Date().getFullYear()
    let result
    if (mes) {
      result = await sql`
        SELECT i.*, c.nombre as curso_nombre FROM indicadores i
        JOIN cursos c ON c.id = i.curso_id
        WHERE i.mes = ${mes} AND i.anio = ${anio}
        ORDER BY c.anio, c.division
      `
    } else {
      result = await sql`
        SELECT i.*, c.nombre as curso_nombre FROM indicadores i
        JOIN cursos c ON c.id = i.curso_id
        WHERE i.anio = ${anio}
        ORDER BY i.mes DESC, c.anio, c.division
      `
    }
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json([])
  }
}
