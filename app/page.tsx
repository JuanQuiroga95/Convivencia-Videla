'use client'
import Link from 'next/link'
import { BarChart3, BookOpen, LogIn, Shield, History } from 'lucide-react'

const NAV_CARDS = [
  { href: '/tablero', icon: BarChart3, label: 'TABLERO', sub: 'Ranking por período', bg: '#1A4D2E', border: '#E85D04' },
  { href: '/reglas',  icon: BookOpen,  label: 'REGLAS',  sub: 'Criterios y sistema de puntos', bg: '#1D4ED8', border: '#93C5FD' },
]

const ACCESOS = [
  { href: '/var',      icon: Shield,   label: 'Activar VIR',  color: '#E85D04' },
  { href: '/historial',icon: History,  label: 'Historial VIR',color: '#2D7A4F' },
  { href: '/tablero',  icon: BarChart3,label: 'Tablero',       color: '#1D4ED8' },
]

const DIMS = [
  { label: 'RESOLUTIVO', pts: '40 pts', color: '#991B1B', bg: '#FEE2E2', border: '#FCA5A5', desc: 'Gestión VIR, actas, ICE' },
  { label: 'FORMATIVO',  pts: '40 pts', color: '#064E3B', bg: '#D1FAE5', border: '#6EE7B7', desc: 'Uniforme, asistencia, entorno' },
  { label: 'ACADÉMICO',  pts: '20 pts', color: '#92400E', bg: '#FEF3C7', border: '#FCD34D', desc: 'Aprobados del período' },
]

function NavCard({ href, icon: Icon, label, sub, bg, border }: typeof NAV_CARDS[0]) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: bg, borderRadius: '16px', padding: '28px 20px', textAlign: 'center',
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        border: `2px solid ${border}`,
      }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: `2px solid ${border}` }}>
          <Icon size={28} style={{ color: border }} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginTop: '6px' }}>{sub}</div>
      </div>
    </Link>
  )
}

function AccesoCard({ href, icon: Icon, label, color }: typeof ACCESOS[0]) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', border: `2px solid ${color}`, borderRadius: '10px',
        padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
      }}>
        <Icon size={18} style={{ color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-condensed)', color, fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
      </div>
    </Link>
  )
}

export default function Home() {
  const currentMonth = new Date().toLocaleString('es-AR', { month: 'long' })
  const currentYear  = new Date().getFullYear()

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>

      {/* Header */}
      <header style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} style={{ color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.06em', color: 'white' }}>VIDELA</span>
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>CONVIVENCIA 2026</span>
          </div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--orange)', color: 'white', border: 'none', borderRadius: '8px',
              padding: '8px 18px', cursor: 'pointer', fontFamily: 'var(--font-condensed)',
              fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <LogIn size={15} /> PANEL
            </button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 60px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 0 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,93,4,0.1)', border: '1px solid rgba(232,93,4,0.35)', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }} className="pulse" />
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700 }}>
              {currentMonth.toUpperCase()} {currentYear} · EN CURSO
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.05, marginBottom: '16px' }}>
            <span style={{ color: 'var(--green-dark)' }}>SISTEMA VIR</span><br />
            <span style={{ color: 'var(--orange)' }}>VIDELA CONVIVENCIA</span>
          </h1>

          <p style={{ fontFamily: 'var(--font-body)', color: '#2D5A30', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            Variable de Incidencia y Reparación · Sistema Formativo y Resolutivo
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.88rem', marginTop: '6px' }}>
            Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza
          </p>
        </div>

        {/* Accesos principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '680px', margin: '0 auto 48px' }}>
          {NAV_CARDS.map(c => <NavCard key={c.href} {...c} />)}
        </div>

        {/* Dimensiones */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--green-dark)', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '20px' }}>
            DIMENSIONES DEL MODELO
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', maxWidth: '680px', margin: '0 auto' }}>
            {DIMS.map(d => (
              <div key={d.label} style={{ background: d.bg, border: `2px solid ${d.border}`, borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: d.color, fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700 }}>{d.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', color: d.color, fontSize: '1.7rem', margin: '4px 0' }}>{d.pts}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: d.color, fontSize: '0.75rem', opacity: 0.85 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos internos */}
        <div style={{ background: '#E8F5EE', border: '2px solid rgba(45,122,79,0.3)', borderRadius: '16px', padding: '28px', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--green-dark)', fontSize: '0.8rem', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '16px' }}>
            ACCESO INTERNO · PERSONAL DOCENTE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {ACCESOS.map(a => <AccesoCard key={a.href} {...a} />)}
          </div>
        </div>

      </main>

      <footer style={{ background: 'var(--green-dark)', padding: '20px 24px', textAlign: 'center', borderTop: '3px solid var(--orange)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · 2026
        </p>
      </footer>
    </div>
  )
}
