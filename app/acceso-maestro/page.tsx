'use client'
import Link from 'next/link'
import { Shield, ClipboardList, Trophy, BookOpen, BarChart3 } from 'lucide-react'

const ITEMS = [
  {
    href: '/var',
    icon: Shield,
    label: 'ACTIVAR VIR',
    desc: 'Ante conflictos o situaciones que requieren intervención y reparación.',
    color: '#C1121F',
    colorLight: 'rgba(193,18,31,0.15)',
    border: 'rgba(193,18,31,0.4)',
    requiresLogin: true,
  },
  {
    href: '/indicadores',
    icon: ClipboardList,
    label: 'INDICADORES',
    desc: 'Carga periódica de asistencia, uniforme, hábitos y datos del curso.',
    color: '#2D7A4F',
    colorLight: 'rgba(45,122,79,0.15)',
    border: 'rgba(45,122,79,0.4)',
    requiresLogin: true,
  },
  {
    href: '/campo',
    icon: Trophy,
    label: 'ACCIONES POSITIVAS',
    desc: 'Registro de aportes destacados, proyectos, actos y acciones formativas.',
    color: '#B45309',
    colorLight: 'rgba(180,83,9,0.15)',
    border: 'rgba(180,83,9,0.4)',
    requiresLogin: true,
  },
  {
    href: '/reglas',
    icon: BookOpen,
    label: 'REGLAS',
    desc: 'Consulta de criterios, acuerdos y funcionamiento del modelo.',
    color: '#0E7490',
    colorLight: 'rgba(14,116,144,0.15)',
    border: 'rgba(14,116,144,0.4)',
    requiresLogin: false,
  },
  {
    href: '/ranking-publico',
    icon: BarChart3,
    label: 'RANKING GENERAL',
    desc: 'Visualización pública del avance de los cursos.',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.4)',
    requiresLogin: false,
  },
]

export default function AccesoMaestroPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0a0a1a, #1a0a3d, #0a0a1a)',
        borderBottom: '1px solid rgba(22,211,253,0.25)',
        padding: '28px 20px 22px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(22,211,253,0.08)',
          border: '1px solid rgba(22,211,253,0.2)',
          borderRadius: '8px',
          padding: '4px 14px',
          marginBottom: '12px',
        }}>
          <span style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(22,211,253,0.7)', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            ACCESO MAESTRO · DOCENTES / PRECEPTORAS / SOE
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem,8vw,3rem)',
          color: '#22D3EE',
          letterSpacing: '0.06em',
          margin: '0 0 6px',
          lineHeight: 1,
        }}>
          CONVIVENCIA VIDELIANA
        </h1>
        <p style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', letterSpacing: '0.1em', margin: 0 }}>
          Un solo ingreso para consultar, registrar y acompañar el proceso institucional
        </p>
      </header>

      {/* Cards */}
      <main style={{ maxWidth: '540px', margin: '0 auto', padding: '28px 16px 40px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ITEMS.map(({ href, icon: Icon, label, desc, color, colorLight, border }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: colorLight,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px ${border}`
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  background: `${color}22`,
                  border: `1px solid ${border}`,
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.25rem', letterSpacing: '0.05em', lineHeight: 1.1 }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', alignSelf: 'center' }}>›</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          marginTop: '28px',
          padding: '14px 16px',
          background: 'rgba(255,200,0,0.06)',
          border: '1px solid rgba(255,200,0,0.15)',
          borderRadius: '10px',
        }}>
          <p style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,200,0,0.7)', fontSize: '0.78rem', letterSpacing: '0.06em', margin: 0, lineHeight: 1.5 }}>
            ⚠ IMPORTANTE: antes de cargar, elegir la opción correcta. Una carga incorrecta afecta el análisis institucional.
          </p>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em', marginTop: '24px' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · 2026
        </p>
      </main>
    </div>
  )
}
