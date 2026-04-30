'use client'
import Link from 'next/link'
import { Shield, BarChart2, Star, BookOpen, BarChart3 } from 'lucide-react'

const GD = '#0A1628'
const CYAN = '#22D3EE'
const O = '#E85D04'

const SECCIONES = [
  {
    href: '/var?qr=1',
    icon: Shield,
    label: 'ACTIVAR VIR',
    desc: 'Ante conflictos o situaciones que requieren intervención y reparación.',
    color: '#C1121F',
    colorLight: 'rgba(193,18,31,0.12)',
    border: 'rgba(193,18,31,0.35)',
  },
  {
    href: '/indicadores?qr=1',
    icon: BarChart2,
    label: 'INDICADORES',
    desc: 'Carga periódica de asistencia, uniforme, hábitos y datos del curso.',
    color: '#2D7A4F',
    colorLight: 'rgba(45,122,79,0.12)',
    border: 'rgba(45,122,79,0.35)',
  },
  {
    href: '/campo?qr=1',
    icon: Star,
    label: 'ACCIONES POSITIVAS',
    desc: 'Registro de aportes destacados, proyectos, actos y acciones formativas.',
    color: '#B45309',
    colorLight: 'rgba(180,83,9,0.12)',
    border: 'rgba(180,83,9,0.35)',
  },
  {
    href: '/reglas',
    icon: BookOpen,
    label: 'REGLAS',
    desc: 'Consulta de criterios, acuerdos y funcionamiento del modelo.',
    color: '#0E7490',
    colorLight: 'rgba(14,116,144,0.12)',
    border: 'rgba(14,116,144,0.35)',
  },
  {
    href: '/ranking-publico',
    icon: BarChart3,
    label: 'RANKING GENERAL',
    desc: 'Visualización pública del avance de los cursos.',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.35)',
  },
]

export default function DocentesPage() {
  return (
    <div style={{ minHeight: '100vh', background: GD }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0A1628, #0f2442)',
        borderBottom: `2px solid ${CYAN}`,
        padding: '0 20px',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${CYAN}` }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>CONVIVENCIA</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: CYAN, letterSpacing: '0.05em', lineHeight: 1 }}>VIDELIANA</div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
            ACCESO DOCENTE
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(34,211,238,0.08)', border: `1px solid rgba(34,211,238,0.25)`,
            borderRadius: '20px', padding: '5px 16px', marginBottom: '14px'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: CYAN }} />
            <span style={{ fontFamily: 'var(--font-condensed)', color: CYAN, fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 700 }}>
              DOCENTES · PRECEPTORAS · SOE
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,6vw,2.4rem)', color: 'white', letterSpacing: '0.05em', marginBottom: '8px' }}>
            PANEL MAESTRO
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Seleccioná la sección que querés usar.<br/>
            No hace falta login — acceso directo desde el QR.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SECCIONES.map(({ href, icon: Icon, label, desc, color, colorLight, border }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: colorLight,
                border: `2px solid ${border}`,
                borderRadius: '16px',
                padding: '20px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${border}`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}>
                <div style={{
                  width: '48px', height: '48px', flexShrink: 0,
                  background: `rgba(${color === '#C1121F' ? '193,18,31' : color === '#2D7A4F' ? '45,122,79' : color === '#B45309' ? '180,83,9' : color === '#0E7490' ? '14,116,144' : '124,58,237'},0.2)`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${border}`,
                }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color, letterSpacing: '0.05em', marginBottom: '3px' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, color: 'rgba(255,255,255,0.2)' }}>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '40px' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · 2026
        </div>
      </main>
    </div>
  )
}
