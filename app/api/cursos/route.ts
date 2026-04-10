export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

const CURSOS_DEFAULT = [
  '1°1°','1°2°','1°3°','1°4°','1°5°',
  '2°1°','2°2°','2°3°','2°4°','2°5°',
  '3°1°','3°2°','3°3°','3°4°','3°5°',
  '4°1°','4°2°','4°3°','4°4°',
  '5°1°','5°2°','5°3°','5°4°',
].map((nombre, i) => ({ id: i + 1, nombre }))

export async function GET() {
  const sql = await getSQL()
  if (!sql) return NextResponse.json(CURSOS_DEFAULT)
  try {
    const result = await sql`SELECT * FROM cursos ORDER BY anio, division`
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json(CURSOS_DEFAULT)
  }
}
