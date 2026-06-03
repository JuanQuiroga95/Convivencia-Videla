import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

export async function GET(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const { searchParams } = new URL(request.url)
    const clave = searchParams.get('clave') || 'pin_vir'
    
    const result = await sql`SELECT valor FROM configuracion WHERE clave = ${clave}`
    if (result.rows.length === 0) {
      return NextResponse.json({ ok: true, valor: null })
    }
    return NextResponse.json({ ok: true, valor: result.rows[0].valor })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const { clave, valor } = await request.json()
    if (!clave || !valor) return NextResponse.json({ ok: false, error: 'Faltan datos.' }, { status: 400 })

    await sql`
      INSERT INTO configuracion (clave, valor) 
      VALUES (${clave}, ${valor}) 
      ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW()
    `
    return NextResponse.json({ ok: true, message: 'Configuración actualizada' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
