// lib/scoring.ts

export interface IndicadorCurso {
  curso_id: number
  curso_nombre: string
  mes: number
  anio: number
  tiene_var: boolean
  tiene_indicadores: boolean
  var_total: number
  var_resueltos: number
  actas: number
  ice_puntos: number
  limpieza: number | null
  uniforme: string | null
  asistencia: number | null
  pct_aprobados: number | null
  // bonus campo positivo (suma de puntos del mes)
  campo_bonus: number
}

export interface PuntajeDetalle {
  curso_id: number
  curso_nombre: string
  mes: number
  anio: number
  puntaje_resolutivo: number
  puntaje_formativo: number
  puntaje_campo: number      // bonus campo positivo
  puntaje_academico: number
  puntaje_total: number
  pct_var_resueltos: number
  tiene_datos: boolean
}

// ── CÁLCULO MENSUAL (convivencia + hábitos + aportes, sin académico) ──────────
export function calcularPuntajeMensual(ind: IndicadorCurso): PuntajeDetalle {
  // Todos los cursos arrancan con 40 pts de convivencia → siempre tienen datos
  const tiene_datos = true

  // ---- CONVIVENCIA (40 pts BASE, VIRs restan) ----
  // Todos arrancan con 40. Cada VIR resta: -2 si resuelto, -5 si no resuelto.
  // Actas e ICE NO influyen en este sistema, van por afuera.
  let resolutivo = 40
  let pct_var = 0
  if (ind.tiene_var && ind.var_total > 0) {
    const noResueltos = ind.var_total - ind.var_resueltos
    pct_var = Math.round((ind.var_resueltos / ind.var_total) * 100)

    // -2 pts por cada VIR resuelto
    resolutivo -= ind.var_resueltos * 2

    // -5 pts por cada VIR no resuelto (escalado)
    resolutivo -= noResueltos * 5

    resolutivo = Math.max(resolutivo, 0) // no puede ser negativo
  }

  // ---- HÁBITOS INSTITUCIONALES (40 pts, cargados por preceptoras a fin de mes) ----
  // Limpieza hasta 14 + Uniforme hasta 14 + Asistencia hasta 12 = 40
  let formativo = 0
  if (ind.tiene_indicadores) {
    if (ind.limpieza !== null) formativo += Math.round(((ind.limpieza - 1) / 4) * 14)
    if (ind.uniforme === '>95%') formativo += 14
    else if (ind.uniforme === '85-95%') formativo += 8
    else if (ind.uniforme === '<85%') formativo += 3
    if (ind.asistencia !== null) {
      if (ind.asistencia >= 95) formativo += 12
      else if (ind.asistencia >= 85) formativo += 8
      else if (ind.asistencia >= 75) formativo += 5
      else formativo += 2
    }
  }

  // ---- APORTES A LA CONVIVENCIA (máx 20 pts por mes) ----
  const campo = Math.min(ind.campo_bonus, 20)

  // Total: convivencia (40 base - deducciones) + hábitos (hasta 40) + aportes (hasta 20) = hasta 100
  const total = Math.min(resolutivo + formativo + campo, 100)

  return {
    curso_id: ind.curso_id, curso_nombre: ind.curso_nombre,
    mes: ind.mes, anio: ind.anio,
    puntaje_resolutivo: Math.min(resolutivo, 40),
    puntaje_formativo:  Math.min(formativo, 40),
    puntaje_campo:      campo,
    puntaje_academico:  0,
    puntaje_total:      total,
    pct_var_resueltos:  pct_var,
    tiene_datos,
  }
}

// ── CÁLCULO ACADÉMICO POR PERÍODO ────────────────────────────────────────────
export function calcularPuntajeAcademico(pct_aprobados: number | null): number {
  if (pct_aprobados === null) return 0
  if (pct_aprobados >= 90) return 20
  if (pct_aprobados >= 80) return 15
  if (pct_aprobados >= 70) return 10
  if (pct_aprobados >= 60) return 6
  return 2
}

