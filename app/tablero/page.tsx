'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { BarChart3, RefreshCw, Calendar, BookOpen, Sun, Sunset } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { MESES, getPeriodoLabel, getPeriodoActual, getTurno, TURNOS } from '@/lib/scoring'

interface PuntajeMensual {
  curso_id: number; curso_nombre: string
  puntaje_total: number; puntaje_resolutivo: number
  puntaje_formativo: number; puntaje_campo: number
  pct_var_resueltos: number; tiene_datos: boolean
}
interface PuntajeAcademico {
  curso_id: number; curso_nombre: string
  pct_aprobados: number | null; puntaje_academico: number; tiene_datos: boolean
}

const MEDAL = ['🥇', '🥈', '🥉']
const G = '#2D7A4F'; const O = '#E85D04'; const R = '#C1121F'; const GOLD = '#B45309'

const getColor = (score: number) => {
  if (score >= 70) return G
  if (score >= 50) return O
  if (score >= 30) return GOLD
  return '#8A9E87'
}

export default function TableroPage() {
  const now = new Date()
  const [mes, setMes]   = useState(now.getMonth() + 1)
  const [anio]          = useState(now.getFullYear())
  const [periodo, setPeriodo] = useState(getPeriodoActual())
  const [turno, setTurno]     = useState<'manana' | 'tarde'>('manana')
  const [tabPrincipal, setTabPrincipal] = useState<'mensual' | 'academico'>('mensual')
  const [tabVista, setTabVista]         = useState<'ranking' | 'grafico'>('ranking')
  const [rankingMensual, setRankingMensual] = useState<PuntajeMensual[]>([])
  const [rankingAcad, setRankingAcad]       = useState<PuntajeAcademico[]>([])
  const [loadingM, setLoadingM] = useState(true)
  const [loadingA, setLoadingA] = useState(true)

  const loadMensual = async () => {
    setLoadingM(true)
    try {
      const res = await fetch(`/api/ranking?mes=${mes}&anio=${anio}&modo=mensual&t=${Date.now()}`)
      const data = await res.json()
      setRankingMensual(data.ranking || [])
    } catch {}
    setLoadingM(false)
  }
  const loadAcademico = async () => {
    setLoadingA(true)
    try {
      const res = await fetch(`/api/ranking?modo=periodo&periodo=${periodo}&anio=${anio}&t=${Date.now()}`)
      const data = await res.json()
      setRankingAcad(data.ranking || [])
    } catch {}
    setLoadingA(false)
  }

  useEffect(() => { loadMensual() }, [mes])
  useEffect(() => { loadAcademico() }, [periodo])

  // Filtrar por turno
  const filterTurno = <T extends { curso_nombre: string }>(list: T[]) =>
    list.filter(r => getTurno(r.curso_nombre) === turno)

  const mensualTurno   = filterTurno(rankingMensual)
  const academTurno    = filterTurno(rankingAcad)


  const chartData = mensualTurno.map(r => ({
    name: r.curso_nombre, Convivencia: r.puntaje_resolutivo, Hábitos: r.puntaje_formativo, Aportes: r.puntaje_campo || 0
  }))

  const TurnoBtn = ({ t }: { t: typeof TURNOS[0] }) => (
    <button onClick={() => setTurno(t.id as any)} style={{
      flex: 1, padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
      fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.88rem',
      border: `2px solid ${turno === t.id ? 'white' : 'rgba(255,255,255,0.2)'}`,
      background: turno === t.id ? 'white' : 'transparent',
      color: turno === t.id ? 'var(--green-dark)' : 'rgba(255,255,255,0.65)',
      transition: 'all 0.2s',
    }}>
      {t.emoji} {t.label}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', opacity: 0.75, fontWeight: 400 }}>{t.sub}</div>
    </button>
  )

  const TabBtn = ({ label, active, onClick }: any) => (
    <button onClick={onClick} style={{
      padding: '6px 16px', borderRadius: '7px', cursor: 'pointer',
      fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.85rem',
      border: `1.5px solid ${active ? 'white' : 'rgba(255,255,255,0.2)'}`,
      background: active ? 'white' : 'transparent',
      color: active ? 'var(--green-dark)' : 'rgba(255,255,255,0.6)',
      transition: 'all 0.2s',
    }}>{label}</button>
  )

  const RankingCard = ({ r, i }: { r: PuntajeMensual; i: number }) => (
    <div style={{ background: 'white', border: `2px solid ${i === 0 ? GOLD : 'var(--green-border)'}`, borderRadius: '14px', overflow: 'hidden' }} className="card-hover">
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${getColor(r.puntaje_total)}, ${O})` }} />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', minWidth: '32px' }}>
            {i < 3 ? MEDAL[i] : <span style={{ color: '#8A9E87', fontSize: '0.95rem' }}>#{i+1}</span>}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', color: 'var(--green-dark)', lineHeight: 1 }}>{r.curso_nombre}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: getColor(r.puntaje_total), lineHeight: 1 }}>{r.puntaje_total}</div>
            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.65rem', color: '#8A9E87' }}>/100 pts</div>
          </div>
        </div>
        {/* Barra */}
        <div style={{ background: '#F4F7F4', borderRadius: '4px', height: '7px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ background: `linear-gradient(90deg, ${getColor(r.puntaje_total)}, ${O})`, height: '100%', width: `${r.puntaje_total}%`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
        </div>
        {/* Dimensiones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'Convivencia', val: r.puntaje_resolutivo, max: 40, color: R, bg: '#FEE2E2' },
            { label: 'Hábitos',     val: r.puntaje_formativo,  max: 40, color: G, bg: '#D1FAE5' },
            { label: 'Aportes',     val: r.puntaje_campo || 0, max: 20, color: GOLD, bg: '#FEF3C7' },
          ].map(({ label, val, max, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.6rem', color, opacity: 0.8, marginTop: '2px' }}>{label} /{max}</div>
            </div>
          ))}
        </div>
        {r.pct_var_resueltos > 0 && (
          <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.72rem', color: '#5A7A5C', marginTop: '8px', textAlign: 'center' }}>
            VIR resueltos: <span style={{ color: G, fontWeight: 700 }}>{r.pct_var_resueltos}%</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="px-6 py-5">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(232,93,4,0.25)', border: '1px solid rgba(232,93,4,0.4)', borderRadius: '8px', padding: '8px' }}>
                <BarChart3 size={22} style={{ color: 'var(--orange)' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', letterSpacing: '0.05em', color: 'white', lineHeight: 1 }}>TABLERO</h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Ranking por turno · {MESES[mes]} {anio}</p>
              </div>
            </div>

            {/* Selector de turno — prominente */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              {TURNOS.map(t => <TurnoBtn key={t.id} t={t} />)}
            </div>

            {/* Tabs secundarios */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <TabBtn label="📅 Mensual" active={tabPrincipal === 'mensual'} onClick={() => setTabPrincipal('mensual')} />
              <TabBtn label="📚 Desempeño Académico por Período" active={tabPrincipal === 'academico'} onClick={() => setTabPrincipal('academico')} />
            </div>
          </div>
        </div>

        {/* ═══ MENSUAL ═══ */}
        {tabPrincipal === 'mensual' && (
          <div className="px-4 py-5 max-w-2xl">
            {/* Controles */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} style={{ color: G }} />
                <select value={mes} onChange={e => setMes(parseInt(e.target.value))} className="input-videla" style={{ width: 'auto', padding: '6px 12px' }}>
                  {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m} {anio}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['ranking', 'grafico'] as const).map(t => (
                  <button key={t} onClick={() => setTabVista(t)} style={{
                    background: tabVista === t ? G : 'white', color: tabVista === t ? 'white' : G,
                    border: `1.5px solid ${G}`, borderRadius: '7px', padding: '6px 14px',
                    cursor: 'pointer', fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.82rem',
                  }}>
                    {t === 'ranking' ? '🏆 Ranking' : '📊 Gráfico'}
                  </button>
                ))}
              </div>
              <button onClick={loadMensual} style={{ background: 'white', border: `1.5px solid ${G}`, borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', color: G }}>
                <RefreshCw size={14}/>
              </button>
            </div>

            {/* Título del turno activo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', padding: '10px 14px', background: 'white', border: '2px solid var(--green-border)', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{TURNOS.find(t => t.id === turno)?.emoji}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--green-dark)', fontWeight: 700, fontSize: '0.95rem' }}>{TURNOS.find(t => t.id === turno)?.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.75rem' }}>{TURNOS.find(t => t.id === turno)?.sub} · {mensualTurno.length} curso{mensualTurno.length !== 1 ? 's' : ''}</div>
              </div>
            </div>

            {loadingM && <div style={{ textAlign: 'center', padding: '40px', color: '#5A7A5C', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>CARGANDO...</div>}

            {!loadingM && tabVista === 'ranking' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="stagger">
                {mensualTurno.map((r, i) => <RankingCard key={r.curso_id} r={r} i={i} />)}
                {mensualTurno.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8A9E87', fontFamily: 'var(--font-body)' }}>
                    No hay cursos para el {TURNOS.find(t => t.id === turno)?.label}.
                  </div>
                )}
              </div>
            )}

            {!loadingM && tabVista === 'grafico' && chartData.length > 0 && (
              <div style={{ background: 'white', border: '2px solid var(--green-border)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 700 }}>
                  {TURNOS.find(t => t.id === turno)?.label.toUpperCase()} · {MESES[mes].toUpperCase()} {anio}
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 30, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,122,79,0.1)" />
                    <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-condensed)', fontSize: 11, fill: '#2D5A30' }} angle={-45} textAnchor="end" />
                    <YAxis domain={[0, 100]} tick={{ fontFamily: 'var(--font-condensed)', fontSize: 11, fill: '#5A7A5C' }} />
                    <Tooltip contentStyle={{ fontFamily: 'var(--font-condensed)', border: '2px solid var(--green-border)', borderRadius: '8px', background: 'white', color: '#0F2010' }} />
                    <Legend wrapperStyle={{ fontFamily: 'var(--font-condensed)', fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="Convivencia" fill={R}    radius={[4,4,0,0]} />
                    <Bar dataKey="Hábitos"     fill={G}    radius={[4,4,0,0]} />
                    <Bar dataKey="Campo"      fill={GOLD} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* ═══ DESEMPEÑO ACADÉMICO ═══ */}
        {tabPrincipal === 'academico' && (
          <div className="px-4 py-5 max-w-2xl">
            {/* Controles período */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <BookOpen size={14} style={{ color: O }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1,2].map(p => (
                  <button key={p} onClick={() => setPeriodo(p)} style={{
                    background: periodo === p ? O : 'white', color: periodo === p ? 'white' : O,
                    border: `2px solid ${O}`, borderRadius: '8px', padding: '6px 16px',
                    cursor: 'pointer', fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.88rem',
                  }}>Período {p}</button>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.78rem' }}>{getPeriodoLabel(periodo)}</span>
              <button onClick={loadAcademico} style={{ background: 'white', border: `1.5px solid ${O}`, borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', color: O }}>
                <RefreshCw size={14}/>
              </button>
            </div>

            {/* Info box */}
            <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                📚 DIMENSIÓN ACADÉMICA · {TURNOS.find(t => t.id === turno)?.label} · 20 pts máx.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {[['≥90%','20'],['≥80%','15'],['≥70%','10'],['≥60%','6'],['<60%','2']].map(([r, p]) => (
                  <span key={r} style={{ background: 'white', border: '1.5px solid #FCD34D', borderRadius: '6px', padding: '2px 8px', fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.75rem', fontWeight: 700 }}>
                    {r} → {p} pts
                  </span>
                ))}
              </div>
            </div>

            {loadingA && <div style={{ textAlign: 'center', padding: '40px', color: '#5A7A5C', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>CARGANDO...</div>}

            {!loadingA && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="stagger">
                {academTurno.map((r, i) => (
                  <div key={r.curso_id} style={{ background: 'white', border: `2px solid ${i === 0 ? GOLD : '#FCD34D'}`, borderRadius: '14px', overflow: 'hidden' }} className="card-hover">
                    <div style={{ height: '4px', background: `linear-gradient(90deg, #78350F, ${O})` }} />
                    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', minWidth: '32px' }}>
                        {i < 3 ? MEDAL[i] : <span style={{ color: '#8A9E87', fontSize: '0.95rem' }}>#{i+1}</span>}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.05em', color: 'var(--green-dark)' }}>{r.curso_nombre}</div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.82rem', marginTop: '2px' }}>
                          Aprobados: <strong style={{ color: '#78350F' }}>{r.pct_aprobados?.toFixed(1)}%</strong>
                        </div>
                      </div>
                      <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '10px', padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: GOLD, lineHeight: 1 }}>{r.puntaje_academico}</div>
                        <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.62rem', color: '#92400E' }}>/ 20 pts</div>
                      </div>
                    </div>
                  </div>
                ))}
                {academTurno.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8A9E87', fontFamily: 'var(--font-body)' }}>
                    No hay datos de Desempeño Académico para el {getPeriodoLabel(periodo)} en el {TURNOS.find(t => t.id === turno)?.label}.
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
