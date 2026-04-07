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
    asistencia: '',
    actas: '0',
    ice_puntos: '0',
    interv_tempranas: '0',
    situaciones_previas: '0',
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
        interv_tempranas: parseInt(form.interv_tempranas),
        situaciones_previas: parseInt(form.situaciones_previas),
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

  const limpiezaLabels: Record<string, string> = {
    '1': 'Incumplimiento reiterado', '2': 'Desorden visible',
    '3': 'Detalles menores', '4': 'Orden general correcto', '5': 'Aula impecable'
  }

  const G = '#2D7A4F'
  const O = '#E85D04'
  const R = '#C1121F'
  const P = '#7C3AED'

  const SectionHeader = ({ text, sub, color }: { text: string, sub?: string, color: string }) => (
    <div style={{
      background: color, color: 'white', padding: '10px 16px',
      borderRadius: '10px 10px 0 0',
      fontFamily: 'var(--font-condensed)', letterSpacing: '0.08em',
      fontSize: '0.85rem', fontWeight: 700,
      display: 'flex', alignItems: 'baseline', gap: '8px'
    }}>
      {text}
      {sub && <span style={{ fontWeight: 400, opacity: 0.8, fontSize: '0.73rem' }}>{sub}</span>}
    </div>
  )

  const SectionBody = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      border: '2px solid var(--green-border)', borderTop: 'none',
      borderRadius: '0 0 10px 10px', padding: '16px', background: 'white'
    }}>
      {children}
    </div>
  )

  const canSubmit = form.curso_id && form.mes

  return (
    <div style={{ background: '#F5F7F5', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.25)', border: '1px solid rgba(232,93,4,0.4)' }}>
              <ClipboardList size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                INDICADORES
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Cargar indicadores mensuales por curso
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-lg">

          {result?.ok && (
            <div className="mb-5 p-4 rounded-xl flex items-center gap-3 slide-in"
              style={{ background: '#D1FAE5', border: '2px solid #6EE7B7' }}>
              <CheckCircle size={20} style={{ color: G }} />
              <div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700, fontSize: '1rem' }}>
                  Indicadores guardados correctamente
                </div>
                <button onClick={() => setResult(null)}
                  style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Cargar otro →
                </button>
              </div>
            </div>
          )}

          {result && !result.ok && (
            <div className="mb-5 p-4 rounded-xl flex items-center gap-3"
              style={{ background: '#FEE2E2', border: '2px solid #FCA5A5' }}>
              <AlertCircle size={20} style={{ color: R }} />
              <span style={{ fontFamily: 'var(--font-body)', color: R, fontSize: '0.9rem' }}>{result.message}</span>
            </div>
          )}

          <div className="space-y-5">

            {/* ── CURSO Y PERÍODO ── */}
            <div>
              <SectionHeader text="CURSO Y PERÍODO" color={O} />
              <SectionBody>
                <div className="space-y-3">
                  <select className="input-videla" value={form.curso_id}
                    onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                    <option value="">Seleccionar curso...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontFamily: 'var(--font-condensed)', color: '#4A6741', fontSize: '0.73rem', display: 'block', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.08em' }}>MES</label>
                      <select className="input-videla" value={form.mes}
                        onChange={e => setForm(f => ({ ...f, mes: e.target.value }))}>
                        {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-condensed)', color: '#4A6741', fontSize: '0.73rem', display: 'block', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.08em' }}>AÑO</label>
                      <input type="number" className="input-videla" value={form.anio}
                        onChange={e => setForm(f => ({ ...f, anio: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </SectionBody>
            </div>

            {/* ── DIMENSIÓN FORMATIVA ── */}
            <div>
              <SectionHeader text="🟢 DIMENSIÓN FORMATIVA" sub="Uniforme · Asistencia · Cuidado del entorno" color={G} />
              <SectionBody>
                <div className="space-y-4">

                  {/* Limpieza stars */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontSize: '0.78rem', display: 'block', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      CUIDADO DEL ENTORNO
                    </label>
                    <div className="flex gap-2 mb-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setForm(f => ({ ...f, limpieza: String(n) }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <Star size={30}
                            fill={parseInt(form.limpieza) >= n ? G : 'none'}
                            style={{ color: parseInt(form.limpieza) >= n ? G : '#CBD5E1' }}
                          />
                        </button>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.82rem', fontWeight: 500 }}>
                      {limpiezaLabels[form.limpieza]}
                    </div>
                  </div>

                  {/* Uniforme */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontSize: '0.78rem', display: 'block', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      CUMPLIMIENTO DE UNIFORME
                    </label>
                    <div className="flex gap-2">
                      {UNIFORME_OPCIONES.map(op => (
                        <label key={op} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
                          style={{
                            background: form.uniforme === op ? G : '#F0FDF4',
                            border: `2px solid ${form.uniforme === op ? G : '#BBF7D0'}`,
                            flex: 1, justifyContent: 'center'
                          }}>
                          <input type="radio" name="uniforme" value={op} checked={form.uniforme === op}
                            onChange={e => setForm(f => ({ ...f, uniforme: e.target.value }))}
                            style={{ accentColor: G }} />
                          <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.85rem', color: form.uniforme === op ? 'white' : '#1A4D2E', fontWeight: 700 }}>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Asistencia */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      ASISTENCIA (%)
                    </label>
                    <input type="number" min={0} max={100} step="0.1" className="input-videla"
                      value={form.asistencia}
                      onChange={e => setForm(f => ({ ...f, asistencia: e.target.value }))}
                      placeholder="0–100" />
                  </div>
                </div>
              </SectionBody>
            </div>

            {/* ── DIMENSIÓN RESOLUTIVA ── */}
            <div>
              <SectionHeader text="🔴 DIMENSIÓN RESOLUTIVA" sub="Actas · ICE" color={R} />
              <SectionBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#7F1D1D', fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      ACTAS
                    </label>
                    <input type="number" min={0} max={20} className="input-videla"
                      value={form.actas}
                      onChange={e => setForm(f => ({ ...f, actas: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#7F1D1D', fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      PUNTOS ICE QUITADOS
                    </label>
                    <input type="number" min={0} max={100} className="input-videla"
                      value={form.ice_puntos}
                      onChange={e => setForm(f => ({ ...f, ice_puntos: e.target.value }))} />
                  </div>
                </div>
              </SectionBody>
            </div>

            {/* ── INTERVENCIONES (ventana recuperada) ── */}
            <div>
              <SectionHeader text="🟣 INTERVENCIONES REGISTRADAS" sub="Tempranas · Previas al acta" color={P} />
              <SectionBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#4C1D95', fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      INTERVENCIONES TEMPRANAS
                    </label>
                    <input type="number" min={0} max={20} className="input-videla"
                      value={form.interv_tempranas}
                      onChange={e => setForm(f => ({ ...f, interv_tempranas: e.target.value }))} />
                    <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.73rem', marginTop: '4px' }}>
                      Acciones preventivas antes del conflicto
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-condensed)', color: '#4C1D95', fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
                      SITUACIONES PREVIAS AL ACTA
                    </label>
                    <input type="number" min={0} max={20} className="input-videla"
                      value={form.situaciones_previas}
                      onChange={e => setForm(f => ({ ...f, situaciones_previas: e.target.value }))} />
                    <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.73rem', marginTop: '4px' }}>
                      VIR registrados antes de llegar a acta
                    </div>
                  </div>
                </div>
              </SectionBody>
            </div>

            {/* ── ACADÉMICA ── */}
            <div>
              <SectionHeader text="📚 DIMENSIÓN ACADÉMICA" sub="% aprobados del período" color="#B45309" />
              <SectionBody>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
                  PORCENTAJE DE APROBADOS (%)
                </label>
                <input type="number" min={0} max={100} step="0.1" className="input-videla"
                  value={form.pct_aprobados}
                  onChange={e => setForm(f => ({ ...f, pct_aprobados: e.target.value }))}
                  placeholder="0–100" />
              </SectionBody>
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gold w-full"
              style={{ fontSize: '1.1rem', padding: '14px 24px' }}>
              {loading ? 'Guardando...' : 'GUARDAR INDICADORES'}
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}
