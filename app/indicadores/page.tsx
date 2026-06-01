'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { ClipboardList, CheckCircle, AlertCircle, Star, BookOpen } from 'lucide-react'
import { MESES, getPeriodoLabel } from '@/lib/scoring'

const UNIFORME_OPCIONES = ['>95%', '85-95%', '<85%']

const SH = ({ text, sub, color }: { text: string; sub?: string; color: string }) => (
  <div style={{ background: color, color: 'white', padding: '10px 16px', borderRadius: '10px 10px 0 0', fontFamily: 'var(--font-condensed)', letterSpacing: '0.08em', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
    {text}{sub && <span style={{ fontWeight: 400, opacity: 0.8, fontSize: '0.73rem' }}>{sub}</span>}
  </div>
)

const SB = ({ children, bc }: { children: React.ReactNode; bc?: string }) => (
  <div style={{ border: `2px solid ${bc || 'var(--green-border)'}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px', background: 'white' }}>
    {children}
  </div>
)

const Lbl = ({ text, color = '#1A4D2E' }: { text: string; color?: string }) => (
  <label style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>{text}</label>
)

export default function IndicadoresPage() {
  const now = new Date()
  const [cursos, setCursos] = useState<{ id: number; nombre: string }[]>([])
  const [tab, setTab] = useState<'academico'>('academico')

  // Form académico
  const [formAcad, setFormAcad] = useState({
    curso_id: '', periodo: String(now.getMonth() < 7 ? 1 : 2),
    anio: String(now.getFullYear()), pct_aprobados: '',
  })
  const [loadingA, setLoadingA] = useState(false)
  const [resultA, setResultA] = useState<{ ok: boolean; message?: string } | null>(null)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    const params = new URLSearchParams(window.location.search)
    const curso = params.get('curso')
    if (curso) { setFormAcad(f => ({ ...f, curso_id: curso })) }
  }, [])



  const handleSubmitAcad = async () => {
    setLoadingA(true)
    try {
      const mesCierre = parseInt(formAcad.periodo) === 1 ? 7 : 12
      const payload = {
        curso_id: parseInt(formAcad.curso_id), mes: mesCierre, anio: parseInt(formAcad.anio),
        pct_aprobados: formAcad.pct_aprobados ? parseFloat(formAcad.pct_aprobados) : null,
        limpieza: null, uniforme: null, asistencia: null,
        actas: null, ice_puntos: null, es_cierre_academico: true,
      }
      const res = await fetch('/api/indicadores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      setResultA(await res.json())
    } catch { setResultA({ ok: false, message: 'Error de conexión' }) }
    setLoadingA(false)
  }



  const G = '#2D7A4F'; const O = '#E85D04'; const R = '#C1121F'; const A = '#B45309'

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

        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.25)', border: '1px solid rgba(232,93,4,0.4)' }}>
              <ClipboardList size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>INDICADORES</h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>Mensual (Convivencia / Hábitos) · Período (Desempeño Académico)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button style={{ background: 'white', color: G, border: '1.5px solid white', borderRadius: '8px', padding: '7px 18px', cursor: 'default', fontFamily: 'var(--font-condensed)', fontSize: '0.88rem', fontWeight: 700 }}>
              📚 Desempeño Académico
            </button>
          </div>
        </div>

        {/* ── TAB ACADÉMICO ── */}
        {tab === 'academico' && (
          <div className="px-6 py-6 max-w-lg">
            {resultA && <Alert result={resultA} onClear={() => setResultA(null)} />}
            <div className="mb-5 p-4 rounded-xl" style={{ background: '#FEF3C7', border: '2px solid #FCD34D' }}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={18} style={{ color: '#78350F' }} />
                <span style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontWeight: 700, fontSize: '0.9rem' }}>INDICADOR POR PERÍODO</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Se carga <strong>una vez por período</strong> con el % de aprobados al cierre.<br/>
                Período 1 cierra en <strong>Julio</strong> · Período 2 cierra en <strong>Diciembre</strong>.
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <SH text="📚 DESEMPEÑO ACADÉMICO POR PERÍODO" sub="% aprobados al cierre" color={A} />
                <SB bc="#FCD34D">
                  <div className="space-y-4">
                    <div>
                      <Lbl text="CURSO" color="#78350F" />
                      <select className="input-videla" value={formAcad.curso_id} onChange={e => setFormAcad(f => ({ ...f, curso_id: e.target.value }))}>
                        <option value="">Seleccionar curso...</option>
                        {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Lbl text="PERÍODO" color="#78350F" />
                        <div className="flex gap-2">
                          {[1,2].map(p => (
                            <label key={p} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer flex-1 justify-center"
                              style={{ background: parseInt(formAcad.periodo) === p ? A : '#FEF3C7', border: `2px solid ${parseInt(formAcad.periodo) === p ? A : '#FCD34D'}` }}>
                              <input type="radio" name="periodo_acad" value={p} checked={parseInt(formAcad.periodo) === p} onChange={e => setFormAcad(f => ({ ...f, periodo: e.target.value }))} style={{ accentColor: A }} />
                              <span style={{ fontFamily: 'var(--font-condensed)', color: parseInt(formAcad.periodo) === p ? 'white' : '#78350F', fontWeight: 700, fontSize: '0.9rem' }}>P{p}</span>
                            </label>
                          ))}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.75rem', marginTop: '4px' }}>{getPeriodoLabel(parseInt(formAcad.periodo))}</div>
                      </div>
                      <div>
                        <Lbl text="AÑO" color="#78350F" />
                        <input type="number" className="input-videla" value={formAcad.anio} onChange={e => setFormAcad(f => ({ ...f, anio: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <Lbl text="PORCENTAJE DE APROBADOS (%)" color="#78350F" />
                      <input type="number" min={0} max={100} step="0.1" className="input-videla"
                        value={formAcad.pct_aprobados} onChange={e => setFormAcad(f => ({ ...f, pct_aprobados: e.target.value }))} placeholder="ej: 78.5" />
                    </div>
                    {formAcad.pct_aprobados && (
                      <div className="p-3 rounded-lg text-center slide-in" style={{ background: '#FEF3C7', border: '2px solid #FCD34D' }}>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.75rem' }}>PUNTAJE QUE SE ASIGNARÁ</div>
                        <div style={{ fontFamily: 'var(--font-display)', color: A, fontSize: '2rem' }}>
                          {parseFloat(formAcad.pct_aprobados) >= 90 ? 20 : parseFloat(formAcad.pct_aprobados) >= 80 ? 15 : parseFloat(formAcad.pct_aprobados) >= 70 ? 10 : parseFloat(formAcad.pct_aprobados) >= 60 ? 6 : 2}
                          <span style={{ fontSize: '1rem', color: '#92400E' }}> / 20 pts</span>
                        </div>
                      </div>
                    )}
                  </div>
                </SB>
              </div>
              <button onClick={handleSubmitAcad} disabled={!formAcad.curso_id || !formAcad.pct_aprobados || loadingA} className="btn-gold w-full" style={{ fontSize: '1.05rem', padding: '13px 24px' }}>
                {loadingA ? 'Guardando...' : 'GUARDAR DESEMPEÑO ACADÉMICO DEL PERÍODO'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
