export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'
import { calcularPuntaje } from '@/lib/scoring'

const CURSOS_DEFAULT = [
  '1°1°','1°2°','1°3°','2°1°','2°2°','2°3°',
  '3°1°','3°2°','3°3°','4°1°','4°2°','4°3°','5°1°','5°2°','5°3°'
].map((nombre, i) => ({ id: i + 1, nombre }))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mes = parseInt(searchParams.get('mes') || String(new Date().getMonth() + 1))
  const anio = parseInt(searchParams.get('anio') || String(new Date().getFullYear()))

  const sql = await getSQL()
  if (!sql) {
    const ranking = CURSOS_DEFAULT.map(c => ({
      curso_id: c.id, curso_nombre: c.nombre, mes, anio,
      puntaje_total: 0, puntaje_resolutivo: 0, puntaje_formativo: 0,
      puntaje_preventivo: 0, puntaje_academico: 0,
      pct_var_resueltos: 0, tiene_datos: false
    }))
    return NextResponse.json({ ranking, mes, anio })
  }

  try {
    const cursosResult = await sql`SELECT * FROM cursos ORDER BY anio, division`
    const cursos = cursosResult.rows

    // VAR: cursos que tienen al menos 1 registro este mes
    const varResult = await sql`
      SELECT
        curso_id,
        COUNT(*)::int as var_total,
        SUM(CASE WHEN resuelto = true THEN 1 ELSE 0 END)::int as var_resueltos
      FROM var_registros
      WHERE mes = ${mes} AND anio = ${anio}
      GROUP BY curso_id
    `
    const varMap = new Map(varResult.rows.map((r: any) => [r.curso_id, r]))

    // Indicadores: cursos que tienen fila cargada este mes
    const indResult = await sql`
      SELECT * FROM indicadores
      WHERE mes = ${mes} AND anio = ${anio}
    `
    const indMap = new Map(indResult.rows.map((r: any) => [r.curso_id, r]))

    const ranking = cursos.map((curso: any) => {
      const varData: any = varMap.get(curso.id) || null
      const indData: any = indMap.get(curso.id) || null

      const puntaje = calcularPuntaje({
        curso_id: curso.id,
        curso_nombre: curso.nombre,
        mes,
        anio,
        tiene_var: !!varData,
        tiene_indicadores: !!indData,
        var_total: varData?.var_total ?? 0,
        var_resueltos: varData?.var_resueltos ?? 0,
        actas: indData?.actas ?? 0,
        ice_puntos: indData?.ice_puntos ?? 0,
        limpieza: indData ? (indData.limpieza ?? null) : null,
        uniforme: indData ? (indData.uniforme ?? null) : null,
        puntualidad: indData ? (indData.puntualidad !== null ? parseFloat(indData.puntualidad) : null) : null,
        asistencia: indData ? (indData.asistencia !== null ? parseFloat(indData.asistencia) : null) : null,
        interv_tempranas: indData?.interv_tempranas ?? 0,
        situaciones_previas: indData?.situaciones_previas ?? 0,
        pct_aprobados: indData ? (indData.pct_aprobados !== null ? parseFloat(indData.pct_aprobados) : null) : null,
      })

      return puntaje
    })

    // Cursos sin datos van al final, los que tienen datos ordenados por puntaje
    ranking.sort((a: any, b: any) => {
      if (!a.tiene_datos && !b.tiene_datos) return 0
      if (!a.tiene_datos) return 1
      if (!b.tiene_datos) return -1
      return b.puntaje_total - a.puntaje_total
    })

    return NextResponse.json({ ranking, mes, anio })
  } catch (e: any) {
    console.error('Ranking error:', e)
    return NextResponse.json({ ranking: [], mes, anio, error: e.message })
  }
}
