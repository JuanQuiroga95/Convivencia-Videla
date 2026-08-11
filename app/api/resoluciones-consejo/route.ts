export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

// Helper to check session
function getSession(request: NextRequest) {
  const cookie = request.cookies.get('videla_session')
  if (!cookie?.value) return null
  try { return JSON.parse(Buffer.from(cookie.value, 'base64').toString()) }
  catch { return null }
}

export async function POST(request: NextRequest) {
  const session = getSession(request)
  if (!session || session.rol !== 'admin') {
    return NextResponse.json({ ok: false, error: 'Prohibido: Se requiere rol de administrador' }, { status: 403 })
  }

  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  
  try {
    const body = await request.json()
    const { id_vir, tipo_accion, puntos_descontados, observaciones } = body
    
    if (!id_vir || !tipo_accion) {
      return NextResponse.json({ ok: false, error: 'id_vir y tipo_accion son obligatorios.' }, { status: 400 })
    }

    // Insert the resolution
    await sql`
      INSERT INTO vir_resoluciones_consejo (id_vir, tipo_accion, puntos_descontados, observaciones, autor_registro)
      VALUES (${id_vir}, ${tipo_accion}, ${puntos_descontados || null}, ${observaciones || null}, ${session.nombre})
    `

    // Update the VIR to Resuelto
    await sql`
      UPDATE var_registros 
      SET estado = 'Resuelto', resuelto = true 
      WHERE id = ${id_vir}
    `

    return NextResponse.json({ ok: true, message: 'Resolución registrada exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json([])
  
  try {
    const { searchParams } = new URL(request.url)
    const id_vir = searchParams.get('id_vir')
    
    if (id_vir) {
      const res = await sql`SELECT * FROM vir_resoluciones_consejo WHERE id_vir = ${id_vir} ORDER BY created_at DESC`
      return NextResponse.json(res.rows)
    }

    const res = await sql`SELECT * FROM vir_resoluciones_consejo ORDER BY created_at DESC LIMIT 100`
    return NextResponse.json(res.rows)
  } catch (e: any) {
    return NextResponse.json([])
  }
}
