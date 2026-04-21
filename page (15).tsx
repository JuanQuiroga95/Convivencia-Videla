export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

// Solo admin puede gestionar usuarios
async function verificarAdmin(request: NextRequest) {
  const cookie = request.cookies.get('videla_session')
  if (!cookie?.value) return false
  try {
    const data = JSON.parse(Buffer.from(cookie.value, 'base64').toString())
    return data.rol === 'admin'
  } catch { return false }
}

export async function GET(request: NextRequest) {
  if (!await verificarAdmin(request)) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  const sql = await getSQL()
  if (!sql) return NextResponse.json([])
  try {
    const result = await sql`SELECT id, nombre, usuario, rol, activo, created_at FROM usuarios ORDER BY created_at DESC`
    return NextResponse.json(result.rows)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: NextRequest) {
  if (!await verificarAdmin(request)) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'DB no disponible' }, { status: 503 })
  try {
    const { nombre, usuario, password, rol } = await request.json()
    await sql`INSERT INTO usuarios (nombre, usuario, password, rol) VALUES (${nombre}, ${usuario}, ${password}, ${rol || 'operativo'})`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message.includes('unique') ? 'Ese usuario ya existe' : e.message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  if (!await verificarAdmin(request)) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'DB no disponible' }, { status: 503 })
  try {
    const { id, nombre, usuario, password, rol, activo } = await request.json()
    if (password) {
      await sql`UPDATE usuarios SET nombre=${nombre}, usuario=${usuario}, password=${password}, rol=${rol}, activo=${activo} WHERE id=${id}`
    } else {
      await sql`UPDATE usuarios SET nombre=${nombre}, usuario=${usuario}, rol=${rol}, activo=${activo} WHERE id=${id}`
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!await verificarAdmin(request)) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false }, { status: 503 })
  try {
    const { id } = await request.json()
    await sql`DELETE FROM usuarios WHERE id=${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
