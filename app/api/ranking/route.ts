export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'
import { calcularPuntajeMensual, calcularPuntajeAcademico, getMesPeriodo } from '@/lib/scoring'

const CURSOS_DEFAULT = [
  '1°1°','1°2°','1°3°','2°1°','2°2°','2°3°',
  '3°1°','3°2°','3°3°','4°1°','4°2°','4°3°','5°1°','5°2°','5°3°'
].map((nombre, i) => ({ id: i + 1, nombre }))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mes     = parseInt(searchParams.get('mes')  || String(new Date().getMonth() + 1))
  const anio    = parseInt(searchParams.get('anio') || String(new Date().getFullYear()))
  const modo    = searchParams.get('modo') || 'mensual'
  const periodo = parseInt(searchParams.get('periodo') || (new Date().getMonth() < 7 ? '1' : '2'))

  const sql = await getSQL()
  if (!sql) {
    const ranking = CURSOS_DEFAULT.map(c => ({
      curso_id: c.id, curso_nombre: c.nombre, mes, anio,
      puntaje_total: 0, puntaje_resolutivo: 0, puntaje_formativo: 0,
      puntaje_campo: 0, puntaje_academico: 0, pct_var_resueltos: 0,
      campo_bonus: 0, tiene_datos: false
    }))
    return NextResponse.json({ ranking, mes, anio })
  }

  try {
    const cursosResult = await sql`SELECT * FROM cursos ORDER BY anio, division`
    const cursos = cursosResult.rows

    // ── MODO PERÍODO ACADÉMICO ──
    if (modo === 'periodo') {
      const meses = getMesPeriodo(periodo)
      const indResult = await sql`
        SELECT DISTINCT ON (curso_id) curso_id, pct_aprobados
        FROM indicadores
        WHERE anio = ${anio} AND mes = ANY(${meses}) AND pct_aprobados IS NOT NULL
        ORDER BY curso_id, mes DESC
      `
      const indMap = new Map(indResult.rows.map((r: any) => [r.curso_id, r]))
      const ranking = cursos.map((curso: any) => {
        const ind: any = indMap.get(curso.id) || null
        const pct = ind ? parseFloat(ind.pct_aprobados) : null
        return {
          curso_id: curso.id, curso_nombre: curso.nombre,
          pct_aprobados: pct, puntaje_academico: calcularPuntajeAcademico(pct),
          tiene_datos: pct !== null,
        }
      }).sort((a: any, b: any) => {
        if (!a.tiene_datos && !b.tiene_datos) return 0
        if (!a.tiene_datos) return 1
        if (!b.tiene_datos) return -1
        return b.puntaje_academico - a.puntaje_academico
      })
      return NextResponse.json({ ranking, periodo, anio, modo: 'periodo' })
    }

    // ── MODO MENSUAL ──
    const varResult = await sql`
      SELECT curso_id,
        COUNT(*)::int as var_total,
        SUM(CASE WHEN resuelto = true THEN 1 ELSE 0 END)::int as var_resueltos
      FROM var_registros
      WHERE mes = ${mes} AND anio = ${anio}
      GROUP BY curso_id
    `
    const varMap = new Map(varResult.rows.map((r: any) => [r.curso_id, r]))

    const indResult = await sql`SELECT * FROM indicadores WHERE mes = ${mes} AND anio = ${anio}`
    const indMap = new Map(indResult.rows.map((r: any) => [r.curso_id, r]))

    // Campo positivo: suma de puntos del mes por curso
    const campoResult = await sql`
      SELECT curso_id, SUM(puntos)::int as total_puntos, COUNT(*)::int as total_acciones
      FROM campo_positivo
      WHERE mes = ${mes} AND anio = ${anio}
      GROUP BY curso_id
    `
    const campoMap = new Map(campoResult.rows.map((r: any) => [r.curso_id, r]))

    const ranking = cursos.map((curso: any) => {
      const varData:   any = varMap.get(curso.id)   || null
      const indData:   any = indMap.get(curso.id)   || null
      const campoData: any = campoMap.get(curso.id) || null

      const puntaje = calcularPuntajeMensual({
        curso_id: curso.id, curso_nombre: curso.nombre, mes, anio,
        tiene_var:         !!varData,
        tiene_indicadores: !!indData,
        var_total:    varData?.var_total    ?? 0,
        var_resueltos:varData?.var_resueltos?? 0,
        actas:        indData?.actas        ?? 0,
        ice_puntos:   indData?.ice_puntos   ?? 0,
        limpieza:     indData?.limpieza     ?? null,
        uniforme:     indData?.uniforme     ?? null,
        asistencia:   indData?.asistencia   !== null && indData?.asistencia !== undefined ? parseFloat(indData.asistencia) : null,
        pct_aprobados: null,
        campo_bonus:  campoData?.total_puntos ?? 0,
      })

      return {
        ...puntaje,
        campo_acciones: campoData?.total_acciones ?? 0,
      }
    })

    ranking.sort((a: any, b: any) => {
      if (!a.tiene_datos && !b.tiene_datos) return 0
      if (!a.tiene_datos) return 1
      if (!b.tiene_datos) return -1
      return b.puntaje_total - a.puntaje_total
    })

    return NextResponse.json({ ranking, mes, anio, modo: 'mensual' })
  } catch (e: any) {
    console.error('Ranking error:', e)
    return NextResponse.json({ ranking: [], mes, anio, error: e.message })
  }
}
