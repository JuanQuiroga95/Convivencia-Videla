'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Save, CheckCircle, AlertCircle, RefreshCw, Star } from 'lucide-react'
const UNIFORME_OPCIONES = ['>95%', '85-95%', '<85%']

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]
const CURSOS_DEFAULT = [
  '1°1ª','1°2ª','1°3ª','1°4ª','1°5ª',
  '2°1ª','2°2ª','2°3ª','2°4ª','2°5ª',
  '3°1ª','3°2ª','3°3ª','3°4ª','3°5ª',
  '4°1ª','4°2ª','4°3ª','4°4ª',
  '5°1ª','5°2ª','5°3ª','5°4ª',
]

interface FormData {
  actas: string
  quita_convivencia: string
  derivados_consejo: string
  limpieza: string
  asistencia_pct: string
  uniforme_pct: string
}
const EMPTY: FormData = {
  actas: '0', quita_convivencia: '0', derivados_consejo: '0',
  limpieza: '3', asistencia_pct: '', uniforme_pct: '',
}

// Defined at module scope — prevents React focus-loss bug
function SectionBlock({
  title, color, bg, border, children,
}: { title: string; color: string; bg: string; border: string; children: React.ReactNode }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '18px', marginBottom: '14px' }}>
      <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '14px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function InputRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {children}
    </div>
  )
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.72rem', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
      {label}{hint && <span style={{ color: '#9CA3AF', marginLeft: '4px', fontWeight: 400 }}>{hint}</span>}
    </label>
  )
}

