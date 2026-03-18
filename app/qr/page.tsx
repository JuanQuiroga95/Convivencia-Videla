'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { QrCode, Download, Printer } from 'lucide-react'

export default function QRPage() {
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [baseUrl, setBaseUrl] = useState('')
  const [qrImages, setQrImages] = useState<Record<string, {var: string, ind: string}>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    setBaseUrl(window.location.origin)
  }, [])

  const generateQRs = async () => {
    setLoading(true)
    try {
      // Use a QR API service
      const newQrs: Record<string, {var: string, ind: string}> = {}
      for (const curso of cursos) {
        const varUrl = encodeURIComponent(`${baseUrl}/var?curso=${curso.id}`)
        const indUrl = encodeURIComponent(`${baseUrl}/indicadores?curso=${curso.id}`)
        newQrs[curso.id] = {
          var: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${varUrl}&bgcolor=0A1628&color=C9A84C&format=png`,
          ind: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${indUrl}&bgcolor=0A1628&color=C9A84C&format=png`,
        }
      }
      setQrImages(newQrs)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const printAll = () => window.print()

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
                  Acceso rápido por aula · Escanear para cargar VAR o indicadores
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={generateQRs} disabled={loading} className="btn-gold flex items-center gap-2">
                <QrCode size={16} />
                {loading ? 'Generando...' : 'Generar QRs'}
              </button>
              {Object.keys(qrImages).length > 0 && (
                <button onClick={printAll} className="btn-outline flex items-center gap-2">
                  <Printer size={16} /> Imprimir
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {Object.keys(qrImages).length === 0 && (
            <div className="max-w-lg">
              <div className="glass rounded-xl p-6 text-center">
                <QrCode size={48} style={{ color: '#374151', margin: '0 auto 16px' }} />
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', marginBottom: '8px' }}>
                  Generá los códigos QR para colocar en cada aula
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Cada aula tendrá 2 QR: uno para activar VAR y otro para cargar indicadores.<br/>
                  Al escanearlos, se abre directamente el formulario del curso correspondiente.
                </div>
                <button onClick={generateQRs} disabled={loading || cursos.length === 0} className="btn-gold mt-4">
                  {cursos.length === 0 ? 'Cargando cursos...' : 'Generar todos los QR'}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 space-y-3">
                {[
                  { paso: '1', titulo: 'Generá los QR', desc: 'Presioná el botón para generar los códigos QR de todos los cursos.' },
                  { paso: '2', titulo: 'Imprimí e instalá', desc: 'Imprimí cada par de QR y pegálos en un lugar visible dentro del aula.' },
                  { paso: '3', titulo: 'Escanear y registrar', desc: 'Cuando ocurra un conflicto o sea momento de cargar indicadores, escanear y completar en 1 minuto.' },
                ].map(({ paso, titulo, desc }) => (
                  <div key={paso} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{
                      width: '32px', height: '32px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #C9A84C, #E8C96E)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#0A1628'
                    }}>{paso}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', marginBottom: '2px' }}>{titulo}</div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(qrImages).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl print:grid-cols-3">
              {cursos.map(curso => {
                const qrs = qrImages[curso.id]
                if (!qrs) return null
                return (
                  <div key={curso.id} className="rounded-xl overflow-hidden" style={{ background: '#0A1628', border: '1px solid rgba(201,168,76,0.2)' }}>
                    {/* Card header */}
                    <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0A1628)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', letterSpacing: '0.05em', textAlign: 'center' }}>
                        {curso.nombre}
                      </div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.15em', textAlign: 'center' }}>
                        MODELO VIDELA · CONVIVENCIA ACTIVA
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-3">
                      {/* VAR QR */}
                      <div className="text-center">
                        <div className="rounded-lg overflow-hidden p-2" style={{ background: 'white' }}>
                          <img src={qrs.var} alt={`QR VAR ${curso.nombre}`} style={{ width: '100%', display: 'block' }} />
                        </div>
                        <div className="mt-2 py-1 px-2 rounded" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
                          <div style={{ fontFamily: 'var(--font-condensed)', color: '#FCA5A5', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            ACTIVAR VAR
                          </div>
                        </div>
                      </div>

                      {/* Indicadores QR */}
                      <div className="text-center">
                        <div className="rounded-lg overflow-hidden p-2" style={{ background: 'white' }}>
                          <img src={qrs.ind} alt={`QR Ind ${curso.nombre}`} style={{ width: '100%', display: 'block' }} />
                        </div>
                        <div className="mt-2 py-1 px-2 rounded" style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)' }}>
                          <div style={{ fontFamily: 'var(--font-condensed)', color: '#6EE7B7', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            INDICADORES
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-3 text-center" style={{ fontFamily: 'var(--font-body)', color: '#374151', fontSize: '0.65rem' }}>
                      Esc. N° 4-012 Ing. Ricardo Videla · 2026
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @media print {
          nav { display: none !important; }
          .md\\:ml-56 { margin-left: 0 !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
