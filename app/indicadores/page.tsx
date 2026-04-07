'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { ClipboardList, CheckCircle, AlertCircle, Star, BookOpen } from 'lucide-react'
import { MESES, getPeriodoLabel } from '@/lib/scoring'

const UNIFORME_OPCIONES = ['>95%', '85-95%', '<85%']

const SectionHeader = ({ text, sub, color }: { text: string; sub?: string; color: string }) => (
  <div style={{
    background: color, color: 'white', padding: '10px 16px',
    borderRadius: '10px 10px 0 0',
    fontFamily: 'var(--font-condensed)', letterSpacing: '0.08em',
    fontSize: '0.85rem', fontWeight: 700,
    display: 'flex', alignItems: 'baseline', gap: '8px',
  }}>
    {text}
    {sub && <span style={{ fontWeight: 400, opacity: 0.8, fontSize: '0.73rem' }}>{sub}</span>}
  </div>
)

const SectionBody = ({ children, borderColor }: { children: React.ReactNode; borderColor?: string }) => (
  <div style={{
    border: `2px solid ${borderColor || 'var(--green-border)'}`, borderTop: 'none',
    borderRadius: '0 0 10px 10px', padding: '16px', background: 'white',
  }}>
    {children}
  </div>
)

const Label = ({ text, color = '#1A4D2E' }: { text: string; color?: string }) => (
  <label style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>
    {text}
  </label>
)

