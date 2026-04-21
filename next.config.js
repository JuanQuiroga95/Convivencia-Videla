'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { QrCode, Printer, CheckSquare, Square } from 'lucide-react'

const TIPOS_QR = [
  { key: 'vir',     label: 'ACTIVAR VIR',        desc: 'Registrar un conflicto',              path: '/var',             color: '#EF4444', light: '#FCA5A5', bg: 'rgba(220,38,38,0.15)',   border: 'rgba(220,38,38,0.35)',   glow: 'rgba(239,68,68,0.25)',    qrBg: '7F1D1D', qrColor: 'FECACA' },
  { key: 'ind',     label: 'INDICADORES',         desc: 'Cargar indicadores del mes',          path: '/indicadores',     color: '#10B981', light: '#6EE7B7', bg: 'rgba(5,150,105,0.15)',   border: 'rgba(5,150,105,0.35)',   glow: 'rgba(16,185,129,0.25)',   qrBg: '064E3B', qrColor: 'A7F3D0' },
  { key: 'campo',   label: 'ACCIONES POSITIVAS',  desc: 'Registrar una acción destacada',      path: '/campo',           color: '#F59E0B', light: '#FCD34D', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)',  glow: 'rgba(245,158,11,0.25)',   qrBg: '78350F', qrColor: 'FDE68A' },
  { key: 'reglas',  label: 'REGLAS',              desc: 'Ver las reglas del Modelo Videla',    path: '/reglas',          color: '#06B6D4', light: '#67E8F9', bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)',   glow: 'rgba(6,182,212,0.25)',    qrBg: '164E63', qrColor: 'CFFAFE' },
  { key: 'ranking', label: 'RANKING GENERAL',     desc: 'Ver el ranking público',              path: '/ranking-publico', color: '#8B5CF6', light: '#C4B5FD', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.35)', glow: 'rgba(139,92,246,0.25)',  qrBg: '2E1065', qrColor: 'DDD6FE' },
] as const

type TipoKey = typeof TIPOS_QR[number]['key']
const ALL_KEYS = TIPOS_QR.map(t => t.key) as TipoKey[]

