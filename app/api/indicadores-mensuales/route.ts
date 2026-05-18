export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export interface IndicadorMensual {
  id: string
  curso: string
  mes: number
  anio: number
  quita_convivencia: number
  quita_var: number
  derivados_consejo: number
  asistencia_pct: number
  uniforme_pct: number
  acciones_positivas: number
  registrado_por: string
  fecha_registro: string
}

// In-memory store — reemplazar con DB:
// await sql`INSERT INTO indicadores_mensuales (...) VALUES (...) ON CONFLICT (id) DO UPDATE SET ...`
const store: IndicadorMensual[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mes   = searchParams.get('mes')
  const anio  = Number(searchParams.get('anio') || new Date().getFullYear())
  const curso = searchParams.get('curso')

  let data = store.filter(r => r.anio === anio)
  if (mes)   data = data.filter(r => r.mes === Number(mes))
  if (curso) data = data.filter(r => r.curso === curso)

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    curso, mes, anio,
    quita_convivencia, quita_var, derivados_consejo,
    asistencia_pct, uniforme_pct, acciones_positivas,
    registrado_por,
  } = body

  if (!curso || !mes) {
    return NextResponse.json({ ok: false, error: 'Curso y mes son requeridos.' }, { status: 400 })
  }

  const anioFinal = Number(anio ?? new Date().getFullYear())
  const registro: IndicadorMensual = {
    id: `${curso}-${mes}-${anioFinal}`,
    curso,
    mes: Number(mes),
    anio: anioFinal,
    quita_convivencia:  Number(quita_convivencia)  || 0,
    quita_var:          Number(quita_var)           || 0,
    derivados_consejo:  Number(derivados_consejo)   || 0,
    asistencia_pct:     Number(asistencia_pct)      || 0,
    uniforme_pct:       Number(uniforme_pct)        || 0,
    acciones_positivas: Number(acciones_positivas)  || 0,
    registrado_por:     registrado_por ?? 'preceptora',
    fecha_registro:     new Date().toISOString(),
  }

  const idx = store.findIndex(r => r.id === registro.id)
  if (idx >= 0) store[idx] = registro
  else store.push(registro)

  return NextResponse.json({ ok: true, id: registro.id })
}
