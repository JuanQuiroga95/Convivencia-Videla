import Link from 'next/link'
import { BarChart3, BookOpen, LogIn, Shield, History } from 'lucide-react'

export default function Home() {
  const currentMonth = new Date().toLocaleString('es-AR', { month: 'long' })
  const currentYear = new Date().getFullYear()

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Header */}
      <header style={{
        background: 'var(--green-dark)',
        borderBottom: '3px solid var(--orange)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.06em', color: 'white' }}>
                VIDELA
              </span>
              <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginLeft: '8px', letterSpacing: '0.1em' }}>
                CONVIVENCIA 2026
              </span>
            </div>
          </div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--orange)', color: 'white', border: 'none',
              borderRadius: '8px', padding: '8px 18px', cursor: 'pointer',
              fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.9rem',
              letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <LogIn size={15} /> PANEL
            </button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 60px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 0 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,93,4,0.1)', border: '1px solid rgba(232,93,4,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700 }}>
              {currentMonth.toUpperCase()} {currentYear} · EN CURSO
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', lineHeight: 1.05, marginBottom: '16px', color: 'var(--green-dark)' }}>
            SISTEMA VIR<br />
            <span style={{ color: 'var(--orange)' }}>VIDELA CONVIVENCIA</span>
          </h1>

          <p style={{ fontFamily: 'var(--font-body)', color: '#3D5A3E', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            Variable de Incidencia y Reparación · Sistema Formativo y Resolutivo
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: '#6B7B6C', fontSize: '0.88rem', marginTop: '6px' }}>
            Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza
          </p>
        </div>

        {/* Accesos rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '700px', margin: '0 auto 48px' }}>
          {[
            { href: '/tablero', icon: BarChart3, label: 'TABLERO', sub: 'Ranking por período', bg: 'var(--green-dark)', accent: 'var(--orange)' },
            { href: '/reglas', icon: BookOpen, label: 'REGLAS', sub: 'Criterios y sistema de puntos', bg: '#1D4ED8', accent: '#93C5FD' },
          ].map(({ href, icon: Icon, label, sub, bg, accent }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: bg, borderRadius: '16px', padding: '28px 20px', textAlign: 'center',
                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
              >
                <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: `2px solid ${accent}` }}>
                  <Icon size={28} style={{ color: accent }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginTop: '6px' }}>{sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dimensiones */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--green-dark)', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '20px' }}>
            DIMENSIONES DEL MODELO
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', maxWidth: '680px', margin: '0 auto' }}>
            {[
              { label: 'RESOLUTIVO', pts: '40 pts', color: '#C1121F', bg: '#FEE2E2', border: '#FCA5A5', desc: 'Gestión VIR, actas, ICE' },
              { label: 'FORMATIVO', pts: '40 pts', color: '#1A4D2E', bg: '#D1FAE5', border: '#6EE7B7', desc: 'Uniforme, asistencia, entorno' },
              { label: 'ACADÉMICO', pts: '20 pts', color: '#92400E', bg: '#FEF3C7', border: '#FCD34D', desc: 'Aprobados del período' },
            ].map(({ label, pts, color, bg, border, desc }) => (
              <div key={label} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.6rem', margin: '4px 0' }}>{pts}</div>
                <div style={{ fontFamily: 'var(--font-body)', color, fontSize: '0.75rem', opacity: 0.8 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos internos */}
        <div style={{ background: 'var(--green-light)', border: '2px solid var(--green-border)', borderRadius: '16px', padding: '28px', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--green-dark)', fontSize: '0.8rem', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '16px' }}>
            ACCESO INTERNO · PERSONAL DOCENTE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { href: '/var', icon: Shield, label: 'Activar VIR', color: 'var(--orange)' },
              { href: '/historial', icon: History, label: 'Historial VIR', color: 'var(--green)' },
              { href: '/tablero', icon: BarChart3, label: 'Tablero', color: '#1D4ED8' },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: `2px solid ${color}`, borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = color; (e.currentTarget as HTMLElement).querySelectorAll('*').forEach((el: any) => { if (el.style) el.style.color = 'white' }) }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).querySelectorAll('*').forEach((el: any) => { if (el.style) el.style.color = color }) }}
                >
                  <Icon size={18} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-condensed)', color, fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--green-dark)', padding: '20px 24px', textAlign: 'center', borderTop: '3px solid var(--orange)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · 2026
        </p>
      </footer>
    </div>
  )
}
