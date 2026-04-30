'use client'
import Link from 'next/link'
import { BarChart3, BookOpen } from 'lucide-react'

const GD = '#0A1628'
const GOLD = '#C9A84C'

const SECCIONES = [
  {
    href: '/ranking-publico',
    icon: BarChart3,
    label: 'RANKING GENERAL',
    desc: 'Mirá la posición de todos los cursos en tiempo real.',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.35)',
    badge: '🏆 VER POSICIONES',
  },
  {
    href: '/reglas',
    icon: BookOpen,
    label: 'REGLAS',
    desc: 'Conocé los criterios, acuerdos y el sistema de puntos del modelo.',
    color: '#0E7490',
    colorLight: 'rgba(14,116,144,0.12)',
    border: 'rgba(14,116,144,0.35)',
    badge: '📋 VER REGLAS',
  },
]

export default function AlumnosPage() {
  return (
    <div style={{ minHeight: '100vh', background: GD }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0A1628, #1a0a00)',
        borderBottom: `2px solid ${GOLD}`,
        padding: '0 20px',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>CONVIVENCIA</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: GOLD, letterSpacing: '0.05em', lineHeight: 1 }}>VIDELIANA</div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
            ACCESO ALUMNOS
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.25)`,
            borderRadius: '20px', padding: '5px 16px', marginBottom: '14px'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: GOLD }} />
            <span style={{ fontFamily: 'var(--font-condensed)', color: GOLD, fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 700 }}>
              ZONA ALUMNOS
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,7vw,2.8rem)', color: 'white', letterSpacing: '0.05em', marginBottom: '10px' }}>
            ¿QUÉ QUERÉS<br/><span style={{ color: GOLD }}>VER?</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Acceso libre · Sin login requerido
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SECCIONES.map(({ href, icon: Icon, label, desc, color, colorLight, border, badge }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: colorLight,
                border: `2px solid ${border}`,
                borderRadius: '20px',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${border}`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{
                    width: '54px', height: '54px', flexShrink: 0,
                    background: `${color}22`,
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${border}`,
                  }}>
                    <Icon size={26} style={{ color }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color, letterSpacing: '0.05em' }}>
                    {label}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '14px' }}>
                  {desc}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: color, color: 'white',
                  fontFamily: 'var(--font-condensed)', fontWeight: 700,
                  fontSize: '0.78rem', letterSpacing: '0.1em',
                  padding: '6px 16px', borderRadius: '8px'
                }}>
                  {badge}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', marginTop: '40px' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · 2026
        </div>
      </main>
    </div>
  )
}
