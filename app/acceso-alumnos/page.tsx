'use client'
import Link from 'next/link'
import { BookOpen, BarChart3 } from 'lucide-react'

const ITEMS = [
  {
    href: '/ranking-publico',
    icon: BarChart3,
    label: 'RANKING GENERAL',
    desc: 'Visualización pública del avance de los cursos.',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.4)',
  },
  {
    href: '/reglas',
    icon: BookOpen,
    label: 'REGLAS',
    desc: 'Consulta de criterios, acuerdos y funcionamiento del modelo.',
    color: '#0E7490',
    colorLight: 'rgba(14,116,144,0.15)',
    border: 'rgba(14,116,144,0.4)',
  },
]

export default function AccesoAlumnosPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0a0a1a, #1a0a3d, #0a0a1a)',
        borderBottom: '1px solid rgba(124,58,237,0.25)',
        padding: '28px 20px 22px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '8px',
          padding: '4px 14px',
          marginBottom: '12px',
        }}>
          <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(167,139,250,0.8)', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            ACCESO ALUMNOS
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem,8vw,3rem)',
          color: '#A78BFA',
          letterSpacing: '0.06em',
          margin: '0 0 6px',
          lineHeight: 1,
        }}>
          CONVIVENCIA VIDELIANA
        </h1>
        <p style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', letterSpacing: '0.1em', margin: 0 }}>
          Consultá el ranking y las reglas del modelo
        </p>
      </header>

      {/* Cards */}
      <main style={{ maxWidth: '420px', margin: '0 auto', padding: '32px 16px 40px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ITEMS.map(({ href, icon: Icon, label, desc, color, colorLight, border }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: colorLight,
                border: `1px solid ${border}`,
                borderRadius: '14px',
                padding: '22px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 20px ${border}`
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', flexShrink: 0,
                  background: `${color}22`,
                  border: `1px solid ${border}`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.5rem', letterSpacing: '0.05em', lineHeight: 1.1 }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.84rem', marginTop: '5px', lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.4rem', alignSelf: 'center' }}>›</div>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em', marginTop: '36px' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · 2026
        </p>
      </main>
    </div>
  )
}
