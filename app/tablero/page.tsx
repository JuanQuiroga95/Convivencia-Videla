'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { BarChart3, Trophy, RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { getPeriodoLabel } from '@/lib/scoring'

interface PuntajeData {
  curso_id: number
  curso_nombre: string
  puntaje_total: number
  puntaje_resolutivo: number
  puntaje_formativo: number
  puntaje_academico: number
  pct_var_resueltos: number
  tiene_datos: boolean
}

const MEDAL = ['🥇', '🥈', '🥉']

const getScoreColor = (score: number) => {
  if (score >= 75) return '#2D7A4F'
  if (score >= 50) return '#E85D04'
  if (score >= 25) return '#B45309'
  return '#8A9E87'
}

export default function TableroPage() {
  const now = new Date()
  const currentPeriodo = now.getMonth() < 7 ? 1 : 2
  const [periodo, setPeriodo] = useState(currentPeriodo)
  const [anio] = useState(now.getFullYear())
  const [ranking, setRanking] = useState<PuntajeData[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'ranking' | 'grafico'>('ranking')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ranking?periodo=${periodo}&anio=${anio}&t=${Date.now()}`)
      const data = await res.json()
      setRanking(data.ranking || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadData() }, [periodo])

  const conDatos = ranking.filter(r => r.tiene_datos)
  const sinDatos = ranking.filter(r => !r.tiene_datos)

  const chartData = conDatos.map(r => ({
    name: r.curso_nombre,
    Resolutivo: r.puntaje_resolutivo,
    Formativo: r.puntaje_formativo,
    Académico: r.puntaje_academico,
  }))

  const G = '#2D7A4F'
  const O = '#E85D04'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">
        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.2)' }}>
                <BarChart3 size={24} style={{ color: 'var(--orange)' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                  TABLERO
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                  Ranking por período · {getPeriodoLabel(periodo)} · {anio}
                  {conDatos.length > 0 && (
                    <span style={{ color: '#6EE7B7', marginLeft: '8px' }}>
                      · {conDatos.length} curso{conDatos.length !== 1 ? 's' : ''} con datos
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Periodo selector */}
              <div className="flex gap-1">
                {[1, 2].map(p => (
                  <button key={p} onClick={() => setPeriodo(p)}
                    style={{
                      background: periodo === p ? O : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: `1.5px solid ${periodo === p ? O : 'rgba(255,255,255,0.2)'}`,
                      borderRadius: '8px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                    }}>
                    Período {p}
                  </button>
                ))}
              </div>
              <button onClick={loadData} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: 'white' }}>
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex gap-2 mt-4">
            {(['ranking', 'grafico'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? G : 'rgba(255,255,255,0.55)',
                  border: `1px solid ${tab === t ? 'white' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '6px', padding: '5px 16px', cursor: 'pointer',
                  fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em', fontSize: '0.85rem', fontWeight: 700,
                }}>
                {t === 'ranking' ? '🏆 Ranking' : '📊 Gráfico'}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6">
          {loading && (
            <div className="text-center py-16">
              <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>CARGANDO...</div>
            </div>
          )}

          {!loading && tab === 'ranking' && (
            <div className="max-w-2xl">
              {/* Legend */}
              <div className="flex gap-3 flex-wrap mb-5">
                {[
                  { label: 'Resolutivo', color: '#C1121F' },
                  { label: 'Formativo', color: G },
                  { label: 'Académico', color: O },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2" style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                    {label}
                  </div>
                ))}
              </div>

              <div className="space-y-3 stagger">
                {conDatos.map((r, i) => (
                  <div key={r.curso_id} className="rounded-xl card-hover" style={{ border: '1.5px solid var(--green-border)', background: 'white', overflow: 'hidden' }}>
                    <div style={{ height: '4px', background: `linear-gradient(90deg, ${getScoreColor(r.puntaje_total)}, ${O})` }} />
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', minWidth: '36px', textAlign: 'center' }}>
                          {i < 3 ? MEDAL[i] : <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>#{i + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', color: 'var(--green-dark)' }}>
                            {r.curso_nombre}
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: getScoreColor(r.puntaje_total), lineHeight: 1 }}>
                          {r.puntaje_total}
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div style={{ background: 'var(--bg-alt)', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div style={{ background: `linear-gradient(90deg, ${getScoreColor(r.puntaje_total)}, ${O})`, height: '100%', width: `${r.puntaje_total}%`, transition: 'width 0.8s ease', borderRadius: '4px' }} />
                      </div>

                      {/* Dimension breakdown */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Resolutivo', val: r.puntaje_resolutivo, max: 40, color: '#C1121F', bgColor: 'rgba(193,18,31,0.07)' },
                          { label: 'Formativo', val: r.puntaje_formativo, max: 40, color: G, bgColor: 'rgba(45,122,79,0.08)' },
                          { label: 'Académico', val: r.puntaje_academico, max: 20, color: O, bgColor: 'rgba(232,93,4,0.07)' },
                        ].map(({ label, val, max, color, bgColor }) => (
                          <div key={label} className="text-center p-2 rounded-lg" style={{ background: bgColor }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color }}>{val}</div>
                            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{label} /{max}</div>
                          </div>
                        ))}
                      </div>

                      {r.pct_var_resueltos > 0 && (
                        <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                          VIR resueltos: <span style={{ color: G, fontWeight: 700 }}>{r.pct_var_resueltos}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {sinDatos.length > 0 && (
                <div className="mt-6">
                  <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                    SIN DATOS CARGADOS EN ESTE PERÍODO
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sinDatos.map(r => (
                      <span key={r.curso_id} style={{ fontFamily: 'var(--font-condensed)', background: 'var(--bg-alt)', border: '1px solid var(--green-border)', color: 'var(--text-muted)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.85rem' }}>
                        {r.curso_nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && tab === 'grafico' && chartData.length > 0 && (
            <div className="max-w-3xl">
              <div className="rounded-xl p-4" style={{ border: '1.5px solid var(--green-border)', background: 'white' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  PUNTAJE POR DIMENSIÓN · {getPeriodoLabel(periodo)}
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 30, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,122,79,0.1)" />
                    <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-condensed)', fontSize: 11, fill: 'var(--text-secondary)' }} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fontFamily: 'var(--font-condensed)', fontSize: 11, fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={{ fontFamily: 'var(--font-condensed)', border: '1px solid var(--green-border)', borderRadius: '8px', background: 'white', color: 'var(--text-primary)' }} />
                    <Legend wrapperStyle={{ fontFamily: 'var(--font-condensed)', fontSize: '12px' }} />
                    <Bar dataKey="Resolutivo" fill="#C1121F" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Formativo" fill={G} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Académico" fill={O} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!loading && chartData.length === 0 && tab === 'grafico' && (
            <div className="text-center py-16" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              No hay datos cargados para graficar en este período.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
