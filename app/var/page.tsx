'use client'
import { useState, useEffect, Fragment } from 'react'
import Nav from '@/components/Nav'
import { Shield, CheckCircle, AlertCircle, ChevronRight, User, Info } from 'lucide-react'
import {
  CATEGORIAS_VIR, TIPOS_REPARACION_POR_CATEGORIA, INTERVINIENTES,
  INTERVENCIONES_PREVIAS, OPCION_INTERVENCION_OTRA,
  RESPUESTAS_ESTUDIANTE, RESULTADOS_VIR, getResultado,
} from '@/lib/scoring'

const STEP_LABELS = ['Identificación', 'Intervención previa', 'Respuesta y resultado', 'Cierre']

const G = '#2D7A4F'   // green
const O = '#E85D04'   // orange
const R = '#C1121F'   // red

type ListField = 'intervenciones_previas' | 'respuesta_estudiante'

function Opcion({ tipo, name, label, ayuda, checked, color, onChange }: {
  tipo: 'checkbox' | 'radio'
  name?: string
  label: string
  ayuda?: string
  checked: boolean
  color: string
  onChange: () => void
}) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all"
      style={{
        background: checked ? `${color}14` : 'var(--bg-alt)',
        border: `1.5px solid ${checked ? color : 'var(--green-border)'}`,
      }}>
      <input type={tipo} name={name} checked={checked} onChange={onChange}
        style={{ accentColor: color, marginTop: '3px', flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: checked ? 600 : 400 }}>
        {label}
        {ayuda && (
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
            {ayuda}
          </span>
        )}
      </span>
    </label>
  )
}

