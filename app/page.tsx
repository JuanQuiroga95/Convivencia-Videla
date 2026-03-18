import Link from 'next/link'
import { BarChart3, BookOpen, LogIn } from 'lucide-react'

export default function Home() {
  const currentMonth = new Date().toLocaleString('es-AR', { month: 'long' })
  const currentYear = new Date().getFullYear()

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {/* Header público */}
      <header style={{
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        background: 'rgba(10,22,40,0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.05em' }}>
              <span className="text-gold-gradient">VIDELA</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginLeft: '8px', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>
                CONVIVENCIA 2026
              </span>
            </span>
          </div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-outline flex items-center gap-2" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
              <LogIn size={14} /> Panel
            </button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C' }} className="pulse-gold" />
            <span style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              {currentMonth.toUpperCase()} {currentYear} · EN CURSO
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.05, marginBottom: '12px' }}>
            <span className="text-gold-gradient">MODELO VIDELA</span><br />
            <span style={{ color: 'white' }}>CONVIVENCIA ACTIVA</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Sistema Formativo · Preventivo · Resolutivo<br />
            <span style={{ fontSize: '0.85rem', color: '#374151' }}>Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza</span>
          </p>
        </div>

        {/* Cards navegación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link href="/tablero" style={{ textDecoration: 'none' }}>
            <div className="card-hover rounded-xl p-6 text-center" style={{
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.25)',
              cursor: 'pointer'
            }}>
              <div style={{ width: '52px', height: '52px', background: 'rgba(37,99,235,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <BarChart3 size={26} style={{ color: '#93C5FD' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'white', letterSpacing: '0.05em' }}>TABLERO</div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem', marginTop: '4px' }}>
                Ranking mensual por curso
              </div>
            </div>
          </Link>

          <Link href="/reglas" style={{ textDecoration: 'none' }}>
            <div className="card-hover rounded-xl p-6 text-center" style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              cursor: 'pointer'
            }}>
              <div style={{ width: '52px', height: '52px', background: 'rgba(201,168,76,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <BookOpen size={26} style={{ color: '#FCD34D' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'white', letterSpacing: '0.05em' }}>REGLAS</div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem', marginTop: '4px' }}>
                Criterios y sistema de puntos
              </div>
            </div>
          </Link>
        </div>

        {/* Dimensiones info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-xl mx-auto">
          {[
            { label: 'RESOLUTIVO', color: '#FCA5A5', bg: 'rgba(220,38,38,0.1)', pts: '30 pts' },
            { label: 'FORMATIVO', color: '#6EE7B7', bg: 'rgba(5,150,105,0.1)', pts: '30 pts' },
            { label: 'PREVENTIVO', color: '#93C5FD', bg: 'rgba(37,99,235,0.1)', pts: '20 pts' },
            { label: 'ACADÉMICO', color: '#FCD34D', bg: 'rgba(201,168,76,0.1)', pts: '20 pts' },
          ].map(({ label, color, bg, pts }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${color}33`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.7rem', letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.1rem', marginTop: '2px' }}>{pts}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '40px' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: '#1F2937', fontSize: '0.8rem' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · 2026
        </p>
      </footer>
    </div>
  )
}
