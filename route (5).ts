'use client'
import Nav from '@/components/Nav'
import { QrCode, Printer, Users, GraduationCap } from 'lucide-react'

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://videla-convivencia.vercel.app'

const QR_MAESTROS = [
  {
    key: 'docentes',
    label: 'QR DOCENTES',
    sublabel: 'Acceso maestro para docentes, preceptoras y SOE',
    desc: 'Da acceso a todas las secciones: VIR, Indicadores, Acciones Positivas, Reglas y Ranking. Solo para personal institucional.',
    path: '/docentes',
    color: '#22D3EE',
    colorLight: 'rgba(34,211,238,0.10)',
    border: 'rgba(34,211,238,0.35)',
    qrColor: '22D3EE',
    qrBg: '0A1628',
    icon: 'Users',
    secciones: ['🔴 Activar VIR', '🟢 Indicadores', '🟡 Acciones Positivas', '🔵 Reglas', '🟣 Ranking'],
  },
  {
    key: 'alumnos',
    label: 'QR ALUMNOS',
    sublabel: 'Acceso público para estudiantes',
    desc: 'Solo muestra Ranking y Reglas. No permite cargar ni modificar datos institucionales.',
    path: '/alumnos',
    color: '#C9A84C',
    colorLight: 'rgba(201,168,76,0.10)',
    border: 'rgba(201,168,76,0.35)',
    qrColor: 'C9A84C',
    qrBg: '0A1628',
    icon: 'GraduationCap',
    secciones: ['🟣 Ranking General', '🔵 Reglas'],
  },
]

function getQrUrl(path: string, qrColor: string, qrBg: string) {
  const url = encodeURIComponent(`${BASE_URL}${path}`)
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${url}&bgcolor=${qrBg}&color=${qrColor}&format=png&margin=16`
}

export default function QRPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="main-with-sidebar-tall">

        <div className="px-4 md:px-6 py-5 md:py-8" style={{
          background: 'linear-gradient(135deg, #0a0a1a, #1a0a3d, #0a0a1a)',
          borderBottom: '1px solid rgba(124,58,237,0.2)'
        }}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.2)' }}>
                <QrCode size={22} style={{ color: '#C4B5FD' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,5vw,1.8rem)', letterSpacing: '0.05em', color: 'white' }}>
                  QR MAESTROS
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.82rem' }}>
                  2 QR institucionales · Sin login · Listos para imprimir
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="btn-outline flex items-center gap-2"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <Printer size={16} /> Imprimir
            </button>
          </div>
        </div>

        <div className="px-4 md:px-6 pt-5 pb-2 print:hidden">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            {[
              { n: '1', t: 'Imprimí esta página', d: 'Botón "Imprimir" arriba a la derecha.' },
              { n: '2', t: 'Pegá los QR donde corresponde', d: 'QR Docentes: sala de profes. QR Alumnos: pasillos o aulas.' },
              { n: '3', t: 'Escaneá y usá directo', d: 'Sin login. Se abre la sección correspondiente.' },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', flex: '1 1 200px' }}>
                <div style={{ width: '28px', height: '28px', flexShrink: 0, background: 'linear-gradient(135deg, #C9A84C, #E8C96E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#0A1628' }}>{n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', fontSize: '0.85rem' }}>{t}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.75rem' }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 md:px-6 py-5">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '760px' }}>
            {QR_MAESTROS.map(item => (
              <div
                key={item.key}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#0f172a', border: `2px solid ${item.border}` }}
              >
                <div style={{ padding: '18px 20px', background: item.colorLight, borderBottom: `1px solid ${item.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${item.color}22`, border: `1.5px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.key === 'docentes'
                        ? <Users size={20} style={{ color: item.color }} />
                        : <GraduationCap size={20} style={{ color: item.color }} />
                      }
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: item.color, letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.5, margin: '0' }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0A1628', padding: '12px', border: `2px solid ${item.border}`, boxShadow: `0 0 24px ${item.colorLight}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getQrUrl(item.path, item.qrColor, item.qrBg)}
                      alt={`QR ${item.label}`}
                      style={{ width: '200px', height: '200px', display: 'block' }}
                    />
                  </div>

                  <div style={{ width: '100%' }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', fontSize: '0.65rem', letterSpacing: '0.12em', marginBottom: '8px', textAlign: 'center' }}>
                      DA ACCESO A
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {item.secciones.map(s => (
                        <div key={s} style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-body)', color: '#374151', fontSize: '0.58rem', textAlign: 'center', wordBreak: 'break-all' }}>
                    {BASE_URL}{item.path}
                  </div>
                </div>

                <div style={{ padding: '0 16px 14px', textAlign: 'center', fontFamily: 'var(--font-body)', color: '#374151', fontSize: '0.62rem' }}>
                  Esc. N° 4-012 Ing. Ricardo Videla · 2026
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media print {
          nav { display: none !important; }
          .main-with-sidebar-tall { margin-left: 0 !important; padding-bottom: 0 !important; }
          .print\\:hidden { display: none !important; }
          body { background: #0A1628 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  )
}
