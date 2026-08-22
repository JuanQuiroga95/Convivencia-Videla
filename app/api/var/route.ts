export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL, getDB } from '@/lib/db'
import { CATEGORIAS_VIR, estadoDesdeResultado, serializarLista } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  const sql = await getSQL()
  if (!sql) return NextResponse.json({ ok: false, error: 'Base de datos no configurada.' }, { status: 503 })
  try {
    const body = await request.json()
    const {
      curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino,
      nombre_activador, estudiantes_involucrados, desc_mediacion, pin, estado,
      intervenciones_previas, intervencion_otra, respuesta_estudiante, resultado,
    } = body
    if (!nombre_activador || nombre_activador.trim().length < 3) {
      return NextResponse.json({ ok: false, error: 'El nombre del activador es obligatorio.' }, { status: 400 })
    }
    if (!pin) {
      return NextResponse.json({ ok: false, error: 'El PIN de autorización es obligatorio.' }, { status: 400 })
    }

    const intervencionesLista: string[] = Array.isArray(intervenciones_previas)
      ? intervenciones_previas.map((i: any) => String(i))
      : []
    const esPositivo = !!CATEGORIAS_VIR.find(c => c.id === categoria_id)?.esPositivo
    if (!esPositivo && intervencionesLista.length === 0) {
      return NextResponse.json({ ok: false, error: 'Registrá al menos una intervención previa realizada antes de activar el VIR.' }, { status: 400 })
    }
    const respuestasLista: string[] = Array.isArray(respuesta_estudiante)
      ? respuesta_estudiante.map((r: any) => String(r))
      : []

    // Verificar PIN
    const pinRes = await sql`SELECT valor FROM configuracion WHERE clave = 'pin_vir'`
    const pinCorrecto = pinRes.rows.length > 0 ? pinRes.rows[0].valor : '1240'
    if (pin !== pinCorrecto) {
      return NextResponse.json({ ok: false, error: 'PIN de autorización incorrecto.' }, { status: 401 })
    }
    const now = new Date()
    // El resultado elegido define el estado del circuito y el booleano `resuelto`
    // (conducta -> intervención -> oportunidad -> VIR -> reparación o escalamiento).
    const derivado = estadoDesdeResultado(resultado, !!resuelto)
    const estadoFinal = estado || derivado.estado
    const resueltoFinal = resultado ? derivado.resuelto : !!resuelto
    await sql`INSERT INTO var_registros
      (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador,
       estudiantes_involucrados, desc_mediacion, intervenciones_previas, intervencion_otra,
       respuesta_estudiante, resultado, mes, anio, estado)
      VALUES (
        ${curso_id},
        ${categoria_id || null},
        ${tipo_situacion},
        ${resueltoFinal},
        ${tipo_reparacion || null},
        ${intervino},
        ${nombre_activador.trim()},
        ${estudiantes_involucrados || null},
        ${desc_mediacion || null},
        ${serializarLista(intervencionesLista)},
        ${intervencion_otra || null},
        ${serializarLista(respuestasLista)},
        ${resultado || null},
        ${now.getMonth() + 1},
        ${now.getFullYear()},
        ${estadoFinal}
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
    const estado = searchParams.get('estado')
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
    if (estado) {
      pCount++
      q += ` AND v.estado = $${pCount}`
      values.push(estado)
    }
    const resultadoFiltro = searchParams.get('resultado')
    if (resultadoFiltro) {
      pCount++
      q += ` AND v.resultado = $${pCount}`
      values.push(resultadoFiltro)
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