// ── MESES POR PERÍODO ────────────────────────────────────────────────────────
export function getMesPeriodo(periodo: number): number[] {
  return periodo === 1 ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12]
}
export function getPeriodoLabel(p: number): string {
  return p === 1 ? 'Período 1 (Enero–Julio)' : 'Período 2 (Agosto–Diciembre)'
}
export function getPeriodoActual(): number {
  return new Date().getMonth() < 7 ? 1 : 2
}

// ── CONSTANTES ───────────────────────────────────────────────────────────────
export const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const TIPOS_ACCION_CAMPO = [
  'Participación en actos escolares',
  'Representación institucional en actividades externas',
  'Proyecto solidario',
  'Producción institucional (flyer, campaña, streaming)',
  'Propuesta del curso (ej: día del niño, actividad interna)',
]

export const PUNTOS_CAMPO_OPCIONES = [2, 4, 6, 8, 10]

export interface CategoriaVIR {
  id: string
  label: string
  color: string
  situaciones: string[]
  esPositivo?: boolean
}

export const CATEGORIAS_VIR: CategoriaVIR[] = [
  {
    id: 'pares', label: '🟢 Interacción entre Pares', color: '#2D7A4F',
    situaciones: [
      'Esconder materiales de estudio',
      'Romper materiales de estudio',
      'Conflicto verbal entre estudiantes',
      'Hostigamiento (burla, provocación, empujones)',
    ]
  },
  {
    id: 'docente', label: '🟠 Relación con Docente / Preceptor', color: '#E85D04',
    situaciones: [
      'Desobediencia a indicaciones',
      'Respuesta verbal inadecuada',
      'Ignorar consignas de trabajo en forma reiterada',
    ]
  },
  {
    id: 'entorno', label: '🟣 Cuidado del Entorno', color: '#7C3AED',
    situaciones: [
      'Desorden del espacio de trabajo',
      'Suciedad del espacio',
      'Deterioro del mobiliario',
      'Intervención sobre superficies (rayar, pintar)',
      'Uso inadecuado de materiales',
    ]
  },
  {
    id: 'clase', label: '🔵 Relación con la Clase', color: '#1D4ED8',
    situaciones: [
      'Interrupción reiterada de la clase',
      'Uso indebido del celular',
      'Ingreso tardío al aula (posterior al timbre)',
      'No realización de la actividad en el momento',
    ]
  },
]

export const TIPOS_REPARACION_POR_CATEGORIA: Record<string, string[]> = {
  pares:   ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  docente: ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  entorno: ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
  clase:   ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada'],
}

export const TIPOS_REPARACION = ['Disculpa explícita', 'Acción reparadora concreta', 'Reflexión guiada']
export const INTERVINIENTES = ['Preceptor/a', 'Docente', 'SOE']
export const TIPOS_SITUACION  = CATEGORIAS_VIR.flatMap(c => c.situaciones)

// ── TURNOS ───────────────────────────────────────────────────────────────────
export const TURNOS = [
  { id: 'manana', label: 'Turno Mañana', emoji: '🌅', anios: [1, 2], sub: '1° y 2° año' },
  { id: 'tarde',  label: 'Turno Tarde',  emoji: '🌇', anios: [3, 4, 5], sub: '3°, 4° y 5° año' },
]

export function getTurno(cursoNombre: string): 'manana' | 'tarde' {
  // Curso nombre es tipo "1°1°", "3°2°" etc. — el primer número es el año
  const anio = parseInt(cursoNombre.charAt(0))
  return anio <= 2 ? 'manana' : 'tarde'
}

// ── PROCESO VIR: INTERVENCIÓN PREVIA · RESPUESTA · RESULTADO ─────────────────
// Basado en "Síntesis del análisis de los registros VIR" (junio–agosto 2026).
// Lógica institucional: conducta → intervención → oportunidad de modificar →
// VIR → reparación o escalamiento.

export interface GrupoIntervencion {
  id: string
  label: string
  color: string
  opciones: string[]
}