export default function VIRPage() {
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [form, setForm] = useState({
    curso_id: '',
    categoria_id: '',
    tipo_situacion: '',
    estudiantes_involucrados: '',
    intervenciones_previas: [] as string[],
    intervencion_otra: '',
    respuesta_estudiante: [] as string[],
    resultado: '',
    tipo_reparacion: '',
    desc_mediacion: '',
    intervino: '',
    nombre_activador: '',
    pin: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok: boolean, message?: string, error?: string} | null>(null)
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    const params = new URLSearchParams(window.location.search)
    const curso = params.get('curso')
    if (curso) setForm(f => ({ ...f, curso_id: curso }))
  }, [])

  const resetForm = () => setForm({
    curso_id: '', categoria_id: '', tipo_situacion: '', estudiantes_involucrados: '',
    intervenciones_previas: [], intervencion_otra: '', respuesta_estudiante: [],
    resultado: '', tipo_reparacion: '', desc_mediacion: '',
    intervino: '', nombre_activador: '', pin: '',
  })

  const toggleLista = (campo: ListField, valor: string) =>
    setForm(f => ({
      ...f,
      [campo]: f[campo].includes(valor) ? f[campo].filter(v => v !== valor) : [...f[campo], valor],
    }))

  const categoriaActual = CATEGORIAS_VIR.find(c => c.id === form.categoria_id)
  const esPositivo = !!categoriaActual?.esPositivo
  const resultadoInfo = getResultado(form.resultado)
  const reparacionesDispo = form.categoria_id ? (TIPOS_REPARACION_POR_CATEGORIA[form.categoria_id] || []) : []
  const pidioOtra = form.intervenciones_previas.includes(OPCION_INTERVENCION_OTRA)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/var', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          curso_id: parseInt(form.curso_id),
          resuelto: esPositivo ? true : !!resultadoInfo?.resuelto,
          intervencion_otra: pidioOtra ? form.intervencion_otra : '',
          tipo_reparacion: resultadoInfo?.requiereReparacion ? form.tipo_reparacion : '',
        })
      })
      const data = await res.json()
      setResult(data)
      if (data.ok) {
        resetForm()
        setStep(1)
      }
    } catch {
      setResult({ ok: false, error: 'Error de conexión' })
    }
    setLoading(false)
  }

  const canNextStep1 = !!(form.curso_id && form.categoria_id && form.tipo_situacion)
  const canNextStep2 = esPositivo || (
    form.estudiantes_involucrados.trim().length > 0 &&
    form.intervenciones_previas.length > 0 &&
    (!pidioOtra || form.intervencion_otra.trim().length >= 3)
  )
  const canNextStep3 = esPositivo || (
    form.respuesta_estudiante.length > 0 &&
    !!form.resultado &&
    (!resultadoInfo?.requiereReparacion || reparacionesDispo.length === 0 || !!form.tipo_reparacion)
  )
  const canSubmit = !!form.intervino && form.nombre_activador.trim().length >= 3 && form.pin.length >= 4

  const sectionHeader = (text: string, color = G, nota?: string) => (
    <div style={{
      background: color,
      color: 'white',
      padding: '6px 14px',
      borderRadius: '6px 6px 0 0',
      fontFamily: 'var(--font-condensed)',
      letterSpacing: '0.1em',
      fontSize: '0.78rem',
      fontWeight: 700,
    }}>
      {text}
      {nota && <span style={{ display: 'block', letterSpacing: '0.02em', fontWeight: 400, fontSize: '0.72rem', opacity: 0.85 }}>{nota}</span>}
    </div>
  )

  const boxStyle = { border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }

  const resumenSituacion = (
    <div className="p-4 rounded-xl" style={{ background: 'var(--green-light)', border: '1.5px solid var(--green-border)' }}>
      <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SITUACIÓN REGISTRADA</div>
      <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>{form.tipo_situacion}</div>
      <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.85rem' }}>
        Curso: {cursos.find(c => String(c.id) === form.curso_id)?.nombre} · {categoriaActual?.label}
      </div>
    </div>
  )

  const resumenItems = ([
    ['Curso', cursos.find(c => String(c.id) === form.curso_id)?.nombre],
    ['Categoría', categoriaActual?.label],
    ['Situación', form.tipo_situacion],
    ['Estudiantes', form.estudiantes_involucrados],
    ['Intervención previa', form.intervenciones_previas.join(' · ')],
    ['Otra intervención', pidioOtra ? form.intervencion_otra : ''],
    ['Respuesta', form.respuesta_estudiante.join(' · ')],
    ['Resultado', esPositivo ? 'VIR positivo' : form.resultado],
    ['Reparación', resultadoInfo?.requiereReparacion ? form.tipo_reparacion : ''],
    ['Observaciones', form.desc_mediacion],
    ['Interviene', form.intervino],
    ['Activador', form.nombre_activador],
  ] as [string, string | undefined][]).filter(([, v]) => !!v) as [string, string][]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">
        {/* Header */}
        <div className="px-6 py-6" style={{
          background: 'var(--green-dark)',
          borderBottom: '3px solid var(--orange)'
        }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.2)' }}>
              <Shield size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                ACTIVAR VIR
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                Variable de Incidencia y Reparación
              </p>
            </div>
          </div>

          {/* Secuencia institucional */}
          <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.9)', fontSize: '0.76rem', letterSpacing: '0.06em' }}>
              CONDUCTA → INTERVENCIÓN → OPORTUNIDAD DE MODIFICAR → VIR → REPARACIÓN O ESCALAMIENTO
            </div>
            <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', marginTop: '2px' }}>
              El VIR registra un proceso de intervención, no solo lo que pasó.
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: step >= s ? 'var(--orange)' : 'rgba(255,255,255,0.15)',
                    color: step >= s ? 'white' : 'rgba(255,255,255,0.4)',
                    fontWeight: 700,
                  }}>
                  {s}
                </div>
                {s < 4 && <div className="w-8 h-px" style={{ background: step > s ? 'var(--orange)' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginLeft: '8px' }}>
              {STEP_LABELS[step - 1]}
            </span>
          </div>
        </div>

        <div className="px-6 py-6 max-w-lg">

          {/* Success */}
          {result?.ok && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3 slide-in" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.4)' }}>
              <CheckCircle size={20} style={{ color: G }} />
              <div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>VIR registrado correctamente</div>
                <button onClick={() => setResult(null)} style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Registrar otro →
                </button>
              </div>
            </div>
          )}

          {result && !result.ok && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(193,18,31,0.08)', border: '1px solid rgba(193,18,31,0.3)' }}>
              <AlertCircle size={20} style={{ color: R }} />
              <span style={{ fontFamily: 'var(--font-body)', color: R, fontSize: '0.9rem' }}>{result.error || result.message}</span>
            </div>
          )}

          {/* STEP 1 — Identificación */}
          {step === 1 && (
            <div className="space-y-4 slide-in">
              <div>
                {sectionHeader('CURSO')}
                <div style={boxStyle}>
                  <select className="input-videla" value={form.curso_id} onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                    <option value="">Seleccionar curso...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div>
                {sectionHeader('CATEGORÍA DE LA SITUACIÓN', O)}
                <div style={boxStyle}>
                  <div className="grid grid-cols-1 gap-2">
                    {CATEGORIAS_VIR.map(cat => (
                      <Opcion key={cat.id} tipo="radio" name="categoria" label={cat.label} color={G}
                        checked={form.categoria_id === cat.id}
                        onChange={() => setForm(f => ({ ...f, categoria_id: cat.id, tipo_situacion: '' }))} />
                    ))}
                  </div>
                </div>
              </div>

              {form.categoria_id && categoriaActual && (
                <div className="slide-in">
                  {sectionHeader('SITUACIÓN ESPECÍFICA', categoriaActual.color)}
                  <div style={boxStyle}>
                    <div className="grid grid-cols-1 gap-2">
                      {categoriaActual.situaciones.map(sit => (
                        <Opcion key={sit} tipo="radio" name="situacion" label={sit} color={O}
                          checked={form.tipo_situacion === sit}
                          onChange={() => setForm(f => ({ ...f, tipo_situacion: sit }))} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => setStep(2)} disabled={!canNextStep1} className="btn-gold w-full flex items-center justify-center gap-2">
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 — Intervención previa */}
          {step === 2 && (
            <div className="space-y-4 slide-in">
              {resumenSituacion}

              {esPositivo ? (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.4)' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>✓ Acción Formativa Positiva</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                    Esta categoría registra acciones destacadas. Se contabiliza como VIR positivo.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    {sectionHeader('ESTUDIANTE / S INVOLUCRADO / S', R)}
                    <div style={boxStyle}>
                      <input
                        type="text"
                        className="input-videla"
                        placeholder="Apellido y Nombre del o de los /as estudiantes"
                        value={form.estudiantes_involucrados}
                        onChange={e => setForm(f => ({ ...f, estudiantes_involucrados: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg flex gap-2" style={{ background: 'rgba(232,93,4,0.07)', border: '1px solid rgba(232,93,4,0.25)' }}>
                    <Info size={16} style={{ color: O, flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Llamar la atención no es lo mismo que mediar. Marcá lo que efectivamente hiciste
                      <strong> antes </strong> de activar el VIR: señalar la conducta, recordar el acuerdo
                      y dar una oportunidad concreta de modificarla.
                    </span>
                  </div>

                  <div>
                    {sectionHeader('INTERVENCIÓN PREVIA REALIZADA', O, 'Marcá todas las que correspondan (al menos una)')}
                    <div style={boxStyle}>
                      <div className="space-y-4">
                        {INTERVENCIONES_PREVIAS.map(grupo => (
                          <div key={grupo.id}>
                            <div style={{
                              fontFamily: 'var(--font-condensed)', fontSize: '0.75rem', letterSpacing: '0.08em',
                              color: grupo.color, fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase',
                            }}>
                              {grupo.label}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {grupo.opciones.map(op => (
                                <Opcion key={op} tipo="checkbox" label={op} color={grupo.color}
                                  checked={form.intervenciones_previas.includes(op)}
                                  onChange={() => toggleLista('intervenciones_previas', op)} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {pidioOtra && (
                        <div className="mt-4 slide-in">
                          <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                            ¿CUÁL FUE LA OTRA INTERVENCIÓN? *
                          </label>
                          <textarea
                            className="input-videla"
                            placeholder="Describí brevemente la intervención realizada..."
                            value={form.intervencion_otra}
                            onChange={e => setForm(f => ({ ...f, intervencion_otra: e.target.value }))}
                            rows={2}
                            style={{ resize: 'vertical' }}
                          />
                        </div>
                      )}

                      <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.78rem', marginTop: '10px', color: form.intervenciones_previas.length ? G : 'var(--text-muted)' }}>
                        {form.intervenciones_previas.length} intervención/es seleccionada/s
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button onClick={() => setStep(3)} disabled={!canNextStep2} className="btn-gold w-full flex items-center justify-center gap-2">
                Continuar <ChevronRight size={16} />
              </button>
              <button onClick={() => setStep(1)} className="btn-outline w-full">Atrás</button>
            </div>
          )}

          {/* STEP 3 — Respuesta del estudiante y resultado */}
          {step === 3 && (
            <div className="space-y-4 slide-in">
              {resumenSituacion}

              {!esPositivo && (
                <>
                  <div>
                    {sectionHeader('RESPUESTA DEL ESTUDIANTE', G, 'Qué pasó después de la intervención')}
                    <div style={boxStyle}>
                      <div className="grid grid-cols-1 gap-2">
                        {RESPUESTAS_ESTUDIANTE.map(r => (
                          <Opcion key={r.id} tipo="checkbox" label={r.label}
                            color={r.tono === 'positivo' ? G : r.tono === 'negativo' ? R : O}
                            checked={form.respuesta_estudiante.includes(r.label)}
                            onChange={() => toggleLista('respuesta_estudiante', r.label)} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    {sectionHeader('RESULTADO', O, 'Define el estado del VIR')}
                    <div style={boxStyle}>
                      <div className="grid grid-cols-1 gap-2">
                        {RESULTADOS_VIR.map(res => (
                          <Opcion key={res.id} tipo="radio" name="resultado" label={res.label} ayuda={res.ayuda}
                            color={res.color}
                            checked={form.resultado === res.label}
                            onChange={() => setForm(f => ({
                              ...f,
                              resultado: res.label,
                              tipo_reparacion: res.requiereReparacion ? f.tipo_reparacion : '',
                            }))} />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {resultadoInfo?.requiereReparacion && reparacionesDispo.length > 0 && (
                <div className="slide-in">
                  {sectionHeader('TIPO DE REPARACIÓN', G)}
                  <div style={boxStyle}>
                    <div className="grid grid-cols-1 gap-2">
                      {reparacionesDispo.map(tipo => (
                        <Opcion key={tipo} tipo="radio" name="reparacion" label={tipo} color={G}
                          checked={form.tipo_reparacion === tipo}
                          onChange={() => setForm(f => ({ ...f, tipo_reparacion: tipo }))} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(resultadoInfo?.estado === 'Escalado_Consejo' || resultadoInfo?.estado === 'Derivado_SOE') && (
                <div className="p-3 rounded-lg flex gap-2 slide-in" style={{ background: 'rgba(193,18,31,0.07)', border: '1px solid rgba(193,18,31,0.25)' }}>
                  <AlertCircle size={16} style={{ color: R, flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    El caso quedará visible en el historial de Preceptoría y del Equipo Directivo para su seguimiento.
                  </span>
                </div>
              )}

              <div>
                {sectionHeader('OBSERVACIONES', '#6B7280', 'Opcional: solo si algo no queda reflejado en las opciones')}
                <div style={boxStyle}>
                  <textarea
                    className="input-videla"
                    placeholder="Ej: detalle particular de la situación o del acuerdo alcanzado..."
                    value={form.desc_mediacion}
                    onChange={e => setForm(f => ({ ...f, desc_mediacion: e.target.value }))}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <button onClick={() => setStep(4)} disabled={!canNextStep3} className="btn-gold w-full flex items-center justify-center gap-2">
                Continuar <ChevronRight size={16} />
              </button>
              <button onClick={() => setStep(2)} className="btn-outline w-full">Atrás</button>
            </div>
          )}

          {/* STEP 4 — Cierre */}
          {step === 4 && (
            <div className="space-y-4 slide-in">
              <div>
                {sectionHeader('QUIEN ACTIVA EL VIR', O)}
                <div style={boxStyle}>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {INTERVINIENTES.map(i => (
                      <Opcion key={i} tipo="radio" name="intervino" label={i} color={G}
                        checked={form.intervino === i}
                        onChange={() => setForm(f => ({ ...f, intervino: i }))} />
                    ))}
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                      <User size={13} style={{ display: 'inline', marginRight: '4px', marginBottom: '-2px' }} />
                      NOMBRE Y APELLIDO DEL ACTIVADOR *
                    </label>
                    <input
                      type="text"
                      className="input-videla"
                      placeholder="Ej: María González"
                      value={form.nombre_activador}
                      onChange={e => setForm(f => ({ ...f, nombre_activador: e.target.value }))}
                      style={{ borderColor: form.nombre_activador.trim().length > 0 && form.nombre_activador.trim().length < 3 ? R : undefined }}
                    />
                    {form.nombre_activador.trim().length > 0 && form.nombre_activador.trim().length < 3 && (
                      <p style={{ fontFamily: 'var(--font-body)', color: R, fontSize: '0.78rem', marginTop: '4px' }}>
                        Ingresá nombre y apellido completo
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', marginTop: '12px' }}>
                      <Shield size={13} style={{ display: 'inline', marginRight: '4px', marginBottom: '-2px' }} />
                      PIN DE AUTORIZACIÓN *
                    </label>
                    <input
                      type="password"
                      className="input-videla"
                      placeholder="****"
                      value={form.pin}
                      onChange={e => setForm(f => ({ ...f, pin: e.target.value }))}
                      style={{ borderColor: form.pin.length > 0 && form.pin.length < 4 ? R : undefined, letterSpacing: '0.2em', fontFamily: 'monospace' }}
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--green-light)', border: '1.5px solid var(--green-border)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 700 }}>RESUMEN VIR</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  {resumenItems.map(([k, v]) => (
                    <Fragment key={k}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)' }}>{k}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                    </Fragment>
                  ))}
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gold w-full">
                {loading ? 'Guardando...' : 'REGISTRAR VIR'}
              </button>
              <button onClick={() => setStep(3)} className="btn-outline w-full">Atrás</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
