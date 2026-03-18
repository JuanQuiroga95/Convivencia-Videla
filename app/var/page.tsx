'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Shield, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { TIPOS_SITUACION, TIPOS_REPARACION, INTERVINIENTES } from '@/lib/scoring'

export default function VARPage() {
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [form, setForm] = useState({
    curso_id: '',
    tipo_situacion: '',
    resuelto: '',
    tipo_reparacion: '',
    intervino: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok: boolean, message?: string} | null>(null)
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    // Check URL params for pre-filled course (from QR)
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
        setForm({ curso_id: '', tipo_situacion: '', resuelto: '', tipo_reparacion: '', intervino: '' })
        setStep(1)
      }
    } catch {
      setResult({ ok: false, message: 'Error de conexión' })
    }
    setLoading(false)
  }

  const canNextStep1 = form.curso_id && form.tipo_situacion
  const canNextStep2 = form.resuelto
  const canSubmit = form.intervino && (form.resuelto === 'no' || form.tipo_reparacion)

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">
        {/* Header */}
        <div className="px-6 py-8" style={{
          background: 'linear-gradient(135deg, #1a0a0a, #3d0f0f, #1a0a0a)',
          borderBottom: '1px solid rgba(220,38,38,0.2)'
        }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.2)' }}>
              <Shield size={24} style={{ color: '#FCA5A5' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                ACTIVAR VAR
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem' }}>
                Versión · Acuerdo Vulnerado · Reparación
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
                    background: step >= s ? 'linear-gradient(135deg, #C9A84C, #E8C96E)' : 'rgba(255,255,255,0.1)',
                    color: step >= s ? '#0A1628' : '#6B7280',
                  }}>
                  {s}
                </div>
                {s < 3 && <div className="w-8 h-px" style={{ background: step > s ? '#C9A84C' : 'rgba(255,255,255,0.15)' }} />}
              </div>
            ))}
            <span style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', marginLeft: '8px' }}>
              {step === 1 ? 'Identificación' : step === 2 ? 'Resolución' : 'Cierre'}
            </span>
          </div>
        </div>

        <div className="px-6 py-6 max-w-lg">

          {/* Success */}
          {result?.ok && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3 slide-in" style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)' }}>
              <CheckCircle size={20} style={{ color: '#6EE7B7' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#6EE7B7' }}>VAR registrado correctamente</div>
                <button onClick={() => setResult(null)} style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Registrar otro →
                </button>
              </div>
            </div>
          )}

          {result && !result.ok && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <AlertCircle size={20} style={{ color: '#FCA5A5' }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#FCA5A5', fontSize: '0.9rem' }}>{result.message}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 slide-in">
              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                  CURSO
                </label>
                <select className="input-videla" value={form.curso_id} onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                  <option value="">Seleccionar curso...</option>
                  {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                  TIPO DE SITUACIÓN
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {TIPOS_SITUACION.map(tipo => (
                    <label key={tipo} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                      style={{
                        background: form.tipo_situacion === tipo ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.tipo_situacion === tipo ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      <input type="radio" name="tipo" value={tipo}
                        checked={form.tipo_situacion === tipo}
                        onChange={e => setForm(f => ({ ...f, tipo_situacion: e.target.value }))}
                        style={{ accentColor: '#DC2626' }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: form.tipo_situacion === tipo ? '#FCA5A5' : '#D1D5DB' }}>
                        {tipo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!canNextStep1} className="btn-gold w-full flex items-center justify-center gap-2">
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 slide-in">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SITUACIÓN REGISTRADA</div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'white', marginTop: '4px' }}>{form.tipo_situacion}</div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.85rem' }}>
                  Curso: {cursos.find(c => String(c.id) === form.curso_id)?.nombre}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                  A — ACUERDO VULNERADO<br />
                  <span style={{ color: '#6B7280', fontWeight: 400 }}>¿SE RESOLVIÓ CON REPARACIÓN?</span>
                </label>
                {['si', 'no'].map(val => (
                  <label key={val} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-all"
                    style={{
                      background: form.resuelto === val ? (val === 'si' ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.1)') : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.resuelto === val ? (val === 'si' ? 'rgba(5,150,105,0.4)' : 'rgba(220,38,38,0.4)') : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    <input type="radio" name="resuelto" value={val}
                      checked={form.resuelto === val}
                      onChange={e => setForm(f => ({ ...f, resuelto: e.target.value }))}
                      style={{ accentColor: val === 'si' ? '#059669' : '#DC2626' }} />
                    <span style={{ fontFamily: 'var(--font-body)', color: 'white', fontWeight: 500 }}>
                      {val === 'si' ? '✓ Sí, se resolvió' : '✗ No, se escala'}
                    </span>
                  </label>
                ))}
              </div>

              {form.resuelto === 'si' && (
                <div className="slide-in">
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                    R — TIPO DE REPARACIÓN
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {TIPOS_REPARACION.map(tipo => (
                      <label key={tipo} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: form.tipo_reparacion === tipo ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${form.tipo_reparacion === tipo ? 'rgba(5,150,105,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        }}>
                        <input type="radio" name="reparacion" value={tipo}
                          checked={form.tipo_reparacion === tipo}
                          onChange={e => setForm(f => ({ ...f, tipo_reparacion: e.target.value }))}
                          style={{ accentColor: '#059669' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#D1D5DB' }}>{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setStep(3)} disabled={!canNextStep2} className="btn-gold w-full flex items-center justify-center gap-2">
                Continuar <ChevronRight size={16} />
              </button>
              <button onClick={() => setStep(1)} className="btn-outline w-full">Atrás</button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 slide-in">
              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                  INTERVINO
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERVINIENTES.map(i => (
                    <label key={i} className="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all"
                      style={{
                        background: form.intervino === i ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.intervino === i ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      <input type="radio" name="intervino" value={i}
                        checked={form.intervino === i}
                        onChange={e => setForm(f => ({ ...f, intervino: e.target.value }))}
                        style={{ accentColor: '#C9A84C' }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#D1D5DB' }}>{i}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.8rem', letterSpacing: '0.1em' }}>RESUMEN</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span style={{ color: '#6B7280' }}>Curso</span>
                  <span style={{ color: 'white' }}>{cursos.find(c => String(c.id) === form.curso_id)?.nombre}</span>
                  <span style={{ color: '#6B7280' }}>Situación</span>
                  <span style={{ color: 'white', fontSize: '0.8rem' }}>{form.tipo_situacion}</span>
                  <span style={{ color: '#6B7280' }}>Resuelto</span>
                  <span style={{ color: form.resuelto === 'si' ? '#6EE7B7' : '#FCA5A5' }}>
                    {form.resuelto === 'si' ? 'Sí' : 'No'}
                  </span>
                  {form.tipo_reparacion && <>
                    <span style={{ color: '#6B7280' }}>Reparación</span>
                    <span style={{ color: 'white', fontSize: '0.8rem' }}>{form.tipo_reparacion}</span>
                  </>}
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gold w-full">
                {loading ? 'Guardando...' : 'REGISTRAR VAR'}
              </button>
              <button onClick={() => setStep(2)} className="btn-outline w-full">Atrás</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
