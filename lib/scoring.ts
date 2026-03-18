// lib/scoring.ts

export interface IndicadorCurso {
  curso_id: number
  curso_nombre: string
  mes: number
  anio: number
  tiene_var: boolean      // true si hay al menos 1 VAR registrado
  tiene_indicadores: boolean // true si se cargaron indicadores ese mes
  var_total: number
  var_resueltos: number
  actas: number
  ice_puntos: number
  limpieza: number | null
  uniforme: string | null
  puntualidad: number | null
  asistencia: number | null
  interv_tempranas: number
  situaciones_previas: number
  pct_aprobados: number | null
}

export interface PuntajeDetalle {
  curso_id: number
  curso_nombre: string
  mes: number
  anio: number
  puntaje_resolutivo: number
  puntaje_formativo: number
  puntaje_preventivo: number
  puntaje_academico: number
  puntaje_total: number
  pct_var_resueltos: number
  tiene_datos: boolean
}

export function calcularPuntaje(ind: IndicadorCurso): PuntajeDetalle {
  const tiene_datos = ind.tiene_var || ind.tiene_indicadores

  // Si no hay ningún dato cargado para este curso este mes → todo 0
  if (!tiene_datos) {
    return {
      curso_id: ind.curso_id,
      curso_nombre: ind.curso_nombre,
      mes: ind.mes,
      anio: ind.anio,
      puntaje_resolutivo: 0,
      puntaje_formativo: 0,
      puntaje_preventivo: 0,
      puntaje_academico: 0,
      puntaje_total: 0,
      pct_var_resueltos: 0,
      tiene_datos: false,
    }
  }

  // ---- DIMENSIÓN RESOLUTIVA (30 pts) ----
  let resolutivo = 0
  let pct_var = 0

  if (ind.tiene_var) {
    // Solo calcular VAR si hay registros reales
    pct_var = ind.var_total > 0 ? Math.round((ind.var_resueltos / ind.var_total) * 100) : 0
    resolutivo += Math.round((pct_var / 100) * 15)
  }

  if (ind.tiene_indicadores) {
    // Actas (solo si se cargaron indicadores)
    if (ind.actas === 0) resolutivo += 10
    else if (ind.actas === 1) resolutivo += 6
    else if (ind.actas === 2) resolutivo += 3
    // ICE
    if (ind.ice_puntos === 0) resolutivo += 5
    else if (ind.ice_puntos <= 5) resolutivo += 3
    else if (ind.ice_puntos <= 10) resolutivo += 1
  }

  // ---- DIMENSIÓN FORMATIVA (30 pts) ----
  let formativo = 0

  if (ind.tiene_indicadores) {
    // Limpieza (solo si fue cargada)
    if (ind.limpieza !== null) {
      formativo += Math.round(((ind.limpieza - 1) / 4) * 8)
    }
    // Uniforme
    if (ind.uniforme === '>95%') formativo += 8
    else if (ind.uniforme === '85-95%') formativo += 5
    else if (ind.uniforme === '<85%') formativo += 2

    // Puntualidad
    if (ind.puntualidad !== null) {
      if (ind.puntualidad >= 95) formativo += 7
      else if (ind.puntualidad >= 85) formativo += 5
      else if (ind.puntualidad >= 75) formativo += 3
      else formativo += 1
    }
    // Asistencia
    if (ind.asistencia !== null) {
      if (ind.asistencia >= 95) formativo += 7
      else if (ind.asistencia >= 85) formativo += 5
      else if (ind.asistencia >= 75) formativo += 3
      else formativo += 1
    }
  }

  // ---- DIMENSIÓN PREVENTIVA (20 pts) ----
  let preventivo = 0
  if (ind.tiene_indicadores) {
    preventivo += Math.min(ind.interv_tempranas * 3, 10)
    preventivo += Math.min(ind.situaciones_previas * 3, 10)
  }

  // ---- DIMENSIÓN ACADÉMICA (20 pts) ----
  let academico = 0
  if (ind.tiene_indicadores && ind.pct_aprobados !== null) {
    if (ind.pct_aprobados >= 90) academico = 20
    else if (ind.pct_aprobados >= 80) academico = 15
    else if (ind.pct_aprobados >= 70) academico = 10
    else if (ind.pct_aprobados >= 60) academico = 6
    else academico = 2
  }

  const total = Math.min(resolutivo + formativo + preventivo + academico, 100)

  return {
    curso_id: ind.curso_id,
    curso_nombre: ind.curso_nombre,
    mes: ind.mes,
    anio: ind.anio,
    puntaje_resolutivo: Math.min(resolutivo, 30),
    puntaje_formativo: Math.min(formativo, 30),
    puntaje_preventivo: Math.min(preventivo, 20),
    puntaje_academico: Math.min(academico, 20),
    puntaje_total: total,
    pct_var_resueltos: pct_var,
    tiene_datos,
  }
}

export const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const TIPOS_SITUACION = [
  'Falta de respeto verbal',
  'Uso indebido del celular',
  'Conflicto entre pares',
  'Incumplimiento de acuerdo',
  'Situación de bullying',
  'Ciberbullying / redes sociales',
  'Agresión física leve',
  'Otro',
]

export const TIPOS_REPARACION = [
  'Disculpa explícita',
  'Compromiso escrito',
  'Acción concreta',
  'Servicio al curso',
  'Otro',
]

export const INTERVINIENTES = [
  'Preceptor/a',
  'Docente',
  'Orientación',
  'Delegado/a',
  'Equipo directivo',
]
