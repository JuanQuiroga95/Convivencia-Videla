'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Shield, CheckCircle, AlertCircle, ChevronRight, User } from 'lucide-react'
import { CATEGORIAS_VIR, TIPOS_REPARACION_POR_CATEGORIA, INTERVINIENTES } from '@/lib/scoring'

export default function VIRPage() {
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [form, setForm] = useState({
    curso_id: '',
    categoria_id: '',
    tipo_situacion: '',
    resuelto: '',
    tipo_reparacion: '',
    intervino: '',
    nombre_activador: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok: boolean, message?: string} | null>(null)
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    const params = new URLSearchParams(window.location.search)
    const curso = params.get('curso')
    if (curso) setForm(f => ({ ...f, curso_id: curso }))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/var', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          curso_id: parseInt(form.curso_id),
          resuelto: form.resuelto === 'si',
        })
      })
      const data = await res.json()
      setResult(data)
      if (data.ok) {
        setForm({ curso_id: '', categoria_id: '', tipo_situacion: '', resuelto: '', tipo_reparacion: '', intervino: '', nombre_activador: '' })
        setStep(1)
      }
    } catch {
      setResult({ ok: false, message: 'Error de conexión' })
    }
    setLoading(false)
  }

  const categoriaActual = CATEGORIAS_VIR.find(c => c.id === form.categoria_id)
  const esPositivo = categoriaActual?.esPositivo

  const reparacionesDispo = form.categoria_id ? (TIPOS_REPARACION_POR_CATEGORIA[form.categoria_id] || []) : []

  const canNextStep1 = form.curso_id && form.categoria_id && form.tipo_situacion
  const canNextStep2 = esPositivo ? true : form.resuelto
  const canSubmit = form.intervino && form.nombre_activador.trim().length >= 3 &&
    (esPositivo || form.resuelto === 'no' || form.tipo_reparacion)

  const G = '#2D7A4F'   // green
  const O = '#E85D04'   // orange

  const sectionHeader = (text: string, color = G) => (
    <div style={{
      background: color,
      color: 'white',
      padding: '6px 14px',
      borderRadius: '6px 6px 0 0',
      fontFamily: 'var(--font-condensed)',
      letterSpacing: '0.1em',
      fontSize: '0.78rem',
      fontWeight: 700,
    }}>{text}</div>
  )

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

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
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
                {s < 3 && <div className="w-8 h-px" style={{ background: step > s ? 'var(--orange)' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginLeft: '8px' }}>
              {step === 1 ? 'Identificación' : step === 2 ? 'Resolución' : 'Cierre'}
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
              <AlertCircle size={20} style={{ color: '#C1121F' }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#C1121F', fontSize: '0.9rem' }}>{result.message}</span>
            </div>
          )}

          {/* STEP 1 — Identificación */}
          {step === 1 && (
            <div className="space-y-4 slide-in">
              {/* Curso */}
              <div>
                {sectionHeader('CURSO')}
                <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }}>
                  <select className="input-videla" value={form.curso_id} onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                    <option value="">Seleccionar curso...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              {/* Categoría */}
              <div>
                {sectionHeader('CATEGORÍA DE LA SITUACIÓN', O)}
                <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }}>
                  <div className="grid grid-cols-1 gap-2">
                    {CATEGORIAS_VIR.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: form.categoria_id === cat.id ? 'rgba(45,122,79,0.1)' : 'var(--bg-alt)',
                          border: `1.5px solid ${form.categoria_id === cat.id ? G : 'var(--green-border)'}`,
                        }}>
                        <input type="radio" name="categoria" value={cat.id}
                          checked={form.categoria_id === cat.id}
                          onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value, tipo_situacion: '' }))}
                          style={{ accentColor: G }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: form.categoria_id === cat.id ? 600 : 400 }}>
                          {cat.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Situación específica */}
              {form.categoria_id && categoriaActual && (
                <div className="slide-in">
                  {sectionHeader('SITUACIÓN ESPECÍFICA', categoriaActual.color)}
                  <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }}>
                    <div className="grid grid-cols-1 gap-2">
                      {categoriaActual.situaciones.map(sit => (
                        <label key={sit} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                          style={{
                            background: form.tipo_situacion === sit ? 'rgba(232,93,4,0.08)' : 'var(--bg-alt)',
                            border: `1.5px solid ${form.tipo_situacion === sit ? O : 'var(--green-border)'}`,
                          }}>
                          <input type="radio" name="situacion" value={sit}
                            checked={form.tipo_situacion === sit}
                            onChange={e => setForm(f => ({ ...f, tipo_situacion: e.target.value }))}
                            style={{ accentColor: O }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            {sit}
                          </span>
                        </label>
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

          {/* STEP 2 — Resolución */}
          {step === 2 && (
            <div className="space-y-4 slide-in">
              {/* Resumen */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--green-light)', border: '1.5px solid var(--green-border)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SITUACIÓN REGISTRADA</div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>{form.tipo_situacion}</div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.85rem' }}>
                  Curso: {cursos.find(c => String(c.id) === form.curso_id)?.nombre} · {categoriaActual?.label}
                </div>
              </div>

              {esPositivo ? (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.4)' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>✓ Acción Formativa Positiva</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                    Esta categoría registra acciones destacadas. Se contabiliza como VIR positivo.
                  </div>
                </div>
              ) : (
                <div>
                  {sectionHeader('¿SE RESOLVIÓ CON REPARACIÓN?', O)}
                  <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }}>
                    {['si', 'no'].map(val => (
                      <label key={val} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-all"
                        style={{
                          background: form.resuelto === val ? (val === 'si' ? 'rgba(45,122,79,0.1)' : 'rgba(193,18,31,0.08)') : 'var(--bg-alt)',
                          border: `1.5px solid ${form.resuelto === val ? (val === 'si' ? G : '#C1121F') : 'var(--green-border)'}`,
                        }}>
                        <input type="radio" name="resuelto" value={val}
                          checked={form.resuelto === val}
                          onChange={e => setForm(f => ({ ...f, resuelto: e.target.value }))}
                          style={{ accentColor: val === 'si' ? G : '#C1121F' }} />
                        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {val === 'si' ? '✓ Sí' : '✗ No'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {form.resuelto === 'si' && reparacionesDispo.length > 0 && (
                <div className="slide-in">
                  {sectionHeader('TIPO DE REPARACIÓN', G)}
                  <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }}>
                    <div className="grid grid-cols-1 gap-2">
                      {reparacionesDispo.map(tipo => (
                        <label key={tipo} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                          style={{
                            background: form.tipo_reparacion === tipo ? 'rgba(45,122,79,0.1)' : 'var(--bg-alt)',
                            border: `1.5px solid ${form.tipo_reparacion === tipo ? G : 'var(--green-border)'}`,
                          }}>
                          <input type="radio" name="reparacion" value={tipo}
                            checked={form.tipo_reparacion === tipo}
                            onChange={e => setForm(f => ({ ...f, tipo_reparacion: e.target.value }))}
                            style={{ accentColor: G }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => setStep(3)} disabled={!canNextStep2} className="btn-gold w-full flex items-center justify-center gap-2">
                Continuar <ChevronRight size={16} />
              </button>
              <button onClick={() => setStep(1)} className="btn-outline w-full">Atrás</button>
            </div>
          )}

          {/* STEP 3 — Cierre */}
          {step === 3 && (
            <div className="space-y-4 slide-in">
              {/* Quien activa el VIR */}
              <div>
                {sectionHeader('QUIEN ACTIVA EL VIR', O)}
                <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px' }}>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {INTERVINIENTES.map(i => (
                      <label key={i} className="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: form.intervino === i ? 'rgba(45,122,79,0.1)' : 'var(--bg-alt)',
                          border: `1.5px solid ${form.intervino === i ? G : 'var(--green-border)'}`,
                        }}>
                        <input type="radio" name="intervino" value={i}
                          checked={form.intervino === i}
                          onChange={e => setForm(f => ({ ...f, intervino: e.target.value }))}
                          style={{ accentColor: G }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{i}</span>
                      </label>
                    ))}
                  </div>

                  {/* Nombre y apellido obligatorio */}
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
                      style={{ borderColor: form.nombre_activador.trim().length > 0 && form.nombre_activador.trim().length < 3 ? '#C1121F' : undefined }}
                    />
                    {form.nombre_activador.trim().length > 0 && form.nombre_activador.trim().length < 3 && (
                      <p style={{ fontFamily: 'var(--font-body)', color: '#C1121F', fontSize: '0.78rem', marginTop: '4px' }}>
                        Ingresá nombre y apellido completo
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--green-light)', border: '1.5px solid var(--green-border)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 700 }}>RESUMEN VIR</div>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  {[
                    ['Curso', cursos.find(c => String(c.id) === form.curso_id)?.nombre],
                    ['Categoría', categoriaActual?.label],
                    ['Situación', form.tipo_situacion],
                    ['Resuelto', esPositivo ? 'Positivo' : form.resuelto === 'si' ? 'Sí' : 'No'],
                    form.tipo_reparacion ? ['Reparación', form.tipo_reparacion] : null,
                    ['Interviene', form.intervino],
                    form.nombre_activador ? ['Activador', form.nombre_activador] : null,
                  ].filter(Boolean).map(([k, v], i) => (
                    <>
                      <span key={`k${i}`} style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-condensed)' }}>{k}</span>
                      <span key={`v${i}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                    </>
                  ))}
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gold w-full">
                {loading ? 'Guardando...' : 'REGISTRAR VIR'}
              </button>
              <button onClick={() => setStep(2)} className="btn-outline w-full">Atrás</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
