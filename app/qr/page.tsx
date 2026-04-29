'use client'
import { useState, useEffect } from 'react'
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
    qrBg: '0A1628',
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
    qrBg: '0A1628',
  },
  {
    key: 'campo',
    label: 'ACCIONES POSITIVAS',
    desc: 'Registrar una acción destacada',
    path: '/campo',
    color: '#B45309',
    colorLight: 'rgba(180,83,9,0.15)',
    border: 'rgba(180,83,9,0.4)',
    qrColor: 'C9A84C',
    qrBg: '0A1628',
  },
  {
    key: 'reglas',
    label: 'REGLAS',
    desc: 'Ver las reglas del Modelo Videla',
    path: '/reglas',
    color: '#0E7490',
    colorLight: 'rgba(14,116,144,0.15)',
    border: 'rgba(14,116,144,0.4)',
    qrColor: '22D3EE',
    qrBg: '0A1628',
  },
  {
    key: 'ranking',
    label: 'RANKING GENERAL',
    desc: 'Ver el ranking público',
    path: '/ranking-publico',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.4)',
    qrColor: 'A78BFA',
    qrBg: '0A1628',
  },
]

export default function QRPage() {
  const [baseUrl, setBaseUrl] = useState('')
  const [generated, setGenerated] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(QR_ITEMS.map(q => [q.key, true]))
  )

  useEffect(() => { setBaseUrl(window.location.origin) }, [])

  const getQrUrl = (item: typeof QR_ITEMS[0]) => {
    const url = encodeURIComponent(`${baseUrl}${item.path}`)
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${url}&bgcolor=${item.qrBg}&color=${item.qrColor}&format=png&margin=10`
  }

  const visibles = QR_ITEMS.filter(q => selected[q.key])

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
                  CÓDIGOS QR
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.82rem' }}>
                  5 QR institucionales · Al escanear, el formulario permite elegir el curso
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!generated && baseUrl && (
                <button onClick={() => setGenerated(true)} className="btn-gold flex items-center gap-2" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                  <QrCode size={16} /> Generar QRs
                </button>
              )}
              {generated && (
                <button onClick={() => window.print()} className="btn-outline flex items-center gap-2" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                  <Printer size={16} /> Imprimir
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-5">

          {!generated && (
            <div style={{ maxWidth: '520px' }}>
              <div className="glass rounded-xl p-5" style={{ marginBottom: '20px' }}>
                <QrCode size={40} style={{ color: '#374151', marginBottom: '12px' }} />
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', marginBottom: '6px', fontSize: '0.95rem' }}>
                  5 CÓDIGOS QR INSTITUCIONALES
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  Un QR por función. Al escanearlo el docente elige el curso en el formulario — no hace falta un QR por aula.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  {QR_ITEMS.map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: item.colorLight, border: `1px solid ${item.border}`, cursor: 'pointer' }}>
                      <input type="checkbox" checked={selected[item.key]}
                        onChange={e => setSelected(s => ({ ...s, [item.key]: e.target.checked }))}
                        style={{ accentColor: item.color, width: '16px', height: '16px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: item.color, fontSize: '0.85rem', fontWeight: 700 }}>{item.label}</div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.73rem' }}>{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <button onClick={() => setGenerated(true)} disabled={!baseUrl || visibles.length === 0}
                  className="btn-gold" style={{ width: '100%' }}>
                  Generar {visibles.length} QR{visibles.length !== 1 ? 's' : ''}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { paso: '1', titulo: 'Generá los QR', desc: 'Presioná el botón para generar los 5 códigos QR institucionales.' },
                  { paso: '2', titulo: 'Imprimí y pegálos', desc: 'Colocálos en sala de profesores, dirección o en cada aula.' },
                  { paso: '3', titulo: 'Escanear y elegir curso', desc: 'El formulario pregunta el curso — sin necesidad de un QR por aula.' },
                ].map(({ paso, titulo, desc }) => (
                  <div key={paso} style={{ display: 'flex', gap: '14px', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: '30px', height: '30px', flexShrink: 0, background: 'linear-gradient(135deg, #C9A84C, #E8C96E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#0A1628' }}>{paso}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', marginBottom: '2px' }}>{titulo}</div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.84rem' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generated && (
            <div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.82rem', letterSpacing: '0.08em' }}>
                  {visibles.length} CÓDIGOS GENERADOS
                </span>
                <button onClick={() => setGenerated(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-condensed)', color: '#6B7280', fontSize: '0.82rem' }}>
                  ← Volver
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3" style={{ maxWidth: '900px' }}>
                {visibles.map(item => (
                  <div key={item.key} className="rounded-xl overflow-hidden" style={{ background: '#0A1628', border: `1px solid ${item.border}` }}>
                    <div style={{ padding: '14px 16px', background: item.colorLight, borderBottom: `1px solid ${item.border}`, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: item.color, letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', letterSpacing: '0.1em', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'white', padding: '8px' }}>
                        <img src={getQrUrl(item)} alt={`QR ${item.label}`} style={{ width: '144px', height: '144px', display: 'block' }} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#4B5563', fontSize: '0.6rem', textAlign: 'center', wordBreak: 'break-all' }}>
                        {baseUrl}{item.path}
                      </div>
                    </div>

                    <div style={{ padding: '0 16px 12px', textAlign: 'center', fontFamily: 'var(--font-body)', color: '#374151', fontSize: '0.65rem' }}>
                      Esc. N° 4-012 Ing. Ricardo Videla · 2026
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @media print {
          nav { display: none !important; }
          .md\\:ml-56 { margin-left: 0 !important; }
          .pb-24 { padding-bottom: 0 !important; }
        }
      `}</style>
    </div>
  )
}
