'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { Shield, Trophy, ClipboardList, BarChart3, ChevronRight, History } from 'lucide-react'
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

const MEDAL = ['🥇', '🥈', '🥉']
const now = new Date()
const MES_ACTUAL  = now.getMonth() + 1
const ANIO_ACTUAL = now.getFullYear()
const MES_LABEL   = MESES[MES_ACTUAL]
const G = '#2D7A4F'; const GD = '#1A4D2E'; const O = '#E85D04'; const GOLD = '#B45309'; const R = '#C1121F'

export default function DashboardPage() {
  const [ranking,     setRanking]     = useState<RankingItem[]>([])
  const [virRecientes,setVirRec]      = useState<VIRReciente[]>([])
  const [campoCount,  setCampoCount]  = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [turno,       setTurno]       = useState<'manana' | 'tarde'>('manana')

  useEffect(() => {
    const load = async () => {
      try {
        const [rankRes, virRes, campoRes] = await Promise.all([
          fetch(`/api/ranking?mes=${MES_ACTUAL}&anio=${ANIO_ACTUAL}&modo=mensual`),
          fetch(`/api/var?mes=${MES_ACTUAL}&anio=${ANIO_ACTUAL}&limit=5`),
          fetch(`/api/campo?mes=${MES_ACTUAL}&anio=${ANIO_ACTUAL}`),
        ])
        const rankData  = await rankRes.json()
        const virData   = await virRes.json()
        const campoData = await campoRes.json()
        setRanking(rankData.ranking || [])
        setVirRec(Array.isArray(virData) ? virData.slice(0, 4) : [])
        setCampoCount(Array.isArray(campoData) ? campoData.length : 0)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const turnoInfo    = TURNOS.find(t => t.id === turno)!
  const rankingTurno = ranking.filter(r => getTurno(r.curso_nombre) === turno)
  const conDatos     = rankingTurno.filter(r => r.tiene_datos)
  const virTurno     = virRecientes.filter(v => getTurno(v.curso_nombre) === turno)
  const totalVIRmes  = ranking.reduce((s,r) => s + (r.pct_var_resueltos > 0 ? 1 : 0), 0)

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div style={{ background: GD, borderBottom: `3px solid ${O}` }}>
          <div className="px-5 py-5">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img src="/escudo.jpg" alt="Escudo" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${O}`, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>CLIMA VIDELIANO</div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '2px' }}>Sistema de seguimiento del clima escolar</div>
              </div>
            </div>

            {/* Separador con fecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.12)' }} />
              <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                {MES_LABEL.toUpperCase()} {ANIO_ACTUAL} · EN CURSO
              </span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Selector de turno */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {TURNOS.map(t => (
                <button key={t.id} onClick={() => setTurno(t.id as any)} style={{
                  flex: 1, padding: '9px 12px', borderRadius: '10px', cursor: 'pointer',
                  border: `2px solid ${turno === t.id ? O : 'rgba(255,255,255,0.2)'}`,
                  background: turno === t.id ? O : 'rgba(255,255,255,0.06)',
                  color: 'white', textAlign: 'left', transition: 'all 0.2s',
                }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.88rem' }}>{t.emoji} {t.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', opacity: 0.7, marginTop: '1px' }}>{t.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-4 max-w-2xl" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#5A7A5C', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>CARGANDO...</div>}

          {!loading && <>

            {/* Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { label: 'Cursos activos', value: conDatos.length, sub: `${turnoInfo.sub}`, color: G, bg: '#D1FAE5', border: '#6EE7B7' },
                { label: 'VIR del mes',    value: totalVIRmes,     sub: 'cursos con VIR',  color: R, bg: '#FEE2E2', border: '#FCA5A5' },
                { label: 'Campo positivo', value: campoCount,      sub: 'acciones este mes', color: GOLD, bg: '#FEF3C7', border: '#FCD34D' },
              ].map(({ label, value, sub, color, bg, border }) => (
                <div key={label} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.66rem', fontWeight: 700, marginTop: '3px' }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color, fontSize: '0.62rem', opacity: 0.75, marginTop: '1px' }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Ranking */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--green-border)', padding: '18px', boxShadow: '0 2px 8px rgba(45,122,79,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '1rem', fontWeight: 700 }}>
                    {turnoInfo.emoji} Ranking {turnoInfo.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.75rem' }}>{MES_LABEL} {ANIO_ACTUAL}</div>
                </div>
                <Link href="/tablero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.78rem', fontWeight: 700 }}>
                  Ver todo <ChevronRight size={13}/>
                </Link>
              </div>

              {conDatos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#8A9E87', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                  Aún no hay datos para {MES_LABEL} en el {turnoInfo.label}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {conDatos.slice(0, 5).map((r, i) => (
                    <div key={r.curso_id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: i === 0 ? '#FEF9E7' : '#F9FAFB', border: `1.5px solid ${i === 0 ? '#FCD34D' : 'var(--green-border)'}` }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', minWidth: '26px' }}>
                        {i < 3 ? MEDAL[i] : <span style={{ color: '#8A9E87', fontSize: '0.85rem' }}>#{i+1}</span>}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: GD, letterSpacing: '0.04em', lineHeight: 1 }}>{r.curso_nombre}</div>
                        <div style={{ background: '#E5E7EB', borderRadius: '4px', height: '5px', marginTop: '5px', overflow: 'hidden' }}>
                          <div style={{ background: i === 0 ? GOLD : G, height: '100%', width: `${r.puntaje_total}%`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: i === 0 ? GOLD : G, minWidth: '56px', textAlign: 'right' }}>
                        {r.puntaje_total}<span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.62rem', color: '#8A9E87' }}> pts</span>
                      </div>
                      <ChevronRight size={13} style={{ color: '#CBD5E1', flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dimensiones promedio */}
            {conDatos.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--green-border)', padding: '18px', boxShadow: '0 2px 8px rgba(45,122,79,0.07)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Dimensiones del clima</div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.75rem', marginBottom: '12px' }}>Promedio · {turnoInfo.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { icon: '🛡️', label: 'Resolutivo', val: Math.round(conDatos.reduce((s,r) => s + r.puntaje_resolutivo, 0) / conDatos.length), max: 40, color: R, bg: '#FEE2E2', border: '#FCA5A5' },
                    { icon: '📋', label: 'Formativo',  val: Math.round(conDatos.reduce((s,r) => s + r.puntaje_formativo, 0) / conDatos.length),  max: 40, color: G, bg: '#D1FAE5', border: '#6EE7B7' },
                    { icon: '⭐', label: 'Campo',      val: Math.round(conDatos.reduce((s,r) => s + (r.puntaje_campo||0), 0) / conDatos.length),  max: 20, color: GOLD, bg: '#FEF3C7', border: '#FCD34D' },
                  ].map(({ icon, label, val, max, color, bg, border }) => (
                    <div key={label} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', marginBottom: '3px' }}>{icon}</div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color, fontWeight: 700, fontSize: '0.68rem' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.4rem', lineHeight: 1, margin: '3px 0' }}>{val}</div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.62rem', opacity: 0.75 }}>/ {max} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones rápidas */}
            <div>
              <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>Acciones</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { href: '/var',         icon: Shield,       label: 'Registrar VIR',  sub: 'Incidencia o reparación',  color: R,    bg: '#FEE2E2', border: '#FCA5A5' },
                  { href: '/campo',       icon: Trophy,       label: 'Acción positiva', sub: 'Campo positivo',           color: GOLD, bg: '#FEF3C7', border: '#FCD34D' },
                  { href: '/indicadores', icon: ClipboardList,label: 'Indicadores',     sub: 'Formativo y académico',    color: G,    bg: '#D1FAE5', border: '#6EE7B7' },
                  { href: '/historial',   icon: History,      label: 'Historial VIR',   sub: 'Ver todos los registros',  color: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD' },
                ].map(({ href, icon: Icon, label, sub, color, bg, border }) => (
                  <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', border: `2px solid ${border}`, borderRadius: '14px', padding: '14px 12px', cursor: 'pointer', height: '100%' }}>
                      <div style={{ width: '36px', height: '36px', background: bg, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.88rem' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.72rem', marginTop: '2px' }}>{sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* VIR recientes del turno */}
            {virTurno.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--green-border)', padding: '18px', boxShadow: '0 2px 8px rgba(45,122,79,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '1rem', fontWeight: 700 }}>VIR recientes</div>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.75rem' }}>{turnoInfo.label} · {MES_LABEL}</div>
                  </div>
                  <Link href="/historial" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.78rem', fontWeight: 700 }}>
                    Ver todo <ChevronRight size={13}/>
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {virTurno.map(v => (
                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: '#F9FAFB', border: '1.5px solid var(--green-border)' }}>
                      <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: v.resuelto ? G : R, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.82rem' }}>{v.curso_nombre}</div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.73rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.tipo_situacion}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.68rem', background: v.resuelto ? '#D1FAE5' : '#FEE2E2', color: v.resuelto ? G : R, padding: '2px 8px', borderRadius: '20px', fontWeight: 700, flexShrink: 0 }}>
                        {v.resuelto ? 'Resuelto' : 'Escalado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: '#8A9E87', fontSize: '0.72rem', paddingTop: '4px' }}>
              Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo
            </div>
          </>}
        </div>
      </main>
    </div>
  )
}
