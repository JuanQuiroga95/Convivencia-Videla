'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { ClipboardList, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { MESES } from '@/lib/scoring'

const UNIFORME_OPCIONES = ['>95%', '85-95%', '<85%']

export default function IndicadoresPage() {
  const now = new Date()
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [form, setForm] = useState({
    curso_id: '',
    mes: String(now.getMonth() + 1),
    anio: String(now.getFullYear()),
    limpieza: '3',
    uniforme: '',
    puntualidad: '',
    asistencia: '',
    actas: '0',
    ice_puntos: '0',
    pct_aprobados: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok: boolean, message?: string} | null>(null)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    const params = new URLSearchParams(window.location.search)
    const curso = params.get('curso')
    if (curso) setForm(f => ({ ...f, curso_id: curso }))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        curso_id: parseInt(form.curso_id),
        mes: parseInt(form.mes),
        anio: parseInt(form.anio),
        limpieza: parseInt(form.limpieza),
        actas: parseInt(form.actas),
        ice_puntos: parseInt(form.ice_puntos),
        puntualidad: form.puntualidad ? parseFloat(form.puntualidad) : null,
        asistencia: form.asistencia ? parseFloat(form.asistencia) : null,
        pct_aprobados: form.pct_aprobados ? parseFloat(form.pct_aprobados) : null,
      }
      const res = await fetch('/api/indicadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ ok: false, message: 'Error de conexión' })
    }
    setLoading(false)
  }

  const limpiezaLabels: Record<string,string> = {
    '1': 'Incumplimiento reiterado', '2': 'Desorden visible',
    '3': 'Detalles menores', '4': 'Orden general correcto', '5': 'Aula impecable'
  }

  const G = '#2D7A4F'
  const O = '#E85D04'

  const sectionHeader = (text: string, sub?: string, color = G) => (
    <div style={{ background: color, color: 'white', padding: '8px 14px', borderRadius: '6px 6px 0 0', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 700 }}>
      {text}{sub && <span style={{ fontWeight: 400, opacity: 0.75, fontSize: '0.72rem', marginLeft: '8px' }}>{sub}</span>}
    </div>
  )

  const field = (children: React.ReactNode) => (
    <div style={{ border: '1.5px solid var(--green-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px', background: 'white' }}>
      {children}
    </div>
  )

  const inputNumber = (key: keyof typeof form, min = 0, max = 100, label?: string) => (
    <div>
      {label && <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>{label}</label>}
      <input type="number" min={min} max={max} step="0.1"
        className="input-videla"
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={`${min}–${max}`}
      />
    </div>
  )

  const canSubmit = form.curso_id && form.mes

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">
        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.2)' }}>
              <ClipboardList size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                INDICADORES
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                Cargar indicadores mensuales por curso
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-lg">

          {result?.ok && (
            <div className="mb-4 p-4 rounded-xl flex items-center gap-3 slide-in" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.4)' }}>
              <CheckCircle size={20} style={{ color: G }} />
              <div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>Indicadores guardados correctamente</div>
                <button onClick={() => setResult(null)} style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Cargar otro →</button>
              </div>
            </div>
          )}

          {result && !result.ok && (
            <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(193,18,31,0.08)', border: '1px solid rgba(193,18,31,0.3)' }}>
              <AlertCircle size={20} style={{ color: '#C1121F' }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#C1121F', fontSize: '0.9rem' }}>{result.message}</span>
            </div>
          )}

          <div className="space-y-4">

            {/* Curso + Período */}
            <div>
              {sectionHeader('CURSO Y PERÍODO', undefined, O)}
              {field(
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3">
                    <select className="input-videla" value={form.curso_id} onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                      <option value="">Seleccionar curso...</option>
                      {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>MES</label>
                    <select className="input-videla" value={form.mes} onChange={e => setForm(f => ({ ...f, mes: e.target.value }))}>
                      {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>AÑO</label>
                    <input type="number" className="input-videla" value={form.anio} onChange={e => setForm(f => ({ ...f, anio: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>

            {/* Dimensión Formativa */}
            <div>
              {sectionHeader('🟢 DIMENSIÓN FORMATIVA', '(Uniforme · Asistencia · Cuidado del entorno)', G)}
              {field(
                <div className="space-y-4">
                  {/* Limpieza */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'block', marginBottom: '6px', letterSpacing: '0.06em' }}>
                      CUIDADO DEL ENTORNO
                    </label>
                    <div className="flex gap-2 mb-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setForm(f => ({ ...f, limpieza: String(n) }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <Star size={28}
                            fill={parseInt(form.limpieza) >= n ? G : 'none'}
                            style={{ color: parseInt(form.limpieza) >= n ? G : '#D1D5DB' }}
                          />
                        </button>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {limpiezaLabels[form.limpieza]}
                    </div>
                  </div>

                  {/* Uniforme */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'block', marginBottom: '6px', letterSpacing: '0.06em' }}>CUMPLIMIENTO DE UNIFORME</label>
                    <div className="flex gap-2">
                      {UNIFORME_OPCIONES.map(op => (
                        <label key={op} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
                          style={{ background: form.uniforme === op ? 'rgba(45,122,79,0.1)' : 'var(--bg-alt)', border: `1.5px solid ${form.uniforme === op ? G : 'var(--green-border)'}`, flex: 1, justifyContent: 'center' }}>
                          <input type="radio" name="uniforme" value={op} checked={form.uniforme === op}
                            onChange={e => setForm(f => ({ ...f, uniforme: e.target.value }))} style={{ accentColor: G }} />
                          <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: form.uniforme === op ? 700 : 400 }}>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Asistencia */}
                  <div className="grid grid-cols-2 gap-3">
                    {inputNumber('asistencia', 0, 100, 'ASISTENCIA (%)')}
                    {inputNumber('puntualidad', 0, 100, 'PUNTUALIDAD (%)')}
                  </div>
                </div>
              )}
            </div>

            {/* Dimensión Resolutiva */}
            <div>
              {sectionHeader('🔴 DIMENSIÓN RESOLUTIVA', '(Actas · ICE)', '#C1121F')}
              {field(
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>ACTAS</label>
                    <input type="number" min="0" max="20" className="input-videla"
                      value={form.actas} onChange={e => setForm(f => ({ ...f, actas: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>ICE PUNTOS QUITADOS</label>
                    <input type="number" min="0" max="100" className="input-videla"
                      value={form.ice_puntos} onChange={e => setForm(f => ({ ...f, ice_puntos: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>

            {/* Académica */}
            <div>
              {sectionHeader('📚 DIMENSIÓN ACADÉMICA', '(% aprobados del período)', O)}
              {field(
                inputNumber('pct_aprobados', 0, 100, 'PORCENTAJE DE APROBADOS (%)')
              )}
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gold w-full">
              {loading ? 'Guardando...' : 'GUARDAR INDICADORES'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
