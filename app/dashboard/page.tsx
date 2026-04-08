'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { Shield, Trophy, ClipboardList, ChevronRight, History, TrendingUp, AlertTriangle, Star } from 'lucide-react'
import { MESES, getTurno, TURNOS } from '@/lib/scoring'

interface RankingItem {
  curso_id: number; curso_nombre: string
  puntaje_total: number; puntaje_resolutivo: number
  puntaje_formativo: number; puntaje_campo: number
  pct_var_resueltos: number; tiene_datos: boolean
}
interface VIRReciente {
  id: number; curso_nombre: string; tipo_situacion: string; resuelto: boolean; created_at: string
}

const MEDAL_ICON = ['🏆','🥈','🥉']
const now = new Date()
const MES_ACTUAL  = now.getMonth() + 1
const ANIO_ACTUAL = now.getFullYear()
const MES_LABEL   = MESES[MES_ACTUAL]
const GD = '#1A4D2E'; const G = '#2D7A4F'; const O = '#E85D04'; const GOLD = '#B45309'; const R = '#C1121F'

export default function DashboardPage() {
  const [ranking,    setRanking]    = useState<RankingItem[]>([])
  const [virMes,     setVirMes]     = useState<VIRReciente[]>([])
  const [campoList,  setCampoList]  = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [turno,      setTurno]      = useState<'manana' | 'tarde'>('manana')

  useEffect(() => {
    const load = async () => {
      try {
        const [rankRes, virRes, campoRes] = await Promise.all([
          fetch(`/api/ranking?mes=${MES_ACTUAL}&anio=${ANIO_ACTUAL}&modo=mensual`),
          fetch(`/api/var?mes=${MES_ACTUAL}&anio=${ANIO_ACTUAL}&limit=50`),
          fetch(`/api/campo?mes=${MES_ACTUAL}&anio=${ANIO_ACTUAL}`),
        ])
        const rankData = await rankRes.json()
        const virData  = await virRes.json()
        const campoData = await campoRes.json()
        setRanking(rankData.ranking || [])
        setVirMes(Array.isArray(virData) ? virData : [])
        setCampoList(Array.isArray(campoData) ? campoData : [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const turnoInfo    = TURNOS.find(t => t.id === turno)!
  const rankTurno    = ranking.filter(r => getTurno(r.curso_nombre) === turno)
  const conDatos     = rankTurno.filter(r => r.tiene_datos)
  const top1         = conDatos[0]
  const promedio     = conDatos.length > 0 ? Math.round(conDatos.reduce((s, r) => s + r.puntaje_total, 0) / conDatos.length) : 0
  const incidencias  = virMes.filter(v => !v.resuelto && getTurno(v.curso_nombre) === turno).length
  const accPositivas = campoList.filter(c => getTurno(c.curso_nombre) === turno).length
  const pFormativo   = conDatos.length > 0 ? Math.round(conDatos.reduce((s,r) => s + r.puntaje_formativo, 0) / conDatos.length) : 0
  const pAcademico   = 0 // por período, no mensual

  return (
    <div style={{ background: '#F5F5F0', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-4" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* ── TURNO SELECTOR (top bar) ── */}
        <div style={{ display: 'flex', background: 'white', borderBottom: '1px solid #E5E7EB' }}>
          {TURNOS.map(t => (
            <button key={t.id} onClick={() => setTurno(t.id as any)}
              style={{
                flex: 1, padding: '14px 20px', border: 'none', cursor: 'pointer',
                background: turno === t.id ? O : 'white',
                borderBottom: turno === t.id ? `3px solid ${GD}` : '3px solid transparent',
                textAlign: 'left', transition: 'all 0.2s',
              }}>
              <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '1rem', color: turno === t.id ? 'white' : '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>{t.emoji}</span> {t.label}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: turno === t.id ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: '2px' }}>{t.sub}</div>
            </button>
          ))}
        </div>

        <div className="px-5 py-5" style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8A9E87', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>CARGANDO...</div>
          ) : (
            <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* ── PANEL PRINCIPAL DEL TURNO ── */}
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.3rem', color: GD, fontWeight: 700, margin: 0 }}>{turnoInfo.label}</h2>
                  <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.8rem', margin: '2px 0 0' }}>Sistema de seguimiento institucional</p>
                </div>

                {/* 3 métricas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
                  {/* Promedio convivencia */}
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '8px', flexShrink: 0 }}>
                        <TrendingUp size={18} style={{ color: G }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.78rem', fontWeight: 600 }}>Promedio convivencia:</div>
                        <div style={{ fontFamily: 'var(--font-display)', color: GD, fontSize: '1.8rem', lineHeight: 1.1 }}>{promedio} <span style={{ fontSize: '1rem', color: '#5A7A5C' }}>pts</span></div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#8A9E87', fontSize: '0.72rem', marginTop: '3px' }}>Cursos activos: {conDatos.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Incidencias activas */}
                  <div style={{ background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ background: '#FEE2E2', borderRadius: '8px', padding: '8px', flexShrink: 0 }}>
                        <AlertTriangle size={18} style={{ color: R }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#7F1D1D', fontSize: '0.78rem', fontWeight: 600 }}>Incidencias activas</div>
                        <div style={{ fontFamily: 'var(--font-display)', color: R, fontSize: '1.8rem', lineHeight: 1.1 }}>{incidencias}</div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.72rem', marginTop: '3px' }}>
                          {incidencias === 0 ? 'Sin escaladas' : `incidencia${incidencias !== 1 ? 's' : ''}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones positivas */}
                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '8px', flexShrink: 0 }}>
                        <Star size={18} style={{ color: GOLD }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#78350F', fontSize: '0.78rem', fontWeight: 600 }}>Acciones positivas</div>
                        <div style={{ fontFamily: 'var(--font-display)', color: GOLD, fontSize: '1.8rem', lineHeight: 1.1 }}>{accPositivas}</div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.72rem', marginTop: '3px' }}>
                          {accPositivas === 0 ? 'este mes' : `accion${accPositivas !== 1 ? 'es' : ''}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Curso destacado */}
                {top1 && (
                  <Link href="/tablero" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#FAFAFA', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = GOLD}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'}>
                      <span style={{ fontSize: '1.6rem' }}>🏆</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem' }}>Curso destacado: </span>
                        <span style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '1rem', fontWeight: 700 }}>{top1.curso_nombre}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', color: GD, fontSize: '1.2rem' }}>{top1.puntaje_total} <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.8rem', color: '#9CA3AF' }}>pts</span></div>
                      <ChevronRight size={16} style={{ color: '#CBD5E1' }} />
                    </div>
                  </Link>
                )}
                {conDatos.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#9CA3AF', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                    No hay datos cargados para {MES_LABEL} en el {turnoInfo.label}.
                  </div>
                )}
              </div>

              {/* ── RANKING DEL MES ── */}
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.1rem', color: GD, fontWeight: 700, margin: 0 }}>Ranking del mes</h3>
                  <span style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.82rem' }}>{MES_LABEL} {ANIO_ACTUAL}</span>
                </div>

                {conDatos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                    Sin datos para este mes.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {conDatos.slice(0, 5).map((r, i) => (
                      <Link key={r.curso_id} href="/tablero" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
                          <span style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.9rem', minWidth: '18px', fontWeight: 600 }}>{i+1}°</span>
                          <span style={{ fontSize: '1.3rem' }}>{i < 3 ? MEDAL_ICON[i] : '  '}</span>
                          <span style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '1.05rem', fontWeight: 700, flex: 1 }}>{r.curso_nombre}</span>
                          {i === 2 && conDatos.length > 3 && (
                            <span style={{ fontFamily: 'var(--font-body)', color: G, fontSize: '0.78rem', fontWeight: 600 }}>Ver ranking completo</span>
                          )}
                          <span style={{ fontFamily: 'var(--font-display)', color: GD, fontSize: '1.2rem', minWidth: '70px', textAlign: 'right' }}>
                            {r.puntaje_total} <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.72rem', color: '#9CA3AF' }}>pts</span>
                          </span>
                          <ChevronRight size={15} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── PANEL DE CONVIVENCIA (acciones) ── */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.1rem', color: GD, fontWeight: 700, margin: '0 0 12px' }}>Panel de convivencia</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

                  {/* Activar VIR */}
                  <Link href="/var" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', border: '1px solid #FEE2E2', borderRadius: '14px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = R}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ background: '#FEE2E2', borderRadius: '8px', padding: '8px' }}>
                          <Shield size={18} style={{ color: R }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.95rem' }}>Activar VIR</span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.78rem', margin: 0 }}>Incidencia o reparación</p>
                    </div>
                  </Link>

                  {/* Acción positiva */}
                  <Link href="/campo" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', border: '1px solid #FDE68A', borderRadius: '14px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = GOLD}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#FDE68A'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '8px' }}>
                          <Star size={18} style={{ color: GOLD }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.95rem' }}>Acción positiva</span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', color: GOLD, fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>Registrar reconocimiento</p>
                    </div>
                  </Link>

                  {/* Historial + info + botón VIR */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/historial" style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', border: '1px solid #DBEAFE', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#93C5FD'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#DBEAFE'}>
                        <div style={{ background: '#DBEAFE', borderRadius: '7px', padding: '7px' }}>
                          <History size={16} style={{ color: '#1D4ED8' }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.88rem' }}>Historial VIR</div>
                          <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.72rem' }}>Ver registros recientes</div>
                        </div>
                      </div>
                    </Link>

                    {/* Info formativo/académico */}
                    <Link href="/indicadores" style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', border: '1px solid #D1FAE5', borderRadius: '12px', padding: '12px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = G}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#D1FAE5'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <ClipboardList size={14} style={{ color: G }} />
                          <span style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.82rem' }}>Indicadores</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.74rem' }}>
                          Formativo: <strong>{pFormativo} / 40 pts</strong>
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#78350F', fontSize: '0.74rem' }}>
                          Académico: <strong>por período</strong>
                        </div>
                      </div>
                    </Link>

                    {/* Botón principal VIR */}
                    <Link href="/var" style={{ textDecoration: 'none' }}>
                      <div style={{ background: GD, borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = G}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = GD}>
                        <span style={{ fontFamily: 'var(--font-condensed)', color: 'white', fontWeight: 700, fontSize: '1rem' }}>+ Activar VIR</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.73rem', paddingBottom: '4px' }}>
                Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