export default function PreceptorasPage() {
  const [session,  setSession]  = useState<any>(null)
  const [cursos,   setCursos]   = useState<string[]>(CURSOS_DEFAULT)
  const [mes,      setMes]      = useState<number>(new Date().getMonth() + 1)
  const [curso,    setCurso]    = useState<string>(CURSOS_DEFAULT[0])
  const [form,     setForm]     = useState<FormData>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [status,   setStatus]   = useState<'idle' | 'ok' | 'err'>('idle')
  const [msg,      setMsg]      = useState('')
  const [virStats, setVirStats] = useState({ total: 0, unresolved: 0 })

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(setSession)
    fetch('/api/cursos')
      .then(r => r.json())
      .then((d: any[]) => { if (d.length) setCursos(d.map(c => c.nombre || c)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`/api/var?curso_nombre=${encodeURIComponent(curso)}&mes=${mes}`)
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const total = data.length
          const unresolved = data.filter(v => !v.resuelto).length
          setVirStats({ total, unresolved })
        } else {
          setVirStats({ total: 0, unresolved: 0 })
        }
      })
      .catch(() => setVirStats({ total: 0, unresolved: 0 }))
  }, [curso, mes])

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const limpiezaLabels: Record<string, string> = {
    '1': 'Incumplimiento reiterado', '2': 'Desorden visible',
    '3': 'Detalles menores', '4': 'Orden general correcto', '5': 'Aula impecable',
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus('idle')
    try {
      // 1. Guardar en API para estadísticas
      let numUniforme = 0
      if (form.uniforme_pct === '>95%') numUniforme = 98
      else if (form.uniforme_pct === '85-95%') numUniforme = 90
      else if (form.uniforme_pct === '<85%') numUniforme = 80

      const statsPayload = {
        curso, mes, anio: new Date().getFullYear(),
        quita_convivencia:  Number(form.quita_convivencia)  || 0,
        quita_var:          virStats.unresolved,
        derivados_consejo:  Number(form.derivados_consejo)  || 0,
        asistencia_pct:     Number(form.asistencia_pct)     || 0,
        uniforme_pct:       numUniforme,
        acciones_positivas: 0, // Ya no lo cargan preceptoras
        registrado_por: session?.usuario ?? 'preceptora',
      }

      // 2. Guardar en API de indicadores (para Ranking)
      // Buscamos el curso_id buscando el curso en la lista de Cursos (asumiendo que la ruta /api/cursos devuelve array de objs)
      // Pero no tenemos el curso_id a mano. Haremos un fetch a /api/cursos para obtener el ID real.
      const cursosRes = await fetch('/api/cursos')
      const cursosList = await cursosRes.json()
      const cursoObj = cursosList.find((c: any) => c.nombre === curso)
      
      if (!cursoObj) throw new Error('Curso no encontrado')

      const rankingPayload = {
        curso_id: cursoObj.id, mes, anio: new Date().getFullYear(),
        limpieza: Number(form.limpieza),
        ice_puntos: Number(form.quita_convivencia) || 0,
        actas: Number(form.actas) || 0,
        asistencia: Number(form.asistencia_pct) || null,
        uniforme: form.uniforme_pct || null,
        pct_aprobados: null,
      }

      const [resStats, resRanking] = await Promise.all([
        fetch('/api/indicadores-mensuales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(statsPayload)
        }),
        fetch('/api/indicadores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rankingPayload)
        })
      ])

      const dataStats = await resStats.json()
      const dataRanking = await resRanking.json()

      if (dataStats.ok && dataRanking.ok) {
        setStatus('ok')
        setMsg(`Registro guardado: ${curso} — ${MESES[mes - 1]}`)
        setForm(EMPTY)
      } else {
        setStatus('err')
        setMsg(dataStats.error || dataRanking.error || 'Error al guardar.')
      }
    } catch (e: any) {
      setStatus('err')
      setMsg(e.message || 'Error de conexión. Verificá tu conexión e intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'white',
    border: '2px solid rgba(45,122,79,0.3)', borderRadius: '8px',
    padding: '10px 12px', fontFamily: 'var(--font-body)',
    fontSize: '1rem', color: '#0F2010', outline: 'none',
  }

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="main-with-sidebar" style={{ padding: '32px 20px 48px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#1A4D2E', letterSpacing: '0.06em', margin: '0 0 4px' }}>
              CARGA MENSUAL
            </h1>
            <p style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.82rem', letterSpacing: '0.06em', margin: 0 }}>
              Gestión de indicadores · Módulo de Preceptoras
            </p>
          </div>

          {/* Guía Rápida */}
          <div style={{ background: '#E8F5EE', border: '1px solid #86EFAC', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.9rem', color: '#166534', margin: '0 0 10px 0', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> GUÍA PARA PRECEPTORAS
            </h3>
              <li style={{ marginBottom: '6px' }}><strong>ACTAS E ICE:</strong> Cantidad de actas labradas y alumnos con quita de puntos en el mes. No afectan el ranking, solo estadística.</li>
              <li style={{ marginBottom: '6px' }}><strong>VIR:</strong> Muestra la cantidad de VIR registrados y cuántos faltan resolver. (Calculado por el sistema, no editable).</li>
              <li style={{ marginBottom: '6px' }}><strong>HÁBITOS:</strong> Calificar limpieza de 1 a 5, marcar rango de uniforme y colocar % exacto de asistencia (ej: 95.5). Estas variables <strong>SÍ</strong> afectan el ranking.</li>
              <li><strong>DERIVADOS CONSEJO:</strong> Cantidad exacta de alumnos derivados al Consejo Escolar en este mes.</li>
          </div>

          {/* Selectores */}
          <div style={{
            background: 'white', border: '2px solid rgba(45,122,79,0.18)',
            borderRadius: '16px', padding: '22px', marginBottom: '18px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
          }}>
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                MES
              </label>
              <select
                value={mes}
                onChange={e => setMes(Number(e.target.value))}
                className="input-videla"
              >
                {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                CURSO
              </label>
              <select
                value={curso}
                onChange={e => setCurso(e.target.value)}
                className="input-videla"
              >
                {cursos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Formulario */}
          <div style={{ background: 'white', border: '2px solid rgba(45,122,79,0.18)', borderRadius: '16px', padding: '22px', marginBottom: '18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#1A4D2E', letterSpacing: '0.05em', marginBottom: '18px' }}>
              INDICADORES — {MESES[mes - 1].toUpperCase()} · {curso}
            </div>

            {/* Dimensión Formativa */}
            <SectionBlock title="DIMENSIÓN FORMATIVA (Afecta Ranking)" color="#166534" bg="#F0FDF4" border="rgba(45,122,79,0.2)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <FieldLabel label="CUIDADO DEL ENTORNO" />
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, limpieza: String(n) }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <Star size={30} fill={parseInt(form.limpieza) >= n ? '#2D7A4F' : 'none'} style={{ color: parseInt(form.limpieza) >= n ? '#2D7A4F' : '#CBD5E1' }} />
                      </button>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.82rem', fontWeight: 500 }}>{limpiezaLabels[form.limpieza]}</div>
                </div>

                <div>
                  <FieldLabel label="CUMPLIMIENTO DE UNIFORME" />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {UNIFORME_OPCIONES.map(op => (
                      <label key={op} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', cursor: 'pointer', background: form.uniforme_pct === op ? '#2D7A4F' : 'white', border: `2px solid ${form.uniforme_pct === op ? '#2D7A4F' : '#BBF7D0'}`, transition: 'all 0.2s' }}>
                        <input type="radio" name="uniforme" value={op} checked={form.uniforme_pct === op} onChange={set('uniforme_pct')} style={{ accentColor: '#2D7A4F', cursor: 'pointer' }} />
                        <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.85rem', color: form.uniforme_pct === op ? 'white' : '#1A4D2E', fontWeight: 700 }}>{op}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel label="ASISTENCIA (%)" />
                  <input type="number" min="0" max="100" step="0.1" style={inputStyle} value={form.asistencia_pct} onChange={set('asistencia_pct')} placeholder="0–100" />
                </div>
              </div>
            </SectionBlock>

            {/* Dimensión Resolutiva */}
            <SectionBlock title="DIMENSIÓN RESOLUTIVA Actas e ICE (Solo estadístico)" color="#991B1B" bg="#FEF2F2" border="rgba(193,18,31,0.18)">
              <InputRow>
                <div>
                  <FieldLabel label="CANTIDAD DE ACTAS" />
                  <input type="number" min="0" style={inputStyle} value={form.actas} onChange={set('actas')} placeholder="0" />
                </div>
                <div>
                  <FieldLabel label="PUNTOS ICE QUITADOS" />
                  <input type="number" min="0" style={inputStyle} value={form.quita_convivencia} onChange={set('quita_convivencia')} placeholder="0" />
                </div>
              </InputRow>
              <div style={{ marginTop: '16px' }}>
                <FieldLabel label="VIR" hint="(Sistema)" />
                <div style={{ ...inputStyle, display: 'flex', justifyContent: 'space-between', background: '#F9FAFB', color: '#6B7280' }}>
                  <span>Total: <strong>{virStats.total}</strong></span>
                  <span>No resueltos: <strong style={{ color: virStats.unresolved > 0 ? '#991B1B' : 'inherit' }}>{virStats.unresolved}</strong></span>
                </div>
              </div>
            </SectionBlock>

            {/* Gestión institucional */}
            <SectionBlock title="GESTIÓN INSTITUCIONAL (Solo estadístico)" color="#92400E" bg="#FFFBEB" border="rgba(180,83,9,0.18)">
              <div>
                <FieldLabel label="DERIVADOS CONSEJO" hint="(alumnos)" />
                <input type="number" min="0" style={inputStyle} value={form.derivados_consejo} onChange={set('derivados_consejo')} placeholder="0" />
              </div>
            </SectionBlock>
          </div>

          {/* Status */}
          {status !== 'idle' && (
            <div style={{
              background: status === 'ok' ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${status === 'ok' ? 'rgba(45,122,79,0.3)' : 'rgba(193,18,31,0.3)'}`,
              borderRadius: '10px', padding: '13px 16px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              {status === 'ok'
                ? <CheckCircle size={18} style={{ color: '#2D7A4F', flexShrink: 0 }} />
                : <AlertCircle size={18} style={{ color: '#C1121F', flexShrink: 0 }} />}
              <span style={{
                fontFamily: 'var(--font-condensed)',
                color: status === 'ok' ? '#166534' : '#991B1B',
                fontSize: '0.88rem', fontWeight: 600,
              }}>
                {msg}
              </span>
            </div>
          )}

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', background: saving ? '#9CA3AF' : '#1A4D2E',
              border: 'none', borderRadius: '12px', padding: '15px',
              color: 'white', fontFamily: 'var(--font-display)',
              fontSize: '1.1rem', letterSpacing: '0.08em',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'background 0.2s',
            }}
          >
            {saving ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            {saving ? 'GUARDANDO...' : 'GUARDAR REGISTRO MENSUAL'}
          </button>

          <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.72rem', textAlign: 'center', marginTop: '12px' }}>
            Si ya existe un registro para este curso y mes, será reemplazado.
          </p>
        </div>
      </main>
    </div>
  )
}
