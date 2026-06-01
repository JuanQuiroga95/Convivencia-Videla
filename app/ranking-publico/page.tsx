'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { MESES, getTurno, TURNOS } from '@/lib/scoring'

interface RankingItem {
  curso_id: number; curso_nombre: string
  puntaje_total: number; puntaje_resolutivo: number
  puntaje_formativo: number; puntaje_campo: number
  tiene_datos: boolean
}

const MEDAL = ['🥇', '🥈', '🥉']
const now = new Date()
const MES_ACTUAL = now.getMonth() + 1
const ANIO_ACTUAL = now.getFullYear()
const GD = '#1A4D2E'; const G = '#2D7A4F'; const O = '#E85D04'; const GOLD = '#B45309'; const R = '#C1121F'

const getColor = (score: number) => score >= 70 ? G : score >= 50 ? O : score >= 30 ? GOLD : '#8A9E87'

export default function RankingPublicoPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mes, setMes]         = useState(MES_ACTUAL)
  const [turno, setTurno]     = useState<'manana' | 'tarde'>('manana')

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ranking?mes=${mes}&anio=${ANIO_ACTUAL}&modo=mensual`)
      const data = await res.json()
      setRanking(data.ranking || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { cargar() }, [mes])

  const turnoInfo = TURNOS.find(t => t.id === turno)!
  const rankTurno = ranking.filter(r => getTurno(r.curso_nombre) === turno)

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>

      {/* Header público */}
      <header style={{ background: GD, borderBottom: `3px solid ${O}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${O}` }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>CONVIVENCIA</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: O, letterSpacing: '0.05em', lineHeight: 1 }}>VIDELIANA</div>
            </div>
          </div>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
            <ArrowLeft size={14}/> Volver
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Título */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: GD, letterSpacing: '0.05em', margin: '0 0 4px' }}>RANKING DE CURSOS</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.85rem', margin: 0 }}>
            Posiciones actuales · actualizado en tiempo real
          </p>
        </div>

        {/* Selector turno */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {TURNOS.map(t => (
            <button key={t.id} onClick={() => setTurno(t.id as any)} style={{
              flex: 1, padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
              background: turno === t.id ? GD : 'white',
              border: `2px solid ${turno === t.id ? GD : 'var(--green-border)'}`,
              textAlign: 'left', transition: 'all 0.2s',
            }}>
              <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.9rem', color: turno === t.id ? 'white' : GD }}>
                {t.emoji} {t.label}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: turno === t.id ? 'rgba(255,255,255,0.65)' : '#8A9E87', marginTop: '2px' }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* Controles */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select value={mes} onChange={e => setMes(parseInt(e.target.value))}
            className="input-videla" style={{ width: 'auto', padding: '8px 14px' }}>
            {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m} {ANIO_ACTUAL}</option>)}
          </select>
          <button onClick={cargar} style={{ background: 'white', border: `1.5px solid ${G}`, borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: G, display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.82rem' }}>
            <RefreshCw size={14}/> Actualizar
          </button>
          {rankTurno.length > 0 && (
            <span style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.8rem', fontWeight: 700, background: '#D1FAE5', border: '1.5px solid #6EE7B7', borderRadius: '8px', padding: '5px 12px' }}>
              {rankTurno.length} cursos
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#5A7A5C', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>CARGANDO...</div>
        ) : rankTurno.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#8A9E87', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            No hay cursos para el {turnoInfo.label}.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rankTurno.map((r, i) => (
              <div key={r.curso_id} style={{ background: 'white', border: `2px solid ${i === 0 ? GOLD : 'var(--green-border)'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: i === 0 ? `0 2px 12px rgba(180,83,9,0.15)` : '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${getColor(r.puntaje_total)}, ${O})` }} />
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', minWidth: '32px' }}>
                      {i < 3 ? MEDAL[i] : <span style={{ color: '#8A9E87', fontSize: '1rem' }}>#{i+1}</span>}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em', color: GD, lineHeight: 1 }}>{r.curso_nombre}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: getColor(r.puntaje_total), lineHeight: 1 }}>{r.puntaje_total}</div>
                      <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.65rem', color: '#8A9E87' }}>/100 pts</div>
                    </div>
                  </div>
                  {/* Barra de progreso */}
                  <div style={{ background: '#F4F7F4', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ background: `linear-gradient(90deg, ${getColor(r.puntaje_total)}, ${O})`, height: '100%', width: `${r.puntaje_total}%`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                  </div>
                  {/* Desglose */}
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
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: '#8A9E87', fontSize: '0.75rem', marginTop: '32px', borderTop: '1px solid var(--green-border)', paddingTop: '20px' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · {ANIO_ACTUAL}
        </div>
      </div>
    </div>
  )
}
