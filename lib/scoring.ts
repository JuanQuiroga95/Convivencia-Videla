// lib/scoring.ts

export interface IndicadorCurso {
  curso_id: number
  curso_nombre: string
  periodo: number  // 1 = enero-julio, 2 = agosto-diciembre
  anio: number
  tiene_var: boolean
  tiene_indicadores: boolean
  var_total: number
  var_resueltos: number
  actas: number
  ice_puntos: number
  limpieza: number | null
  uniforme: string | null
  puntualidad: number | null
  asistencia: number | null
  pct_aprobados: number | null
}

export interface PuntajeDetalle {
  curso_id: number
  curso_nombre: string
  periodo: number
  anio: number
  puntaje_resolutivo: number
  puntaje_formativo: number
  puntaje_academico: number
  puntaje_total: number
  pct_var_resueltos: number
  tiene_datos: boolean
}

export function calcularPuntaje(ind: IndicadorCurso): PuntajeDetalle {
  const tiene_datos = ind.tiene_var || ind.tiene_indicadores

  if (!tiene_datos) {
    return {
      curso_id: ind.curso_id,
      curso_nombre: ind.curso_nombre,
      periodo: ind.periodo,
      anio: ind.anio,
      puntaje_resolutivo: 0,
      puntaje_formativo: 0,
      puntaje_academico: 0,
      puntaje_total: 0,
      pct_var_resueltos: 0,
      tiene_datos: false,
    }
  }

  // ---- DIMENSIÓN RESOLUTIVA (40 pts) ----
  let resolutivo = 0
  let pct_var = 0

  if (ind.tiene_var) {
    pct_var = ind.var_total > 0 ? Math.round((ind.var_resueltos / ind.var_total) * 100) : 0
    resolutivo += Math.round((pct_var / 100) * 20)
  }

  if (ind.tiene_indicadores) {
    if (ind.actas === 0) resolutivo += 12
    else if (ind.actas === 1) resolutivo += 8
    else if (ind.actas === 2) resolutivo += 4
    if (ind.ice_puntos === 0) resolutivo += 8
    else if (ind.ice_puntos <= 5) resolutivo += 5
    else if (ind.ice_puntos <= 10) resolutivo += 2
  }

  // ---- DIMENSIÓN FORMATIVA (40 pts) ----
  let formativo = 0

  if (ind.tiene_indicadores) {
    if (ind.limpieza !== null) {
      formativo += Math.round(((ind.limpieza - 1) / 4) * 10)
    }
    if (ind.uniforme === '>95%') formativo += 10
    else if (ind.uniforme === '85-95%') formativo += 6
    else if (ind.uniforme === '<85%') formativo += 2

    if (ind.puntualidad !== null) {
      if (ind.puntualidad >= 95) formativo += 10
      else if (ind.puntualidad >= 85) formativo += 7
      else if (ind.puntualidad >= 75) formativo += 4
      else formativo += 1
    }
    if (ind.asistencia !== null) {
      if (ind.asistencia >= 95) formativo += 10
      else if (ind.asistencia >= 85) formativo += 7
      else if (ind.asistencia >= 75) formativo += 4
      else formativo += 1
    }
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

  const total = Math.min(resolutivo + formativo + academico, 100)

  return {
    curso_id: ind.curso_id,
    curso_nombre: ind.curso_nombre,
    periodo: ind.periodo,
    anio: ind.anio,
    puntaje_resolutivo: Math.min(resolutivo, 40),
    puntaje_formativo: Math.min(formativo, 40),
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

export function getMesPeriodo(periodo: number): number[] {
  if (periodo === 1) return [1, 2, 3, 4, 5, 6, 7]
  return [8, 9, 10, 11, 12]
}

export function getPeriodoLabel(periodo: number): string {
  return periodo === 1 ? 'Período 1 (Enero–Julio)' : 'Período 2 (Agosto–Diciembre)'
}

// ========== CATEGORÍAS VIR ==========

export const CATEGORIAS_VIR = [
  {
    id: 'pares',
    label: '🟢 Interacción entre Pares',
    color: '#2D7A4F',
    situaciones: [
      'Esconder materiales de estudio',
      'Romper materiales de estudio',
      'Conflicto verbal entre estudiantes',
      'Hostigamiento (burla, provocación, empujones)',
    ]
  },
  {
    id: 'docente',
    label: '🟠 Relación con Docente / Preceptor',
    color: '#E85D04',
    situaciones: [
      'Desobediencia a indicaciones',
      'Respuesta verbal inadecuada',
      'Ignorar consignas de trabajo en forma reiterada',
    ]
  },
  {
    id: 'entorno',
    label: '🟣 Cuidado del Entorno',
    color: '#7C3AED',
    situaciones: [
      'Desorden del espacio de trabajo',
      'Suciedad del espacio',
      'Deterioro del mobiliario',
      'Intervención sobre superficies (rayar, pintar)',
      'Uso inadecuado de materiales',
    ]
  },
  {
    id: 'clase',
    label: '🔵 Relación con la Clase',
    color: '#1D4ED8',
    situaciones: [
      'Interrupción reiterada de la clase',
      'Uso indebido del celular',
      'Ingreso tardío al aula (posterior al timbre)',
      'No realización de la actividad en el momento',
    ]
  },
  {
    id: 'campo',
    label: '🟡 Campo (Acciones Formativas Destacadas)',
    color: '#B45309',
    esPositivo: true,
    situaciones: [
      'Participación en actos escolares',
      'Representación institucional del curso o estudiantes',
      'Proyectos solidarios',
      'Producciones institucionales (flyers, campañas, streaming)',
      'Propuestas del curso (ej.: día del niño, actividades internas)',
    ]
  },
]

export const TIPOS_REPARACION_POR_CATEGORIA: Record<string, string[]> = {
  pares:   ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  docente: ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  entorno: ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  clase:   ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  campo:   [], // positivo, no tiene reparación
}

export const TIPOS_REPARACION = [
  'Disculpa explícita',
  'Acción reparadora concreta',
  'Reflexión guiada',
]

export const INTERVINIENTES = [
  'Preceptor/a',
  'Docente',
  'Orientación',
  'Delegado/a',
  'Equipo directivo',
]

// Kept for backward compat
export const TIPOS_SITUACION = CATEGORIAS_VIR.flatMap(c => c.situaciones)
