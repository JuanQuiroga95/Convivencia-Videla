'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { BarChart3, RefreshCw, Calendar, BookOpen } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { MESES, getPeriodoLabel, getPeriodoActual } from '@/lib/scoring'

interface PuntajeMensual {
  curso_id: number
  curso_nombre: string
  puntaje_total: number
  puntaje_resolutivo: number
  puntaje_formativo: number
  puntaje_academico: number
  pct_var_resueltos: number
  tiene_datos: boolean
}

interface PuntajeAcademico {
  curso_id: number
  curso_nombre: string
  pct_aprobados: number | null
  puntaje_academico: number
  tiene_datos: boolean
}

const MEDAL = ['🥇', '🥈', '🥉']

const getColor = (score: number, max = 80) => {
  const pct = score / max
  if (pct >= 0.75) return '#2D7A4F'
  if (pct >= 0.5)  return '#E85D04'
  if (pct >= 0.25) return '#B45309'
  return '#8A9E87'
}

export default function TableroPage() {
  const now = new Date()
  const [mes,  setMes]  = useState(now.getMonth() + 1)
  const [anio] = useState(now.getFullYear())
  const [periodo, setPeriodo] = useState(getPeriodoActual())

  // MENSUAL state
  const [rankingMensual, setRankingMensual] = useState<PuntajeMensual[]>([])
  const [loadingMensual, setLoadingMensual] = useState(true)

  // PERÍODO ACADÉMICO state
  const [rankingAcad, setRankingAcad] = useState<PuntajeAcademico[]>([])
  const [loadingAcad, setLoadingAcad] = useState(true)

  // Tab principal
  const [tabPrincipal, setTabPrincipal] = useState<'mensual' | 'academico'>('mensual')
  // Sub-tab dentro de mensual
  const [tabMensual, setTabMensual] = useState<'ranking' | 'grafico'>('ranking')

  const loadMensual = async () => {
    setLoadingMensual(true)
    try {
      const res = await fetch(`/api/ranking?mes=${mes}&anio=${anio}&modo=mensual&t=${Date.now()}`)
      const data = await res.json()
      setRankingMensual(data.ranking || [])
    } catch {}
    setLoadingMensual(false)
  }

  const loadAcademico = async () => {
    setLoadingAcad(true)
    try {
      const res = await fetch(`/api/ranking?modo=periodo&periodo=${periodo}&anio=${anio}&t=${Date.now()}`)
      const data = await res.json()
      setRankingAcad(data.ranking || [])
    } catch {}
    setLoadingAcad(false)
  }

  useEffect(() => { loadMensual() }, [mes])
  useEffect(() => { loadAcademico() }, [periodo])

  const conDatos   = rankingMensual.filter(r => r.tiene_datos)
  const sinDatos   = rankingMensual.filter(r => !r.tiene_datos)
  const conDatosAc = rankingAcad.filter(r => r.tiene_datos)
  const sinDatosAc = rankingAcad.filter(r => !r.tiene_datos)

  const chartData = conDatos.map(r => ({
    name: r.curso_nombre,
    Resolutivo: r.puntaje_resolutivo,
    Formativo:  r.puntaje_formativo,
  }))

  const G = '#2D7A4F'
  const O = '#E85D04'
  const R = '#C1121F'

  const TabBtn = ({ id, label, active, onClick }: any) => (
    <button onClick={onClick} style={{
      background: active ? 'white' : 'transparent',
      color: active ? G : 'rgba(255,255,255,0.6)',
      border: `1.5px solid ${active ? 'white' : 'rgba(255,255,255,0.25)'}`,
      borderRadius: '8px', padding: '7px 18px', cursor: 'pointer',
      fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em',
      fontSize: '0.88rem', fontWeight: 700, transition: 'all 0.2s',
    }}>{label}</button>
  )

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.25)', border: '1px solid rgba(232,93,4,0.4)' }}>
              <BarChart3 size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                TABLERO
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                Indicadores de convivencia por curso
              </p>
            </div>
          </div>

          {/* Tabs principales */}
          <div className="flex gap-2 flex-wrap">
            <TabBtn id="mensual"   label="📅 Mensual (Resolutivo + Formativo)" active={tabPrincipal === 'mensual'}   onClick={() => setTabPrincipal('mensual')} />
            <TabBtn id="academico" label="📚 Académico por Período"             active={tabPrincipal === 'academico'} onClick={() => setTabPrincipal('academico')} />
          </div>
        </div>

        {/* ════════════════════════════════ MENSUAL ════════════════════════════════ */}
        {tabPrincipal === 'mensual' && (
          <div className="px-4 py-5">

            {/* Controles mensual */}
            <div className="flex items-center gap-3 mb-5 flex-wrap max-w-2xl">
              <div className="flex items-center gap-2">
                <Calendar size={15} style={{ color: G }} />
                <select value={mes} onChange={e => setMes(parseInt(e.target.value))}
                  className="input-videla" style={{ width: 'auto', padding: '7px 12px' }}>
                  {MESES.slice(1).map((m, i) => (
                    <option key={i+1} value={i+1}>{m} {anio}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-1">
                {(['ranking', 'grafico'] as const).map(t => (
                  <button key={t} onClick={() => setTabMensual(t)} style={{
                    background: tabMensual === t ? G : 'white',
                    color: tabMensual === t ? 'white' : G,
                    border: `1.5px solid ${G}`, borderRadius: '6px',
                    padding: '6px 14px', cursor: 'pointer',
                    fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.82rem',
                  }}>
                    {t === 'ranking' ? '🏆 Ranking' : '📊 Gráfico'}
                  </button>
                ))}
              </div>

              <button onClick={loadMensual} style={{ background: 'white', border: `1.5px solid ${G}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: G }}>
                <RefreshCw size={15} />
              </button>

              {conDatos.length > 0 && (
                <span style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.8rem', fontWeight: 700 }}>
                  {conDatos.length} curso{conDatos.length !== 1 ? 's' : ''} con datos
                </span>
              )}
            </div>

            {/* Leyenda dimensiones */}
            <div className="flex gap-4 flex-wrap mb-4 max-w-2xl">
              {[
                { label: 'Resolutivo', color: R, max: '40 pts' },
                { label: 'Formativo',  color: G, max: '40 pts' },
              ].map(({ label, color, max }) => (
                <div key={label} className="flex items-center gap-2">
                  <div style={{ width: 12, height: 12, borderRadius: '3px', background: color }} />
                  <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.78rem', color: '#2D5A30', fontWeight: 600 }}>
                    {label} <span style={{ color: '#5A7A5C' }}>({max})</span>
                  </span>
                </div>
              ))}
              <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.78rem', color: '#5A7A5C' }}>
                Total: 80 pts
              </span>
            </div>

            {loadingMensual && (
              <div className="text-center py-12">
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', letterSpacing: '0.1em' }}>CARGANDO...</div>
              </div>
            )}

            {/* Ranking mensual */}
            {!loadingMensual && tabMensual === 'ranking' && (
              <div className="space-y-3 max-w-2xl stagger">
                {conDatos.map((r, i) => (
                  <div key={r.curso_id} className="rounded-xl card-hover" style={{ border: '2px solid var(--green-border)', background: 'white', overflow: 'hidden' }}>
                    <div style={{ height: '4px', background: `linear-gradient(90deg, ${getColor(r.puntaje_total)}, ${O})` }} />
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', minWidth: '36px', textAlign: 'center' }}>
                          {i < 3 ? MEDAL[i] : <span style={{ color: '#8A9E87', fontSize: '1rem' }}>#{i+1}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', color: 'var(--green-dark)' }}>
                            {r.curso_nombre}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: getColor(r.puntaje_total), lineHeight: 1 }}>
                            {r.puntaje_total}
                          </div>
                          <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.7rem', color: '#5A7A5C' }}>/80 pts</div>
                        </div>
                      </div>

                      {/* Barra total */}
                      <div style={{ background: '#F4F7F4', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                        <div style={{ background: `linear-gradient(90deg, ${getColor(r.puntaje_total)}, ${O})`, height: '100%', width: `${(r.puntaje_total / 80) * 100}%`, transition: 'width 0.8s ease', borderRadius: '4px' }} />
                      </div>

                      {/* Desglose */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Resolutivo', val: r.puntaje_resolutivo, max: 40, color: R, bg: '#FEE2E2' },
                          { label: 'Formativo',  val: r.puntaje_formativo,  max: 40, color: G, bg: '#D1FAE5' },
                        ].map(({ label, val, max, color, bg }) => (
                          <div key={label} style={{ background: bg, borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color }}>{val}</div>
                            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.65rem', color, opacity: 0.8 }}>{label} /{max}</div>
                          </div>
                        ))}
                      </div>

                      {r.pct_var_resueltos > 0 && (
                        <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.75rem', color: '#5A7A5C', marginTop: '8px', textAlign: 'center' }}>
                          VIR resueltos: <span style={{ color: G, fontWeight: 700 }}>{r.pct_var_resueltos}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {sinDatos.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: '#8A9E87', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      SIN DATOS EN {MESES[mes].toUpperCase()}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sinDatos.map(r => (
                        <span key={r.curso_id} style={{ fontFamily: 'var(--font-condensed)', background: 'white', border: '1.5px solid var(--green-border)', color: '#8A9E87', borderRadius: '6px', padding: '4px 10px', fontSize: '0.85rem' }}>
                          {r.curso_nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {conDatos.length === 0 && !loadingMensual && (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A9E87', fontFamily: 'var(--font-body)' }}>
                    No hay datos cargados para {MESES[mes]} {anio}.
                  </div>
                )}
              </div>
            )}

            {/* Gráfico mensual */}
            {!loadingMensual && tabMensual === 'grafico' && chartData.length > 0 && (
              <div className="max-w-3xl">
                <div style={{ background: 'white', border: '2px solid var(--green-border)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 700 }}>
                    RESOLUTIVO + FORMATIVO · {MESES[mes].toUpperCase()} {anio}
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 35, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,122,79,0.1)" />
                      <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-condensed)', fontSize: 11, fill: '#2D5A30' }} angle={-45} textAnchor="end" />
                      <YAxis domain={[0, 80]} tick={{ fontFamily: 'var(--font-condensed)', fontSize: 11, fill: '#5A7A5C' }} />
                      <Tooltip contentStyle={{ fontFamily: 'var(--font-condensed)', border: '2px solid var(--green-border)', borderRadius: '8px', background: 'white', color: '#0F2010' }} />
                      <Legend wrapperStyle={{ fontFamily: 'var(--font-condensed)', fontSize: '12px', paddingTop: '8px' }} />
                      <Bar dataKey="Resolutivo" fill={R} radius={[4,4,0,0]} />
                      <Bar dataKey="Formativo"  fill={G} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ ACADÉMICO ════════════════════════════════ */}
        {tabPrincipal === 'academico' && (
          <div className="px-4 py-5">

            {/* Controles período */}
            <div className="flex items-center gap-3 mb-5 flex-wrap max-w-2xl">
              <div className="flex items-center gap-2">
                <BookOpen size={15} style={{ color: O }} />
                <span style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontWeight: 700, fontSize: '0.9rem' }}>
                  PERÍODO:
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2].map(p => (
                  <button key={p} onClick={() => setPeriodo(p)} style={{
                    background: periodo === p ? O : 'white',
                    color: periodo === p ? 'white' : O,
                    border: `2px solid ${O}`,
                    borderRadius: '8px', padding: '7px 18px', cursor: 'pointer',
                    fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}>
                    Período {p}
                  </button>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.8rem' }}>
                {getPeriodoLabel(periodo)}
              </span>
              <button onClick={loadAcademico} style={{ background: 'white', border: `1.5px solid ${O}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: O }}>
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Info box */}
            <div className="max-w-2xl mb-5 p-4 rounded-xl" style={{ background: '#FEF3C7', border: '2px solid #FCD34D' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                📚 DIMENSIÓN ACADÉMICA · 20 puntos máx.
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Este indicador se carga una vez por período desde la sección Indicadores → Académico.
                El puntaje se suma al total final al cierre del período (Julio / Diciembre).
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[['≥90%','20 pts'],['≥80%','15 pts'],['≥70%','10 pts'],['≥60%','6 pts'],['<60%','2 pts']].map(([rango, pts]) => (
                  <span key={rango} style={{ background: 'white', border: '1.5px solid #FCD34D', borderRadius: '6px', padding: '3px 10px', fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.78rem', fontWeight: 700 }}>
                    {rango} → {pts}
                  </span>
                ))}
              </div>
            </div>

            {loadingAcad && (
              <div className="text-center py-12">
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', letterSpacing: '0.1em' }}>CARGANDO...</div>
              </div>
            )}

            {!loadingAcad && (
              <div className="space-y-3 max-w-2xl stagger">
                {conDatosAc.map((r, i) => (
                  <div key={r.curso_id} className="rounded-xl card-hover" style={{ border: '2px solid #FCD34D', background: 'white', overflow: 'hidden' }}>
                    <div style={{ height: '4px', background: `linear-gradient(90deg, #78350F, #E85D04)` }} />
                    <div className="p-4 flex items-center gap-4">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', minWidth: '36px', textAlign: 'center' }}>
                        {i < 3 ? MEDAL[i] : <span style={{ color: '#8A9E87', fontSize: '1rem' }}>#{i+1}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', color: 'var(--green-dark)' }}>
                          {r.curso_nombre}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.85rem', marginTop: '2px' }}>
                          Aprobados: <strong style={{ color: '#78350F' }}>{r.pct_aprobados?.toFixed(1)}%</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '10px', padding: '10px 16px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#78350F', lineHeight: 1 }}>
                          {r.puntaje_academico}
                        </div>
                        <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.65rem', color: '#92400E' }}>/ 20 pts</div>
                      </div>
                    </div>
                  </div>
                ))}

                {sinDatosAc.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: '#8A9E87', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      SIN DATOS ACADÉMICOS EN ESTE PERÍODO
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sinDatosAc.map(r => (
                        <span key={r.curso_id} style={{ fontFamily: 'var(--font-condensed)', background: 'white', border: '1.5px solid #FCD34D', color: '#8A9E87', borderRadius: '6px', padding: '4px 10px', fontSize: '0.85rem' }}>
                          {r.curso_nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {conDatosAc.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A9E87', fontFamily: 'var(--font-body)' }}>
                    Aún no hay datos académicos cargados para el {getPeriodoLabel(periodo)}.
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