export default function QRPage() {
  const [baseUrl, setBaseUrl] = useState('')
  const [qrImages, setQrImages] = useState<Record<TipoKey, string> | null>(null)
  const [loading, setLoading] = useState(false)
  const [seleccion, setSeleccion] = useState<Set<TipoKey>>(new Set(ALL_KEYS))
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => { setBaseUrl(window.location.origin) }, [])

  // Inyectar CSS de impresión dinámico según selección
  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style')
      el.id = 'print-dynamic'
      document.head.appendChild(el)
      styleRef.current = el
    }
    const show = ALL_KEYS.filter(k => seleccion.has(k)).map(k => `.pqr-${k}{display:block!important}`).join('\n')
    const hide = ALL_KEYS.filter(k => !seleccion.has(k)).map(k => `.pqr-${k}{display:none!important}`).join('\n')
    styleRef.current.textContent = `@media print{${show}\n${hide}}`
    return () => { styleRef.current?.remove(); styleRef.current = null }
  }, [seleccion])

  const qrUrl = (path: string, bg: string, color: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(baseUrl + path)}&bgcolor=${bg}&color=${color}&format=png&margin=10`

  const generateQRs = () => {
    setLoading(true)
    const imgs: any = {}
    for (const t of TIPOS_QR) imgs[t.key] = qrUrl(t.path, t.qrBg, t.qrColor)
    setQrImages(imgs)
    setLoading(false)
  }

  const toggleTipo = (key: TipoKey) => setSeleccion(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-8" style={{
          background: 'linear-gradient(135deg, #0a0a1a, #1a0a3d, #0a0a1a)',
          borderBottom: '1px solid rgba(124,58,237,0.2)'
        }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.2)' }}>
                <QrCode size={24} style={{ color: '#C4B5FD' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                  CÓDIGOS QR
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem' }}>
                  5 QR generales para toda la escuela · Sin usuario ni contraseña
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={generateQRs} disabled={loading} className="btn-gold flex items-center gap-2">
                <QrCode size={16} />
                {loading ? 'Generando...' : qrImages ? 'Regenerar' : 'Generar QRs'}
              </button>
              {qrImages && (
                <button
                  onClick={() => window.print()}
                  disabled={seleccion.size === 0}
                  className="btn-outline flex items-center gap-2"
                  style={{ opacity: seleccion.size === 0 ? 0.4 : 1 }}
                >
                  <Printer size={16} />
                  Imprimir{seleccion.size > 0 ? ` (${seleccion.size})` : ''}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-4xl">

          {/* Estado inicial */}
          {!qrImages && (
            <div className="max-w-lg">
              <div className="glass rounded-xl p-6 text-center">
                <QrCode size={48} style={{ color: '#374151', margin: '0 auto 16px' }} />
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', marginBottom: '8px' }}>
                  5 QR generales para toda la escuela
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  VIR · Indicadores · Acciones Positivas · Reglas · Ranking<br/>
                  Dentro de cada form se elige el curso. <strong style={{color:'#C9A84C'}}>Sin login</strong>.
                </div>
                <button onClick={generateQRs} className="btn-gold mt-4">Generar los 5 QR</button>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { paso: '1', titulo: 'Generá los QR',         desc: 'Un click genera los 5 QR de la escuela.' },
                  { paso: '2', titulo: 'Elegí cuáles imprimir', desc: 'Seleccioná uno o varios haciendo click en cada tarjeta.' },
                  { paso: '3', titulo: 'Imprimí y pegá',        desc: 'Un juego de 5 alcanza para toda la escuela.' },
                ].map(({ paso, titulo, desc }) => (
                  <div key={paso} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width:32, height:32, flexShrink:0, background:'linear-gradient(135deg,#C9A84C,#E8C96E)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', color:'#0A1628' }}>{paso}</div>
                    <div>
                      <div style={{ fontFamily:'var(--font-condensed)', color:'white', marginBottom:2 }}>{titulo}</div>
                      <div style={{ fontFamily:'var(--font-body)', color:'#6B7280', fontSize:'0.85rem' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QRs generados */}
          {qrImages && (
            <div className="space-y-5">

              {/* Panel selección */}
              <div className="no-print rounded-xl p-4" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span style={{ fontFamily:'var(--font-condensed)', color:'#9CA3AF', fontSize:'0.78rem', letterSpacing:'0.1em' }}>
                    SELECCIONÁ QUÉ IMPRIMIR
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => setSeleccion(new Set(ALL_KEYS))} style={{ fontFamily:'var(--font-condensed)', fontSize:'0.72rem', letterSpacing:'0.08em', color:'#C9A84C', background:'none', border:'none', cursor:'pointer' }}>TODOS</button>
                    <button onClick={() => setSeleccion(new Set())} style={{ fontFamily:'var(--font-condensed)', fontSize:'0.72rem', letterSpacing:'0.08em', color:'#6B7280', background:'none', border:'none', cursor:'pointer' }}>NINGUNO</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TIPOS_QR.map(t => {
                    const activo = seleccion.has(t.key)
                    return (
                      <button key={t.key} onClick={() => toggleTipo(t.key)} style={{
                        display:'flex', alignItems:'center', gap:7,
                        padding:'6px 14px', borderRadius:8, cursor:'pointer',
                        border:`1px solid ${activo ? t.color : 'rgba(255,255,255,0.1)'}`,
                        background: activo ? t.bg : 'transparent', transition:'all 0.15s',
                      }}>
                        {activo
                          ? <CheckSquare size={13} style={{ color: t.light, flexShrink: 0 }} />
                          : <Square size={13} style={{ color: '#4B5563', flexShrink: 0 }} />
                        }
                        <span style={{ fontFamily:'var(--font-condensed)', fontSize:'0.75rem', letterSpacing:'0.08em', color: activo ? t.light : '#6B7280', whiteSpace:'nowrap' }}>
                          {t.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Grilla de tarjetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TIPOS_QR.map(t => {
                  const sel = seleccion.has(t.key)
                  return (
                    <div
                      key={t.key}
                      onClick={() => toggleTipo(t.key)}
                      className={`pqr-${t.key}`}
                      style={{
                        borderRadius: 16, overflow:'hidden', cursor:'pointer',
                        border: `2px solid ${sel ? t.color : 'rgba(255,255,255,0.06)'}`,
                        background: '#0D1F3C',
                        transition: 'all 0.15s',
                        boxShadow: sel ? `0 0 24px ${t.glow}` : 'none',
                        opacity: sel ? 1 : 0.38,
                        transform: sel ? 'scale(1)' : 'scale(0.97)',
                      }}
                    >
                      {/* Header */}
                      <div style={{ padding:'12px 16px', background:'linear-gradient(135deg,#1B3A6B,#0D1F3C)', borderBottom:`1px solid ${t.border}` }}>
                        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', color:'white', letterSpacing:'0.06em' }}>{t.label}</div>
                        <div style={{ fontFamily:'var(--font-body)', color:'#6B7280', fontSize:'0.72rem', marginTop:2 }}>{t.desc}</div>
                      </div>

                      {/* QR image */}
                      <div style={{ padding:20, display:'flex', justifyContent:'center' }}>
                        <div style={{ borderRadius:10, overflow:'hidden', background:'white', padding:8, width:140, height:140 }}>
                          <img src={qrImages[t.key]} alt={`QR ${t.label}`} style={{ width:'100%', height:'100%', display:'block', objectFit:'contain' }} />
                        </div>
                      </div>

                      {/* Badge */}
                      <div style={{ padding:'0 16px 14px', textAlign:'center' }}>
                        <div style={{ display:'inline-block', padding:'4px 16px', borderRadius:20, background:t.bg, border:`1px solid ${t.border}`, fontFamily:'var(--font-condensed)', color:t.light, fontSize:'0.68rem', letterSpacing:'0.1em' }}>
                          {sel ? '✓ SELECCIONADO' : 'CLICK PARA SELECCIONAR'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {seleccion.size === 0 && (
                <p style={{ fontFamily:'var(--font-body)', color:'#6B7280', fontSize:'0.85rem', textAlign:'center', paddingTop:8 }}>
                  Seleccioná al menos un QR para imprimir
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @media print {
          nav { display: none !important; }
          .no-print { display: none !important; }
          .md\\:ml-56 { margin-left: 0 !important; }
          body { background: white !important; }
          main { padding: 0 16px !important; }
          .grid { display: flex !important; flex-wrap: wrap !important; gap: 16px !important; justify-content: center !important; }
          [class^="pqr-"] {
            width: 200px !important;
            break-inside: avoid !important;
            cursor: default !important;
            transform: none !important;
            opacity: 1 !important;
            background: white !important;
          }
          [class^="pqr-"] > div:first-child { background: #1B3A6B !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          [class^="pqr-"] [style*="color:#6B7280"] { color: #444 !important; }
        }
      `}</style>
    </div>
  )
}