export const OPCION_INTERVENCION_OTRA = 'Otra (especificar)'

export const INTERVENCIONES_PREVIAS: GrupoIntervencion[] = [
  {
    id: 'advertencia', label: 'Advertencia / llamado de atención', color: '#E85D04',
    opciones: [
      'Advertencia verbal sobre la conducta',
      'Recordatorio de la norma o acuerdo de convivencia',
      'Pedido directo de modificar o cesar la conducta',
      'Señal o llamado de atención preventivo',
    ],
  },
  {
    id: 'dialogo', label: 'Diálogo reflexivo con el estudiante', color: '#2D7A4F',
    opciones: [
      'Diálogo individual y breve con el estudiante',
      'Pregunta reflexiva: qué está ocurriendo / cómo está afectando a otros',
      'Invitación a reconocer el impacto de su conducta',
      'Oportunidad para que el estudiante explique lo sucedido',
    ],
  },
  {
    id: 'mediacion', label: 'Mediación entre las partes', color: '#7C3AED',
    opciones: [
      'Propuesta de resolver la situación mediante el diálogo',
      'Invitación a escuchar a la otra parte',
    ],
  },
  {
    id: 'reorganizacion', label: 'Reorganización del espacio o la actividad', color: '#1D4ED8',
    opciones: [
      'Cambio de ubicación dentro del aula, cuando resulte pertinente',
      'Pausa o separación momentánea de la situación de conflicto',
      'Reorganización del grupo o de la actividad para disminuir el conflicto',
    ],
  },
  {
    id: 'acuerdo', label: 'Acuerdos y colaboración del grupo', color: '#0F766E',
    opciones: [
      'Acuerdo verbal inmediato para continuar la clase',
      'Solicitud de colaboración de un compañero/delegado, cuando sea apropiado y no lo exponga',
    ],
  },
  {
    id: 'institucional', label: 'Intervención institucional', color: '#C1121F',
    opciones: [
      'Solicitud de reparación',
      'Intervención de preceptoría',
      'Intervención de SOE',
      'Comunicación a la familia',
      OPCION_INTERVENCION_OTRA,
    ],
  },
]

export const INTERVENCIONES_PREVIAS_FLAT = INTERVENCIONES_PREVIAS.flatMap(g => g.opciones)

export interface OpcionRespuesta { id: string; label: string; tono: 'positivo' | 'intermedio' | 'negativo' }

export const RESPUESTAS_ESTUDIANTE: OpcionRespuesta[] = [
  { id: 'modifico',           label: 'Modificó la conducta',                 tono: 'positivo' },
  { id: 'momentaneo',         label: 'Modificó momentáneamente y reincidió', tono: 'intermedio' },
  { id: 'continuo',           label: 'Continuó con la conducta',             tono: 'negativo' },
  { id: 'reconocio',          label: 'Reconoció lo ocurrido',                tono: 'positivo' },
  { id: 'no_reconocio',       label: 'No reconoció lo ocurrido',             tono: 'negativo' },
  { id: 'acepto_reparar',     label: 'Aceptó reparar',                       tono: 'positivo' },
  { id: 'rechazo_reparacion', label: 'Rechazó la reparación',                tono: 'negativo' },
]

export const RESPUESTAS_ESTUDIANTE_FLAT = RESPUESTAS_ESTUDIANTE.map(r => r.label)

export type EstadoVIR = 'Resuelto' | 'Pendiente' | 'Derivado_SOE' | 'Escalado_Consejo'

export interface OpcionResultado {
  id: string
  label: string
  estado: EstadoVIR
  resuelto: boolean
  requiereReparacion?: boolean
  color: string
  ayuda: string
}