export default function IndicadoresPage() {
  const now = new Date()
  const [cursos, setCursos] = useState<{ id: number; nombre: string }[]>([])

  // ── FORM MENSUAL ──
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
  })
  const [loadingM, setLoadingM] = useState(false)
  const [resultM, setResultM] = useState<{ ok: boolean; message?: string } | null>(null)

  // ── FORM ACADÉMICO POR PERÍODO ──
  const [formAcad, setFormAcad] = useState({
    curso_id: '',
    periodo: String(now.getMonth() < 7 ? 1 : 2),
    anio: String(now.getFullYear()),
    pct_aprobados: '',
  })
  const [loadingA, setLoadingA] = useState(false)
  const [resultA, setResultA] = useState<{ ok: boolean; message?: string } | null>(null)

  // Tab activo
  const [tab, setTab] = useState<'mensual' | 'academico'>('mensual')

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    const params = new URLSearchParams(window.location.search)
    const curso = params.get('curso')
    if (curso) {
      setForm(f => ({ ...f, curso_id: curso }))
      setFormAcad(f => ({ ...f, curso_id: curso }))
    }
  }, [])

  const handleSubmitMensual = async () => {
    setLoadingM(true)
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
        pct_aprobados: null, // no va en mensual
      }
      const res = await fetch('/api/indicadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResultM(data)
    } catch {
      setResultM({ ok: false, message: 'Error de conexión' })
    }
    setLoadingM(false)
  }

  const handleSubmitAcad = async () => {
    setLoadingA(true)
    try {
      // El académico se guarda como un indicador en el mes de cierre del período
      // P1 → mes 7 (julio), P2 → mes 12 (diciembre)
      const mesCierre = parseInt(formAcad.periodo) === 1 ? 7 : 12
      const payload = {
        curso_id: parseInt(formAcad.curso_id),
        mes: mesCierre,
        anio: parseInt(formAcad.anio),
        pct_aprobados: formAcad.pct_aprobados ? parseFloat(formAcad.pct_aprobados) : null,
        // el resto en null / defaults para no pisar datos mensuales
        limpieza: null,
        uniforme: null,
        asistencia: null,
        actas: null,
        ice_puntos: null,
        interv_tempranas: null,
        situaciones_previas: null,
        es_cierre_academico: true,
      }
      const res = await fetch('/api/indicadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResultA(data)
    } catch {
      setResultA({ ok: false, message: 'Error de conexión' })
    }
    setLoadingA(false)
  }

  const G = '#2D7A4F'
  const O = '#E85D04'
  const R = '#C1121F'
  const P = '#7C3AED'
  const A = '#B45309'

  const limpiezaLabels: Record<string, string> = {
    '1': 'Incumplimiento reiterado', '2': 'Desorden visible',
    '3': 'Detalles menores', '4': 'Orden general correcto', '5': 'Aula impecable',
  }

  const Alert = ({ result, onClear }: { result: { ok: boolean; message?: string }; onClear: () => void }) =>
    result.ok ? (
      <div className="mb-5 p-4 rounded-xl flex items-center gap-3 slide-in" style={{ background: '#D1FAE5', border: '2px solid #6EE7B7' }}>
        <CheckCircle size={20} style={{ color: G }} />
        <div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>Guardado correctamente</div>
          <button onClick={onClear} style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Cargar otro →</button>
        </div>
      </div>
    ) : (
      <div className="mb-5 p-4 rounded-xl flex items-center gap-3" style={{ background: '#FEE2E2', border: '2px solid #FCA5A5' }}>
        <AlertCircle size={20} style={{ color: R }} />
        <span style={{ fontFamily: 'var(--font-body)', color: R, fontSize: '0.9rem' }}>{result.message}</span>
      </div>
    )

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.25)', border: '1px solid rgba(232,93,4,0.4)' }}>
              <ClipboardList size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                INDICADORES
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                Mensual (formativo/resolutivo) · Período (académico)
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'mensual',   label: '📅 Indicadores Mensuales' },
              { id: 'academico', label: '📚 Académico por Período' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id as any)} style={{
                background: tab === id ? 'white' : 'transparent',
                color: tab === id ? G : 'rgba(255,255,255,0.6)',
                border: `1.5px solid ${tab === id ? 'white' : 'rgba(255,255,255,0.25)'}`,
                borderRadius: '8px', padding: '7px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em',
                fontSize: '0.88rem', fontWeight: 700, transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* ═══════════════ TAB MENSUAL ═══════════════ */}
        {tab === 'mensual' && (
          <div className="px-6 py-6 max-w-lg">
            {resultM && <Alert result={resultM} onClear={() => setResultM(null)} />}

            <div className="space-y-5">

              {/* Curso y período */}
              <div>
                <SectionHeader text="CURSO Y MES" color={O} />
                <SectionBody>
                  <div className="space-y-3">
                    <select className="input-videla" value={form.curso_id}
                      onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                      <option value="">Seleccionar curso...</option>
                      {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label text="MES" />
                        <select className="input-videla" value={form.mes}
                          onChange={e => setForm(f => ({ ...f, mes: e.target.value }))}>
                          {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label text="AÑO" />
                        <input type="number" className="input-videla" value={form.anio}
                          onChange={e => setForm(f => ({ ...f, anio: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </SectionBody>
              </div>

              {/* Formativa */}
              <div>
                <SectionHeader text="🟢 DIMENSIÓN FORMATIVA" sub="Uniforme · Asistencia · Cuidado del entorno" color={G} />
                <SectionBody>
                  <div className="space-y-4">
                    <div>
                      <Label text="CUIDADO DEL ENTORNO" />
                      <div className="flex gap-2 mb-1">
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setForm(f => ({ ...f, limpieza: String(n) }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Star size={30}
                              fill={parseInt(form.limpieza) >= n ? G : 'none'}
                              style={{ color: parseInt(form.limpieza) >= n ? G : '#CBD5E1' }} />
                          </button>
                        ))}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.82rem', fontWeight: 500 }}>
                        {limpiezaLabels[form.limpieza]}
                      </div>
                    </div>

                    <div>
                      <Label text="CUMPLIMIENTO DE UNIFORME" />
                      <div className="flex gap-2">
                        {UNIFORME_OPCIONES.map(op => (
                          <label key={op} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                            style={{ background: form.uniforme === op ? G : '#F0FDF4', border: `2px solid ${form.uniforme === op ? G : '#BBF7D0'}`, flex: 1, justifyContent: 'center' }}>
                            <input type="radio" name="uniforme" value={op} checked={form.uniforme === op}
                              onChange={e => setForm(f => ({ ...f, uniforme: e.target.value }))} style={{ accentColor: G }} />
                            <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.85rem', color: form.uniforme === op ? 'white' : '#1A4D2E', fontWeight: 700 }}>{op}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label text="ASISTENCIA (%)" />
                      <input type="number" min={0} max={100} step="0.1" className="input-videla"
                        value={form.asistencia} onChange={e => setForm(f => ({ ...f, asistencia: e.target.value }))} placeholder="0–100" />
                    </div>
                  </div>
                </SectionBody>
              </div>

              {/* Resolutiva */}
              <div>
                <SectionHeader text="🔴 DIMENSIÓN RESOLUTIVA" sub="Actas · ICE" color={R} />
                <SectionBody borderColor="#FCA5A5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label text="ACTAS" color="#7F1D1D" />
                      <input type="number" min={0} max={20} className="input-videla"
                        value={form.actas} onChange={e => setForm(f => ({ ...f, actas: e.target.value }))} />
                    </div>
                    <div>
                      <Label text="PUNTOS ICE QUITADOS" color="#7F1D1D" />
                      <input type="number" min={0} max={100} className="input-videla"
                        value={form.ice_puntos} onChange={e => setForm(f => ({ ...f, ice_puntos: e.target.value }))} />
                    </div>
                  </div>
                </SectionBody>
              </div>

              {/* Intervenciones */}
              <div>
                <SectionHeader text="🟣 INTERVENCIONES REGISTRADAS" sub="Tempranas · Previas al acta" color={P} />
                <SectionBody borderColor="#C4B5FD">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label text="INTERVENCIONES TEMPRANAS" color="#4C1D95" />
                      <input type="number" min={0} max={20} className="input-videla"
                        value={form.interv_tempranas} onChange={e => setForm(f => ({ ...f, interv_tempranas: e.target.value }))} />
                      <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.73rem', marginTop: '4px' }}>Acciones antes del conflicto</div>
                    </div>
                    <div>
                      <Label text="SITUACIONES PREVIAS AL ACTA" color="#4C1D95" />
                      <input type="number" min={0} max={20} className="input-videla"
                        value={form.situaciones_previas} onChange={e => setForm(f => ({ ...f, situaciones_previas: e.target.value }))} />
                      <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.73rem', marginTop: '4px' }}>VIR previos al acta</div>
                    </div>
                  </div>
                </SectionBody>
              </div>

              <button onClick={handleSubmitMensual} disabled={!form.curso_id || loadingM} className="btn-gold w-full" style={{ fontSize: '1.05rem', padding: '13px 24px' }}>
                {loadingM ? 'Guardando...' : 'GUARDAR INDICADORES MENSUALES'}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB ACADÉMICO ═══════════════ */}
        {tab === 'academico' && (
          <div className="px-6 py-6 max-w-lg">
            {resultA && <Alert result={resultA} onClear={() => setResultA(null)} />}

            {/* Explicación */}
            <div className="mb-5 p-4 rounded-xl" style={{ background: '#FEF3C7', border: '2px solid #FCD34D' }}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={18} style={{ color: '#78350F' }} />
                <span style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontWeight: 700, fontSize: '0.9rem' }}>
                  INDICADOR POR PERÍODO
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Se carga <strong>una vez por período</strong> con el porcentaje de aprobados al cierre.
                <br />Período 1 cierra en <strong>Julio</strong> · Período 2 cierra en <strong>Diciembre</strong>.
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <SectionHeader text="📚 ACADÉMICO POR PERÍODO" sub="% aprobados al cierre" color={A} />
                <SectionBody borderColor="#FCD34D">
                  <div className="space-y-4">
                    <div>
                      <Label text="CURSO" color="#78350F" />
                      <select className="input-videla" value={formAcad.curso_id}
                        onChange={e => setFormAcad(f => ({ ...f, curso_id: e.target.value }))}>
                        <option value="">Seleccionar curso...</option>
                        {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label text="PERÍODO" color="#78350F" />
                        <div className="flex gap-2">
                          {[1, 2].map(p => (
                            <label key={p} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer flex-1 justify-center"
                              style={{ background: parseInt(formAcad.periodo) === p ? A : '#FEF3C7', border: `2px solid ${parseInt(formAcad.periodo) === p ? A : '#FCD34D'}` }}>
                              <input type="radio" name="periodo_acad" value={p}
                                checked={parseInt(formAcad.periodo) === p}
                                onChange={e => setFormAcad(f => ({ ...f, periodo: e.target.value }))}
                                style={{ accentColor: A }} />
                              <span style={{ fontFamily: 'var(--font-condensed)', color: parseInt(formAcad.periodo) === p ? 'white' : '#78350F', fontWeight: 700, fontSize: '0.9rem' }}>
                                P{p}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.75rem', marginTop: '4px' }}>
                          {getPeriodoLabel(parseInt(formAcad.periodo))}
                        </div>
                      </div>
                      <div>
                        <Label text="AÑO" color="#78350F" />
                        <input type="number" className="input-videla" value={formAcad.anio}
                          onChange={e => setFormAcad(f => ({ ...f, anio: e.target.value }))} />
                      </div>
                    </div>

                    <div>
                      <Label text="PORCENTAJE DE APROBADOS (%)" color="#78350F" />
                      <input type="number" min={0} max={100} step="0.1" className="input-videla"
                        value={formAcad.pct_aprobados}
                        onChange={e => setFormAcad(f => ({ ...f, pct_aprobados: e.target.value }))}
                        placeholder="ej: 78.5" />
                    </div>

                    {/* Preview puntaje */}
                    {formAcad.pct_aprobados && (
                      <div className="p-3 rounded-lg text-center slide-in" style={{ background: '#FEF3C7', border: '2px solid #FCD34D' }}>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.75rem', letterSpacing: '0.08em' }}>PUNTAJE QUE SE ASIGNARÁ</div>
                        <div style={{ fontFamily: 'var(--font-display)', color: A, fontSize: '2rem' }}>
                          {parseFloat(formAcad.pct_aprobados) >= 90 ? 20
                           : parseFloat(formAcad.pct_aprobados) >= 80 ? 15
                           : parseFloat(formAcad.pct_aprobados) >= 70 ? 10
                           : parseFloat(formAcad.pct_aprobados) >= 60 ? 6 : 2}
                          <span style={{ fontSize: '1rem', color: '#92400E' }}> / 20 pts</span>
                        </div>
                      </div>
                    )}
                  </div>
                </SectionBody>
              </div>

              <button onClick={handleSubmitAcad}
                disabled={!formAcad.curso_id || !formAcad.pct_aprobados || loadingA}
                className="btn-gold w-full" style={{ fontSize: '1.05rem', padding: '13px 24px' }}>
                {loadingA ? 'Guardando...' : 'GUARDAR ACADÉMICO DEL PERÍODO'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
