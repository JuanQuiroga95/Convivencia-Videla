export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { setupDatabase, setupUsuarios } from '@/lib/db'

export async function GET() {
  try {
    await setupDatabase()
    await setupUsuarios()
    return NextResponse.json({ ok: true, message: 'Base de datos configurada correctamente ✓' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
