export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL, getDB } from '@/lib/db'

export async function POST(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const body = await request.json()
    const { curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, estudiantes_involucrados, desc_mediacion } = body
    if (!nombre_activador || nombre_activador.trim().length < 3) {
      return NextResponse.json({ ok: false, error: 'El nombre del activador es obligatorio.' }, { status: 400 })
    }
    const now = new Date()
    await sql`INSERT INTO var_registros
      (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, estudiantes_involucrados, desc_mediacion, mes, anio)
      VALUES (
        ${curso_id},
        ${categoria_id || null},
        ${tipo_situacion},
        ${resuelto},
        ${tipo_reparacion || null},
        ${intervino},
        ${nombre_activador.trim()},
        ${estudiantes_involucrados || null},
        ${desc_mediacion || null},
        ${now.getMonth() + 1},
        ${now.getFullYear()}
      )`
    return NextResponse.json({ ok: true, message: 'VIR registrado exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const db = await getDB()
  if (!db) return NextResponse.json([])
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')
    const anio = searchParams.get('anio') || new Date().getFullYear()
    const curso_id = searchParams.get('curso_id')
    const categoria = searchParams.get('categoria')
    const resueltoStr = searchParams.get('resuelto')
    const intervino = searchParams.get('intervino')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let q = `
      SELECT v.*, c.nombre as curso_nombre
      FROM var_registros v
      JOIN cursos c ON c.id = v.curso_id
      WHERE v.anio = $1
    `
    const values: any[] = [anio]
    let pCount = 1

    if (mes) {
      pCount++
      q += ` AND v.mes = $${pCount}`
      values.push(mes)
    }
    if (curso_id) {
      pCount++
      q += ` AND v.curso_id = $${pCount}`
      values.push(curso_id)
    }
    const curso_nombre = searchParams.get('curso_nombre')
    if (curso_nombre) {
      pCount++
      q += ` AND c.nombre = $${pCount}`
      values.push(curso_nombre)
    }
    if (categoria) {
      pCount++
      q += ` AND v.categoria_id = $${pCount}`
      values.push(categoria)
    }
    if (resueltoStr === 'true' || resueltoStr === 'false') {
      pCount++
      q += ` AND v.resuelto = $${pCount}`
      values.push(resueltoStr === 'true')
    }
    if (intervino) {
      pCount++
      q += ` AND v.intervino = $${pCount}`
      values.push(intervino)
    }

    q += ` ORDER BY v.created_at DESC LIMIT $${pCount + 1} OFFSET $${pCount + 2}`
    values.push(limit, offset)

    const result = await db.query(q, values)
    return NextResponse.json(result.rows)
  } catch (e: any) {
    console.error('Error fetching VIR:', e)
    return NextResponse.json([])
  }
}
