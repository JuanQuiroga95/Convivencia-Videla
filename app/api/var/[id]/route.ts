import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const { id } = params
    if (!id) return NextResponse.json({ ok: false, error: 'ID es obligatorio.' }, { status: 400 })
    
    await sql`DELETE FROM var_registros WHERE id = ${id}`
    
    return NextResponse.json({ ok: true, message: 'Registro eliminado exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
