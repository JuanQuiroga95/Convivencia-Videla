export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

export async function POST(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const body = await request.json()
    const { curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador } = body
    if (!nombre_activador || nombre_activador.trim().length < 3) {
      return NextResponse.json({ ok: false, error: 'El nombre del activador es obligatorio.' }, { status: 400 })
    }
    const now = new Date()
    await sql`INSERT INTO var_registros
      (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, mes, anio)
      VALUES (
        ${curso_id},
        ${categoria_id || null},
        ${tipo_situacion},
        ${resuelto},
        ${tipo_reparacion || null},
        ${intervino},
        ${nombre_activador.trim()},
        ${now.getMonth() + 1},
        ${now.getFullYear()}
      )`
    return NextResponse.json({ ok: true, message: 'VIR registrado exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json([])
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')
    const anio = searchParams.get('anio') || new Date().getFullYear()
    const curso_id = searchParams.get('curso_id')
    const categoria = searchParams.get('categoria')
    const resuelto = searchParams.get('resuelto')
    const intervino = searchParams.get('intervino')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let result
    if (mes) {
      result = await sql`
        SELECT v.*, c.nombre as curso_nombre
        FROM var_registros v
        JOIN cursos c ON c.id = v.curso_id
        WHERE v.mes = ${mes} AND v.anio = ${anio}
        ${curso_id ? sql`AND v.curso_id = ${curso_id}` : sql``}
        ${categoria ? sql`AND v.categoria_id = ${categoria}` : sql``}
        ${resuelto !== null && resuelto !== '' ? sql`AND v.resuelto = ${resuelto === 'true'}` : sql``}
        ${intervino ? sql`AND v.intervino = ${intervino}` : sql``}
        ORDER BY v.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      result = await sql`
        SELECT v.*, c.nombre as curso_nombre
        FROM var_registros v
        JOIN cursos c ON c.id = v.curso_id
        WHERE v.anio = ${anio}
        ${curso_id ? sql`AND v.curso_id = ${curso_id}` : sql``}
        ${categoria ? sql`AND v.categoria_id = ${categoria}` : sql``}
        ${resuelto !== null && resuelto !== '' ? sql`AND v.resuelto = ${resuelto === 'true'}` : sql``}
        ${intervino ? sql`AND v.intervino = ${intervino}` : sql``}
        ORDER BY v.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json([])
  }
}
