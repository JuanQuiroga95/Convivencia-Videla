export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

export async function POST(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const body = await request.json()
    const { curso_id, tipo_accion, descripcion, evidencia_url, evidencia_tipo, puntos, fecha, nombre_docente } = body

    if (!curso_id || !tipo_accion || !descripcion || !puntos || !fecha || !nombre_docente) {
      return NextResponse.json({ ok: false, error: 'Todos los campos obligatorios deben completarse.' }, { status: 400 })
    }
    if (puntos < 1 || puntos > 10) {
      return NextResponse.json({ ok: false, error: 'Los puntos deben ser entre 1 y 10.' }, { status: 400 })
    }

    const fechaDate = new Date(fecha)
    const mes  = fechaDate.getMonth() + 1
    const anio = fechaDate.getFullYear()

    await sql`
      INSERT INTO campo_positivo
        (curso_id, tipo_accion, descripcion, evidencia_url, evidencia_tipo, puntos, fecha, mes, anio, nombre_docente)
      VALUES
        (${curso_id}, ${tipo_accion}, ${descripcion}, ${evidencia_url || null},
         ${evidencia_tipo || 'enlace'}, ${puntos}, ${fecha}, ${mes}, ${anio}, ${nombre_docente.trim()})
    `
    return NextResponse.json({ ok: true, message: 'Acción de campo registrada exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json([])
  try {
    const { searchParams } = new URL(request.url)
    const mes      = searchParams.get('mes')
    const anio     = searchParams.get('anio') || new Date().getFullYear()
    const curso_id = searchParams.get('curso_id')

    let result
    if (mes && curso_id) {
      result = await sql`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.mes = ${mes} AND cp.anio = ${anio} AND cp.curso_id = ${curso_id}
        ORDER BY cp.created_at DESC
      `
    } else if (mes) {
      result = await sql`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.mes = ${mes} AND cp.anio = ${anio}
        ORDER BY cp.created_at DESC
      `
    } else if (curso_id) {
      result = await sql`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.anio = ${anio} AND cp.curso_id = ${curso_id}
        ORDER BY cp.created_at DESC
        LIMIT 100
      `
    } else {
      result = await sql`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.anio = ${anio}
        ORDER BY cp.created_at DESC
        LIMIT 100
      `
    }
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Sin DB' }, { status: 503 })
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID requerido' }, { status: 400 })
    await sql`DELETE FROM campo_positivo WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
