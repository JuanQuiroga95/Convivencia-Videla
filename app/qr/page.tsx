'use client'
import Nav from '@/components/Nav'
import { QrCode, Printer } from 'lucide-react'

const QR_ITEMS = [
  {
    key: 'var',
    label: 'ACTIVAR VIR',
    desc: 'Registrar un conflicto',
    path: '/var',
    color: '#C1121F',
    colorLight: 'rgba(193,18,31,0.15)',
    border: 'rgba(193,18,31,0.4)',
    qrColor: 'C1121F',
    qrBg: 'ffffff',
  },
  {
    key: 'indicadores',
    label: 'INDICADORES',
    desc: 'Cargar indicadores del mes',
    path: '/indicadores',
    color: '#2D7A4F',
    colorLight: 'rgba(45,122,79,0.15)',
    border: 'rgba(45,122,79,0.4)',
    qrColor: '2D7A4F',
    qrBg: 'ffffff',
  },
  {
    key: 'campo',
    label: 'ACCIONES POSITIVAS',
    desc: 'Registrar una acción destacada',
    path: '/campo',
    color: '#B45309',
    colorLight: 'rgba(180,83,9,0.15)',
    border: 'rgba(180,83,9,0.4)',
    qrColor: 'B45309',
    qrBg: 'ffffff',
  },
  {
    key: 'reglas',
    label: 'REGLAS',
    desc: 'Ver las reglas del Modelo Videla',
    path: '/reglas',
    color: '#0E7490',
    colorLight: 'rgba(14,116,144,0.15)',
    border: 'rgba(14,116,144,0.4)',
    qrColor: '0E7490',
    qrBg: 'ffffff',
  },
  {
    key: 'ranking',
    label: 'RANKING GENERAL',
    desc: 'Ver el ranking público',
    path: '/ranking-publico',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.4)',
    qrColor: '7C3AED',
    qrBg: 'ffffff',
  },
]

// URL fija de producción.
// Seteá NEXT_PUBLIC_APP_URL en Vercel → Settings → Environment Variables
// Ejemplo: https://videla-convivencia.vercel.app
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://videla-convivencia.vercel.app'

function getQrUrl(item: typeof QR_ITEMS[0]) {
  const url = encodeURIComponent(`${BASE_URL}${item.path}`)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}&bgcolor=${item.qrBg}&color=${item.qrColor}&format=png&margin=12`
}

export default function QRPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="main-with-sidebar-tall">

        {/* Header */}
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
                  CÓDIGOS QR
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.82rem' }}>
                  5 QR institucionales · Permanentes · Listos para imprimir
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="btn-outline flex items-center gap-2"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <Printer size={16} /> Imprimir todos
            </button>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="px-4 md:px-6 pt-5 pb-2 print:hidden">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            {[
              { n: '1', t: 'Imprimí esta página', d: 'Botón "Imprimir todos" arriba a la derecha.' },
              { n: '2', t: 'Recortá y pegálos', d: 'Sala de profesores, dirección o pasillos.' },
              { n: '3', t: 'Escaneá y completá', d: 'El formulario pregunta el curso al abrir.' },
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

        {/* QR Cards */}
        <div className="px-4 md:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3" style={{ maxWidth: '960px' }}>
            {QR_ITEMS.map(item => (
              <div
                key={item.key}
                className="rounded-xl overflow-hidden"
                style={{ background: '#0f172a', border: `2px solid ${item.border}` }}
              >
                <div style={{ padding: '14px 16px', background: item.colorLight, borderBottom: `1px solid ${item.border}`, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: item.color, letterSpacing: '0.05em' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.68rem', letterSpacing: '0.1em', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'white', padding: '10px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getQrUrl(item)}
                      alt={`QR ${item.label}`}
                      style={{ width: '160px', height: '160px', display: 'block' }}
                    />
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#4B5563', fontSize: '0.58rem', textAlign: 'center', wordBreak: 'break-all' }}>
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
          .print\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
          body { background: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  )
}
