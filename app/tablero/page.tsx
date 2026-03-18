'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { BarChart3, TrendingUp, Trophy, RefreshCw, AlertCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts'
import { MESES } from '@/lib/scoring'

interface PuntajeData {
  curso_id: number
  curso_nombre: string
  puntaje_total: number
  puntaje_resolutivo: number
  puntaje_formativo: number
  puntaje_preventivo: number
  puntaje_academico: number
  pct_var_resueltos: number
  tiene_datos: boolean
}

const MEDAL = ['🥇', '🥈', '🥉']

const getScoreColor = (score: number) => {
  if (score >= 75) return '#C9A84C'
  if (score >= 50) return '#2563EB'
  if (score >= 25) return '#D97706'
  return '#6B7280'
}

export default function TableroPage() {
  const now = new Date()
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio] = useState(now.getFullYear())
  const [ranking, setRanking] = useState<PuntajeData[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PuntajeData | null>(null)
  const [tab, setTab] = useState<'ranking' | 'grafico' | 'detalle'>('ranking')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ranking?mes=${mes}&anio=${anio}&t=${Date.now()}`)
      const data = await res.json()
      setRanking(data.ranking || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadData() }, [mes])

  const conDatos = ranking.filter(r => r.tiene_datos)
  const sinDatos = ranking.filter(r => !r.tiene_datos)

  const chartData = conDatos.map(r => ({
    name: r.curso_nombre,
    Total: r.puntaje_total,
    Resolutivo: r.puntaje_resolutivo,
    Formativo: r.puntaje_formativo,
    Preventivo: r.puntaje_preventivo,
    Académico: r.puntaje_academico,
  }))

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-8" style={{
          background: 'linear-gradient(135deg, #0a0f1a, #0f1f3d, #0a0f1a)',
          borderBottom: '1px solid rgba(37,99,235,0.2)'
        }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(37,99,235,0.2)' }}>
                <BarChart3 size={24} style={{ color: '#93C5FD' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                  TABLERO
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem' }}>
                  Ranking mensual · {MESES[mes]} {anio}
                  {conDatos.length > 0 && (
                    <span style={{ color: '#6EE7B7', marginLeft: '8px' }}>
                      · {conDatos.length} curso{conDatos.length !== 1 ? 's' : ''} con datos
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={mes}
                onChange={e => setMes(parseInt(e.target.value))}
                className="input-videla"
                style={{ width: 'auto', padding: '8px 12px' }}>
                {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <button onClick={loadData} className="btn-outline" style={{ padding: '8px 12px' }}>
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {[
              { key: 'ranking', label: 'Ranking', icon: Trophy },
              { key: 'grafico', label: 'Gráfico', icon: BarChart3 },
              { key: 'detalle', label: 'Detalle', icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key as typeof tab)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  fontFamily: 'var(--font-condensed)', letterSpacing: '0.05em', cursor: 'pointer',
                  background: tab === key ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${tab === key ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: tab === key ? '#93C5FD' : '#6B7280',
                }}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', letterSpacing: '0.1em' }}>
                CARGANDO...
              </div>
            </div>
          )}

          {/* RANKING TAB */}
          {!loading && tab === 'ranking' && (
            <div className="space-y-3 max-w-2xl">

              {conDatos.length === 0 && (
                <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <AlertCircle size={32} style={{ color: '#374151', margin: '0 auto 12px' }} />
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', marginBottom: '6px' }}>
                    No hay datos cargados para {MESES[mes]}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem' }}>
                    Cargá VAR o indicadores desde las secciones correspondientes para que aparezcan los puntajes.
                  </div>
                </div>
              )}

              {/* Cursos CON datos */}
              {conDatos.map((curso, idx) => (
                <div
                  key={curso.curso_id}
                  onClick={() => setSelected(selected?.curso_id === curso.curso_id ? null : curso)}
                  className="rounded-xl p-4 card-hover cursor-pointer"
                  style={{
                    background: selected?.curso_id === curso.curso_id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selected?.curso_id === curso.curso_id ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl w-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
                      {idx < 3 ? MEDAL[idx] : <span style={{ color: '#4B5563' }}>{idx + 1}</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', color: 'white' }}>
                        {curso.curso_nombre}
                      </div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {[
                          { label: 'R', val: curso.puntaje_resolutivo, color: '#FCA5A5' },
                          { label: 'F', val: curso.puntaje_formativo, color: '#6EE7B7' },
                          { label: 'P', val: curso.puntaje_preventivo, color: '#93C5FD' },
                          { label: 'A', val: curso.puntaje_academico, color: '#FCD34D' },
                        ].map(({ label, val, color }) => (
                          <span key={label} style={{
                            fontFamily: 'var(--font-condensed)', fontSize: '0.75rem',
                            padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(255,255,255,0.06)', color
                          }}>
                            {label}: {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '2rem',
                        color: getScoreColor(curso.puntaje_total), lineHeight: 1
                      }}>
                        {curso.puntaje_total}
                      </div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', fontSize: '0.7rem' }}>/ 100</div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.07)' }}>
                    <div style={{
                      height: '100%', width: `${curso.puntaje_total}%`,
                      background: `linear-gradient(90deg, ${getScoreColor(curso.puntaje_total)}, ${getScoreColor(curso.puntaje_total)}88)`,
                      borderRadius: '99px', transition: 'width 0.6s ease'
                    }} />
                  </div>

                  {selected?.curso_id === curso.curso_id && (
                    <div className="mt-4 pt-4 grid grid-cols-2 gap-3 slide-in" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      {[
                        { label: 'VAR resueltos', val: `${curso.pct_var_resueltos}%`, color: '#FCA5A5' },
                        { label: 'Resolutivo', val: `${curso.puntaje_resolutivo}/30`, color: '#FCA5A5' },
                        { label: 'Formativo', val: `${curso.puntaje_formativo}/30`, color: '#6EE7B7' },
                        { label: 'Preventivo', val: `${curso.puntaje_preventivo}/20`, color: '#93C5FD' },
                        { label: 'Académico', val: `${curso.puntaje_academico}/20`, color: '#FCD34D' },
                        { label: 'Total', val: `${curso.puntaje_total}/100`, color: '#C9A84C' },
                      ].map(({ label, val, color }) => (
                        <div key={label}>
                          <div style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', fontSize: '0.7rem', letterSpacing: '0.1em' }}>{label.toUpperCase()}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Cursos SIN datos - separados y atenuados */}
              {sinDatos.length > 0 && conDatos.length > 0 && (
                <div className="mt-4">
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#374151', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '8px', paddingLeft: '4px' }}>
                    SIN DATOS CARGADOS — {MESES[mes].toUpperCase()}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {sinDatos.map(curso => (
                      <div key={curso.curso_id} className="rounded-lg p-3 text-center"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#374151' }}>
                          {curso.curso_nombre}
                        </div>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: '#1F2937', fontSize: '0.7rem' }}>sin datos</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GRAFICO TAB */}
          {!loading && tab === 'grafico' && (
            <div className="space-y-6 max-w-3xl">
              {conDatos.length === 0 ? (
                <div className="text-center py-12" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  No hay datos para graficar en {MESES[mes]}
                </div>
              ) : (
                <>
                  <div className="glass rounded-xl p-4">
                    <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '16px' }}>
                      PUNTAJE TOTAL POR CURSO — {MESES[mes].toUpperCase()}
                    </div>
                    <ResponsiveContainer width="100%" height={Math.max(conDatos.length * 36, 150)}>
                      <BarChart data={chartData} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" tick={{ fill: '#D1D5DB', fontSize: 12, fontFamily: 'var(--font-condensed)' }} width={42} />
                        <Tooltip contentStyle={{ background: '#1B3A6B', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', color: 'white' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar dataKey="Total" fill="#C9A84C" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '16px' }}>
                      DIMENSIONES POR CURSO
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'var(--font-condensed)' }} />
                        <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#1B3A6B', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', color: 'white' }} />
                        <Legend wrapperStyle={{ fontFamily: 'var(--font-condensed)', fontSize: '11px' }} />
                        <Bar dataKey="Resolutivo" fill="#DC2626" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="Formativo" fill="#059669" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="Preventivo" fill="#2563EB" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="Académico" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          )}

          {/* DETALLE TAB */}
          {!loading && tab === 'detalle' && (
            <div className="max-w-2xl">
              {conDatos.length === 0 ? (
                <div className="text-center py-12" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  No hay datos cargados para {MESES[mes]}
                </div>
              ) : (
                <div className="glass rounded-xl overflow-hidden">
                  <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                      TABLA DETALLADA — {MESES[mes].toUpperCase()} {anio}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-condensed)', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {['#', 'Curso', 'Res.', 'Form.', 'Prev.', 'Acad.', 'Total'].map(h => (
                            <th key={h} style={{ padding: '10px 8px', color: '#6B7280', letterSpacing: '0.05em', textAlign: 'center' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {conDatos.map((r, i) => (
                          <tr key={r.curso_id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#6B7280' }}>{i + 1}</td>
                            <td style={{ padding: '10px 8px', color: 'white', fontWeight: 600 }}>{r.curso_nombre}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#FCA5A5' }}>{r.puntaje_resolutivo}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#6EE7B7' }}>{r.puntaje_formativo}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#93C5FD' }}>{r.puntaje_preventivo}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#FCD34D' }}>{r.puntaje_academico}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: getScoreColor(r.puntaje_total), fontWeight: 700, fontSize: '1rem' }}>{r.puntaje_total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
