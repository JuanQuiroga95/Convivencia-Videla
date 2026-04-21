export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { setupDatabase, setupUsuarios, getSQL } from '@/lib/db'

export async function GET() {
  try {
    await setupDatabase()
    await setupUsuarios()
    return NextResponse.json({ ok: true, message: 'Base de datos configurada correctamente ✓' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

// Migración: agrega los 8 cursos faltantes (1°4°, 1°5°, 2°4°, 2°5°, 3°4°, 3°5°, 4°4°, 5°4°)
// sin tocar los 15 existentes ni ningún dato ya cargado
export async function POST() {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const nuevos = [
      { nombre: '1°4°', division: '4', anio: 1 },
      { nombre: '1°5°', division: '5', anio: 1 },
      { nombre: '2°4°', division: '4', anio: 2 },
      { nombre: '2°5°', division: '5', anio: 2 },
      { nombre: '3°4°', division: '4', anio: 3 },
      { nombre: '3°5°', division: '5', anio: 3 },
      { nombre: '4°4°', division: '4', anio: 4 },
      { nombre: '5°4°', division: '4', anio: 5 },
    ]
    let agregados = 0
    for (const c of nuevos) {
      const res = await sql`
        INSERT INTO cursos (nombre, division, anio)
        VALUES (${c.nombre}, ${c.division}, ${c.anio})
        ON CONFLICT (nombre) DO NOTHING
      `
      if (res.rowCount > 0) agregados++
    }
    const total = await sql`SELECT COUNT(*) as count FROM cursos`
    return NextResponse.json({
      ok: true,
      message: `${agregados} cursos nuevos agregados. Total en DB: ${total.rows[0].count} cursos.`
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
