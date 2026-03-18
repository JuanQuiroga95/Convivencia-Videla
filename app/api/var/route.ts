export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

export async function POST(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada. Ir a /admin para inicializar.' }, { status: 503 })
  try {
    const body = await request.json()
    const { curso_id, tipo_situacion, resuelto, tipo_reparacion, intervino } = body
    const now = new Date()
    await sql`INSERT INTO var_registros (curso_id, tipo_situacion, resuelto, tipo_reparacion, intervino, mes, anio)
      VALUES (${curso_id}, ${tipo_situacion}, ${resuelto}, ${tipo_reparacion || null}, ${intervino}, ${now.getMonth() + 1}, ${now.getFullYear()})`
    return NextResponse.json({ ok: true, message: 'VAR registrado exitosamente' })
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
    let result
    if (mes) {
      result = await sql`SELECT v.*, c.nombre as curso_nombre FROM var_registros v
        JOIN cursos c ON c.id = v.curso_id WHERE v.mes = ${mes} AND v.anio = ${anio} ORDER BY v.created_at DESC`
    } else {
      result = await sql`SELECT v.*, c.nombre as curso_nombre FROM var_registros v
        JOIN cursos c ON c.id = v.curso_id WHERE v.anio = ${anio} ORDER BY v.created_at DESC LIMIT 100`
    }
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json([])
  }
}
