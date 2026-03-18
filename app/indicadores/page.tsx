'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { ClipboardList, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { MESES } from '@/lib/scoring'

const UNIFORME_OPCIONES = ['>95%', '85-95%', '<85%']

export default function IndicadoresPage() {
  const now = new Date()
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [form, setForm] = useState({
    curso_id: '',
    mes: String(now.getMonth() + 1),
    anio: String(now.getFullYear()),
    limpieza: '3',
    uniforme: '',
    puntualidad: '',
    asistencia: '',
    actas: '0',
    ice_puntos: '0',
    interv_tempranas: '0',
    situaciones_previas: '0',
    pct_aprobados: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok: boolean, message?: string} | null>(null)

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
    const params = new URLSearchParams(window.location.search)
    const curso = params.get('curso')
    if (curso) setForm(f => ({ ...f, curso_id: curso }))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        curso_id: parseInt(form.curso_id),
        mes: parseInt(form.mes),
        anio: parseInt(form.anio),
        limpieza: parseInt(form.limpieza),
        actas: parseInt(form.actas),
        ice_puntos: parseInt(form.ice_puntos),
        interv_tempranas: parseInt(form.interv_tempranas),
        situaciones_previas: parseInt(form.situaciones_previas),
        puntualidad: form.puntualidad ? parseFloat(form.puntualidad) : null,
        asistencia: form.asistencia ? parseFloat(form.asistencia) : null,
        pct_aprobados: form.pct_aprobados ? parseFloat(form.pct_aprobados) : null,
      }
      const res = await fetch('/api/indicadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ ok: false, message: 'Error de conexión' })
    }
    setLoading(false)
  }

  const LimpiezaStars = () => (
    <div className="flex gap-2">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => setForm(f => ({ ...f, limpieza: String(n) }))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <Star size={28}
            fill={parseInt(form.limpieza) >= n ? '#C9A84C' : 'none'}
            style={{ color: parseInt(form.limpieza) >= n ? '#C9A84C' : '#374151' }}
          />
        </button>
      ))}
    </div>
  )

  const limpiezaLabels = { '1': 'Incumplimiento reiterado', '2': 'Desorden visible', '3': 'Detalles menores', '4': 'Orden general correcto', '5': 'Aula impecable' }

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">
        {/* Header */}
        <div className="px-6 py-8" style={{
          background: 'linear-gradient(135deg, #0a1a0f, #0d3320, #0a1a0f)',
          borderBottom: '1px solid rgba(5,150,105,0.2)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(5,150,105,0.2)' }}>
              <ClipboardList size={24} style={{ color: '#6EE7B7' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                INDICADORES
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem' }}>
                Carga mensual de datos por curso
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-lg">

          {result?.ok && (
            <div className="mb-4 p-4 rounded-xl flex items-center gap-3 slide-in" style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)' }}>
              <CheckCircle size={20} style={{ color: '#6EE7B7' }} />
              <span style={{ fontFamily: 'var(--font-condensed)', color: '#6EE7B7' }}>Indicadores guardados correctamente</span>
            </div>
          )}
          {result && !result.ok && (
            <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <AlertCircle size={20} style={{ color: '#FCA5A5' }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#FCA5A5', fontSize: '0.9rem' }}>{result.message}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Curso + Mes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>CURSO</label>
                <select className="input-videla" value={form.curso_id} onChange={e => setForm(f => ({...f, curso_id: e.target.value}))}>
                  <option value="">Seleccionar...</option>
                  {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>MES</label>
                <select className="input-videla" value={form.mes} onChange={e => setForm(f => ({...f, mes: e.target.value}))}>
                  {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* FORMATIVA section */}
            <div className="rounded-xl p-4 space-y-4" style={{ border: '1px solid rgba(5,150,105,0.2)', background: 'rgba(5,150,105,0.05)' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#6EE7B7', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                🟢 DIMENSIÓN FORMATIVA
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>LIMPIEZA DEL AULA</label>
                <LimpiezaStars />
                <div style={{ fontFamily: 'var(--font-body)', color: '#C9A84C', fontSize: '0.8rem', marginTop: '4px' }}>
                  {limpiezaLabels[form.limpieza as keyof typeof limpiezaLabels]}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>CUMPLIMIENTO DE UNIFORME</label>
                <div className="flex gap-2">
                  {UNIFORME_OPCIONES.map(opt => (
                    <button key={opt} onClick={() => setForm(f => ({...f, uniforme: opt}))}
                      className="px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        fontFamily: 'var(--font-condensed)',
                        background: form.uniforme === opt ? 'rgba(5,150,105,0.3)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.uniforme === opt ? 'rgba(5,150,105,0.6)' : 'rgba(255,255,255,0.1)'}`,
                        color: form.uniforme === opt ? '#6EE7B7' : '#9CA3AF',
                        cursor: 'pointer'
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>PUNTUALIDAD %</label>
                  <input type="number" min="0" max="100" step="0.1" className="input-videla"
                    placeholder="ej: 92.5"
                    value={form.puntualidad}
                    onChange={e => setForm(f => ({...f, puntualidad: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>ASISTENCIA %</label>
                  <input type="number" min="0" max="100" step="0.1" className="input-videla"
                    placeholder="ej: 88.0"
                    value={form.asistencia}
                    onChange={e => setForm(f => ({...f, asistencia: e.target.value}))} />
                </div>
              </div>
            </div>

            {/* RESOLUTIVA section */}
            <div className="rounded-xl p-4 space-y-4" style={{ border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.05)' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#FCA5A5', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                🔴 DIMENSIÓN RESOLUTIVA
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>ACTAS DISCIPLINARIAS</label>
                  <input type="number" min="0" className="input-videla"
                    value={form.actas}
                    onChange={e => setForm(f => ({...f, actas: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>PUNTOS ICE QUITADOS</label>
                  <input type="number" min="0" className="input-videla"
                    value={form.ice_puntos}
                    onChange={e => setForm(f => ({...f, ice_puntos: e.target.value}))} />
                </div>
              </div>
            </div>

            {/* PREVENTIVA section */}
            <div className="rounded-xl p-4 space-y-4" style={{ border: '1px solid rgba(37,99,235,0.2)', background: 'rgba(37,99,235,0.05)' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#93C5FD', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                🔵 DIMENSIÓN PREVENTIVA
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>INTERV. TEMPRANAS</label>
                  <input type="number" min="0" className="input-videla"
                    value={form.interv_tempranas}
                    onChange={e => setForm(f => ({...f, interv_tempranas: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>SIT. ANTES DE ACTA</label>
                  <input type="number" min="0" className="input-videla"
                    value={form.situaciones_previas}
                    onChange={e => setForm(f => ({...f, situaciones_previas: e.target.value}))} />
                </div>
              </div>
            </div>

            {/* ACADÉMICA */}
            <div className="rounded-xl p-4 space-y-4" style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.05)' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#FCD34D', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                🟡 DIMENSIÓN ACADÉMICA
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>% MATERIAS APROBADAS</label>
                <input type="number" min="0" max="100" step="0.1" className="input-videla"
                  placeholder="ej: 78.5"
                  value={form.pct_aprobados}
                  onChange={e => setForm(f => ({...f, pct_aprobados: e.target.value}))} />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.curso_id || loading}
              className="btn-gold w-full"
            >
              {loading ? 'Guardando...' : 'GUARDAR INDICADORES'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