export const RESULTADOS_VIR: OpcionResultado[] = [
  {
    id: 'resuelto', label: 'Resuelto', estado: 'Resuelto', resuelto: true, color: '#2D7A4F',
    ayuda: 'El estudiante reconoció lo ocurrido y la situación quedó cerrada.',
  },
  {
    id: 'resuelto_reparacion', label: 'Resuelto con reparación', estado: 'Resuelto', resuelto: true,
    requiereReparacion: true, color: '#2D7A4F',
    ayuda: 'Hubo reconocimiento y una reparación concreta ya realizada.',
  },
  {
    id: 'pendiente_reparacion', label: 'Pendiente de reparación', estado: 'Pendiente', resuelto: false, color: '#E85D04',
    ayuda: 'Se acordó una reparación que todavía no se concretó.',
  },
  {
    id: 'reincidencia', label: 'Reincidencia', estado: 'Pendiente', resuelto: false, color: '#E85D04',
    ayuda: 'La conducta se repite pese a las intervenciones previas.',
  },
  {
    id: 'derivado_soe', label: 'Requiere intervención de SOE / Preceptoría', estado: 'Derivado_SOE', resuelto: false, color: '#B45309',
    ayuda: 'La situación excede el aula y necesita acompañamiento institucional.',
  },
  {
    id: 'consejo', label: 'Escalar al Consejo de Convivencia', estado: 'Escalado_Consejo', resuelto: false, color: '#C1121F',
    ayuda: 'No hubo acuerdo, reconocimiento ni cumplimiento de lo acordado.',
  },
]

export const RESULTADOS_VIR_FLAT = RESULTADOS_VIR.map(r => r.label)

export function getResultado(label?: string | null): OpcionResultado | undefined {
  if (!label) return undefined
  return RESULTADOS_VIR.find(r => r.label === label || r.id === label)
}

export function estadoDesdeResultado(
  resultado?: string | null,
  fallbackResuelto = false
): { estado: EstadoVIR; resuelto: boolean } {
  const r = getResultado(resultado)
  if (!r) return { estado: fallbackResuelto ? 'Resuelto' : 'Pendiente', resuelto: fallbackResuelto }
  return { estado: r.estado, resuelto: r.resuelto }
}

export const ESTADOS_VIR: { id: EstadoVIR; label: string; color: string }[] = [
  { id: 'Resuelto',         label: 'Resuelto',                   color: '#2D7A4F' },
  { id: 'Pendiente',        label: 'Pendiente',                  color: '#E85D04' },
  { id: 'Derivado_SOE',     label: 'Derivado a SOE / Preceptoría', color: '#B45309' },
  { id: 'Escalado_Consejo', label: 'Escalado al Consejo',        color: '#C1121F' },
]

export function getEstadoInfo(estado?: string | null, resuelto?: boolean) {
  const e = ESTADOS_VIR.find(x => x.id === estado)
  if (e) return e
  return resuelto ? ESTADOS_VIR[0] : ESTADOS_VIR[1]
}

// Los campos multi-opción se guardan como JSON. Se admite el formato antiguo
// separado por barras verticales para no romper registros ya cargados.
export function parseLista(valor?: string | null): string[] {
  if (!valor) return []
  const raw = String(valor).trim()
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
    } catch {
      // formato inválido: se intenta el separador simple
    }
  }
  return raw.split('|').map(s => s.trim()).filter(Boolean)
}

export function serializarLista(items: string[]): string | null {
  const limpio = items.map(s => s.trim()).filter(Boolean)
  return limpio.length ? JSON.stringify(limpio) : null
}

// Secuencia institucional esperada, usada en la app para explicar el circuito.
export const SECUENCIA_VIR = [
  { paso: 1, titulo: 'Conducta',    detalle: 'Se identifica la conducta que afecta la convivencia.' },
  { paso: 2, titulo: 'Intervención', detalle: 'El adulto interviene: advertencia, diálogo, mediación o reorganización.' },
  { paso: 3, titulo: 'Oportunidad',  detalle: 'Se ofrece una oportunidad concreta de modificar la conducta.' },
  { paso: 4, titulo: 'VIR',          detalle: 'Si el estudiante decide continuar, se activa el VIR.' },
  { paso: 5, titulo: 'Reparación o escalamiento', detalle: 'Se repara y se cierra, o se escala según corresponda.' },
]
