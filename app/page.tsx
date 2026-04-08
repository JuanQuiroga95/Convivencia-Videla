'use client'
import Link from 'next/link'
import { BarChart3, BookOpen, LogIn, Shield, History } from 'lucide-react'

const NAV_CARDS = [
  { href: '/ranking-publico', icon: BarChart3, label: 'RANKING', sub: 'Ver ranking de cursos', bg: '#1A4D2E', border: '#E85D04' },
  { href: '/criterios', icon: BookOpen, label: 'CRITERIOS', sub: 'Reglas y sistema de puntos', bg: '#1D4ED8', border: '#93C5FD' },
]

const ACCESOS = [
  { href: '/var',      icon: Shield,   label: 'Activar VIR',   color: '#E85D04' },
  { href: '/historial',icon: History,  label: 'Historial VIR', color: '#2D7A4F' },
  { href: '/tablero',  icon: BarChart3, label: 'Tablero',       color: '#1D4ED8' },
]

const DIMS = [
  { label: 'RESOLUTIVO', pts: '40 pts', color: '#991B1B', bg: '#FEE2E2', border: '#FCA5A5', desc: 'VIR, actas, ICE' },
  { label: 'FORMATIVO',  pts: '40 pts', color: '#064E3B', bg: '#D1FAE5', border: '#6EE7B7', desc: 'Uniforme, asistencia, entorno' },
  { label: 'ACADÉMICO',  pts: '20 pts', color: '#92400E', bg: '#FEF3C7', border: '#FCD34D', desc: 'Aprobados del período' },
]

export default function Home() {
  const currentMonth = new Date().toLocaleString('es-AR', { month: 'long' })
  const currentYear  = new Date().getFullYear()

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>

      {/* Header */}
      <header style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--orange)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', letterSpacing: '0.06em', color: 'white' }}>CONVIVENCIA VIDELIANA</span>
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', letterSpacing: '0.1em' }}>VIDELA</span>
          </div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--orange)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', cursor: 'pointer', fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogIn size={15}/> PANEL
            </button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 60px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '48px 0 40px' }}>
          <img src="/escudo.jpg" alt="Escudo Esc. N° 4-012"
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--orange)', display: 'block', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(232,93,4,0.3)' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,93,4,0.1)', border: '1px solid rgba(232,93,4,0.35)', borderRadius: '20px', padding: '5px 16px', marginBottom: '18px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--orange)' }} className="pulse" />
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', fontSize: '0.78rem', letterSpacing: '0.15em', fontWeight: 700 }}>
              {currentMonth.toUpperCase()} {currentYear} · EN CURSO
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.05, marginBottom: '10px', color: 'var(--green-dark)' }}>
            CONVIVENCIA<br/><span style={{ color: 'var(--orange)' }}>VIDELIANA</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: '#2D5A30', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            Sistema de seguimiento del clima escolar
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.82rem', marginTop: '4px' }}>
            VIR · Indicadores · Acciones formativas
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: '#8A9E87', fontSize: '0.78rem', marginTop: '4px' }}>
            Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza
          </p>
        </div>

        {/* Cards principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '680px', margin: '0 auto 40px' }}>
          {NAV_CARDS.map(({ href, icon: Icon, label, sub, bg, border }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{ background: bg, borderRadius: '16px', padding: '26px 20px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', border: `2px solid ${border}` }}>
                <div style={{ width: '54px', height: '54px', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: `2px solid ${border}` }}>
                  <Icon size={26} style={{ color: border }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'white', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginTop: '5px' }}>{sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dimensiones */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--green-dark)', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '16px' }}>
            DIMENSIONES DEL MODELO
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
            {DIMS.map(d => (
              <div key={d.label} style={{ background: d.bg, border: `2px solid ${d.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: d.color, fontSize: '0.7rem', letterSpacing: '0.12em', fontWeight: 700 }}>{d.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', color: d.color, fontSize: '1.6rem', margin: '3px 0' }}>{d.pts}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: d.color, fontSize: '0.72rem', opacity: 0.85 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos internos */}
        <div style={{ background: '#E8F5EE', border: '2px solid rgba(45,122,79,0.3)', borderRadius: '16px', padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--green-dark)', fontSize: '0.78rem', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '14px' }}>
            ACCESO INTERNO · PERSONAL DOCENTE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {ACCESOS.map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: `2px solid ${color}`, borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <Icon size={17} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-condensed)', color, fontWeight: 700, fontSize: '0.85rem' }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--green-dark)', padding: '18px 24px', textAlign: 'center', borderTop: '3px solid var(--orange)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · 2026
        </p>
      </footer>
    </div>
  )
}
