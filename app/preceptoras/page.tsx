'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

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
  quita_convivencia: string
  quita_var: string
  derivados_consejo: string
  asistencia_pct: string
  uniforme_pct: string
  acciones_positivas: string
}
const EMPTY: FormData = {
  quita_convivencia: '', quita_var: '', derivados_consejo: '',
  asistencia_pct: '', uniforme_pct: '', acciones_positivas: '',
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

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(setSession)
    fetch('/api/cursos')
      .then(r => r.json())
      .then((d: any[]) => { if (d.length) setCursos(d.map(c => c.nombre || c)) })
      .catch(() => {})
  }, [])

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/indicadores-mensuales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curso, mes, anio: new Date().getFullYear(),
          quita_convivencia:  Number(form.quita_convivencia)  || 0,
          quita_var:          Number(form.quita_var)          || 0,
          derivados_consejo:  Number(form.derivados_consejo)  || 0,
          asistencia_pct:     Number(form.asistencia_pct)     || 0,
          uniforme_pct:       Number(form.uniforme_pct)       || 0,
          acciones_positivas: Number(form.acciones_positivas) || 0,
          registrado_por: session?.usuario ?? 'preceptora',
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('ok')
        setMsg(`Registro guardado: ${curso} — ${MESES[mes - 1]}`)
        setForm(EMPTY)
      } else {
        setStatus('err')
        setMsg(data.error || 'Error al guardar.')
      }
    } catch {
      setStatus('err')
      setMsg('Error de conexión. Verificá tu conexión e intentá de nuevo.')
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

            {/* Quita de puntos */}
            <SectionBlock title="QUITA DE PUNTOS" color="#991B1B" bg="#FEF2F2" border="rgba(193,18,31,0.18)">
              <InputRow>
                <div>
                  <FieldLabel label="CONVIVENCIA" hint="(pts)" />
                  <input type="number" min="0" style={inputStyle} value={form.quita_convivencia} onChange={set('quita_convivencia')} placeholder="0" />
                </div>
                <div>
                  <FieldLabel label="VAR" hint="(pts)" />
                  <input type="number" min="0" style={inputStyle} value={form.quita_var} onChange={set('quita_var')} placeholder="0" />
                </div>
              </InputRow>
            </SectionBlock>

            {/* Hábitos institucionales */}
            <SectionBlock title="HÁBITOS INSTITUCIONALES" color="#166534" bg="#F0FDF4" border="rgba(45,122,79,0.2)">
              <InputRow>
                <div>
                  <FieldLabel label="% ASISTENCIA PROM." />
                  <input type="number" min="0" max="100" step="0.1" style={inputStyle} value={form.asistencia_pct} onChange={set('asistencia_pct')} placeholder="0.0" />
                </div>
                <div>
                  <FieldLabel label="% UNIFORME" />
                  <input type="number" min="0" max="100" step="0.1" style={inputStyle} value={form.uniforme_pct} onChange={set('uniforme_pct')} placeholder="0.0" />
                </div>
              </InputRow>
            </SectionBlock>

            {/* Gestión institucional */}
            <SectionBlock title="GESTIÓN INSTITUCIONAL" color="#92400E" bg="#FFFBEB" border="rgba(180,83,9,0.18)">
              <InputRow>
                <div>
                  <FieldLabel label="DERIVADOS CONSEJO" hint="(alumnos)" />
                  <input type="number" min="0" style={inputStyle} value={form.derivados_consejo} onChange={set('derivados_consejo')} placeholder="0" />
                </div>
                <div>
                  <FieldLabel label="ACCIONES POSITIVAS" />
                  <input type="number" min="0" style={inputStyle} value={form.acciones_positivas} onChange={set('acciones_positivas')} placeholder="0" />
                </div>
              </InputRow>
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
