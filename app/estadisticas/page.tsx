'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Download, BarChart3 } from 'lucide-react'

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const YEAR = new Date().getFullYear()
const GD = '#1A4D2E'

// ─── KPI Card ─── (module scope — no inline components)
function KpiCard({
  label, value, prev, unit = '',
}: {
  label: string; value: number; prev: number | null; unit?: string
}) {
  const diff = prev !== null ? value - prev : null
  const pct  = prev !== null && prev !== 0 ? ((diff! / prev) * 100).toFixed(1) : null

  const isNegativeMetric = /QUITA|DERIVADOS/i.test(label)
  const trend = diff === null ? 'same' : diff > 0 ? 'up' : diff < 0 ? 'down' : 'same'
  const good  = trend === 'same' ? null : isNegativeMetric ? trend === 'down' : trend === 'up'

  const trendColor = good === null ? '#9CA3AF' : good ? '#2D7A4F' : '#C1121F'
  const trendBg    = good === null ? '#F3F4F6' : good ? '#F0FDF4' : '#FEF2F2'

  return (
    <div style={{
      background: 'white', border: '2px solid rgba(45,122,79,0.14)',
      borderRadius: '14px', padding: '18px 16px',
    }}>
      <div style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.68rem', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', color: GD, fontSize: '2.2rem', lineHeight: 1, marginBottom: '8px' }}>
        {value}{unit}
      </div>
      {diff !== null && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          background: trendBg, borderRadius: '6px', padding: '3px 9px',
        }}>
          {trend === 'up'
            ? <TrendingUp size={12} style={{ color: trendColor }} />
            : trend === 'down'
            ? <TrendingDown size={12} style={{ color: trendColor }} />
            : <Minus size={12} style={{ color: trendColor }} />}
          <span style={{ fontFamily: 'var(--font-condensed)', color: trendColor, fontSize: '0.72rem', fontWeight: 700 }}>
            {diff > 0 ? '+' : ''}{Number.isInteger(diff) ? diff : diff.toFixed(1)}{unit}
            {pct ? ` (${pct}%)` : ''}
          </span>
        </div>
      )}
      {prev !== null && (
        <div style={{ fontFamily: 'var(--font-body)', color: '#D1D5DB', fontSize: '0.68rem', marginTop: '5px' }}>
          Mes anterior: {prev}{unit}
        </div>
      )}
    </div>
  )
}

// ─── Chart Card ───
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', border: '2px solid rgba(45,122,79,0.14)',
      borderRadius: '16px', padding: '22px',
    }}>
      <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '0.8rem', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '18px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

interface MonthData {
  mes: number; nombre: string; corto: string
  quita_convivencia: number; quita_var: number; derivados_consejo: number
  asistencia_pct: number; uniforme_pct: number; acciones_positivas: number
}

const TOOLTIP_STYLE = { fontFamily: 'Barlow Condensed', fontSize: 12, border: '1px solid #E5E7EB' }
const TICK_STYLE    = { fontFamily: 'Barlow Condensed', fontSize: 11 }
const LEGEND_STYLE  = { fontFamily: 'Barlow Condensed', fontSize: 12 }

export default function EstadisticasPage() {
  const [meses,   setMeses]   = useState<number[]>([])
  const [curso,   setCurso]   = useState('todos')
  const [cursos,  setCursos]  = useState<string[]>([])
  const [data,    setData]    = useState<MonthData[]>([])
  const [loading, setLoading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Seleccionar mes actual y anterior por defecto
  useEffect(() => {
    const m = new Date().getMonth() + 1
    setMeses(m > 1 ? [m - 1, m] : [m])
    fetch('/api/cursos')
      .then(r => r.json())
      .then((d: any[]) => setCursos(d.map(c => c.nombre || c)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (meses.length === 0) { setData([]); return }
    setLoading(true)
    Promise.all([
      fetch('/api/campo').then(r => r.json()),
      ...meses.map(m =>
        fetch(`/api/indicadores-mensuales?mes=${m}&anio=${YEAR}${curso !== 'todos' ? `&curso=${encodeURIComponent(curso)}` : ''}`)
          .then(r => r.json())
      )
    ]).then((results: any[]) => {
      const campoData = Array.isArray(results[0]) ? results[0] : []
      const mensResults = results.slice(1)

      const aggregated: MonthData[] = meses.map((mes, i) => {
        const rows = mensResults[i]
        
        // Calcular acciones positivas reales desde la API de campo
        const accPositivas = campoData.filter((c: any) => 
          c.mes === mes && 
          c.anio === YEAR && 
          (curso === 'todos' || c.curso_nombre === curso)
        ).length

        if (!rows.length) return {
          mes, nombre: MESES[mes - 1], corto: MESES_CORTO[mes - 1],
          quita_convivencia: 0, quita_var: 0, derivados_consejo: 0,
          asistencia_pct: 0, uniforme_pct: 0, acciones_positivas: accPositivas,
        }
        const sum = (k: string) => rows.reduce((s: number, r: any) => s + (r[k] || 0), 0)
        const avg = (k: string) => parseFloat((sum(k) / rows.length).toFixed(1))
        return {
          mes, nombre: MESES[mes - 1], corto: MESES_CORTO[mes - 1],
          quita_convivencia:  sum('quita_convivencia'),
          quita_var:          sum('quita_var'),
          derivados_consejo:  sum('derivados_consejo'),
          asistencia_pct:     avg('asistencia_pct'),
          uniforme_pct:       avg('uniforme_pct'),
          acciones_positivas: accPositivas,
        }
      })
      setData(aggregated)
    }).finally(() => setLoading(false))
  }, [meses, curso])

  const toggleMes = (m: number) =>
    setMeses(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m].sort((a, b) => a - b))

  const cur  = data[data.length - 1] ?? null
  const prev = data.length > 1 ? data[data.length - 2] : null

  const handlePrint = () => window.print()

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="main-with-sidebar" style={{ padding: '32px 20px 56px' }}>
        <div ref={reportRef} style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '28px', flexWrap: 'wrap', gap: '14px',
          }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: GD, letterSpacing: '0.06em', margin: '0 0 4px' }}>
                ESTADÍSTICAS
              </h1>
              <p style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.82rem', letterSpacing: '0.06em', margin: 0 }}>
                Comparativa mensual de indicadores · {YEAR}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="no-print"
              style={{
                background: GD, border: 'none', borderRadius: '10px',
                padding: '10px 18px', color: 'white',
                fontFamily: 'var(--font-condensed)', fontSize: '0.88rem',
                letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <Download size={15} /> DESCARGAR REPORTE (PDF)
            </button>
          </div>

          {/* Filtros */}
          <div style={{
            background: 'white', border: '2px solid rgba(45,122,79,0.18)',
            borderRadius: '16px', padding: '22px', marginBottom: '24px',
          }} className="no-print">
            <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '14px' }}>
              SELECCIONÁ LOS MESES A COMPARAR
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
              {MESES.map((nombre, i) => {
                const m = i + 1
                const on = meses.includes(m)
                return (
                  <button key={m} onClick={() => toggleMes(m)} style={{
                    background: on ? GD : 'white',
                    color: on ? 'white' : '#2D5A30',
                    border: `2px solid ${on ? GD : 'rgba(45,122,79,0.3)'}`,
                    borderRadius: '8px', padding: '5px 13px',
                    fontFamily: 'var(--font-condensed)', fontSize: '0.82rem',
                    letterSpacing: '0.04em', cursor: 'pointer', fontWeight: on ? 700 : 400,
                  }}>
                    {nombre}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700 }}>
                CURSO:
              </span>
              <select value={curso} onChange={e => setCurso(e.target.value)} className="input-videla" style={{ maxWidth: '200px' }}>
                <option value="todos">Todos los cursos</option>
                {cursos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-condensed)', color: '#9CA3AF', letterSpacing: '0.1em' }}>
              CARGANDO DATOS...
            </div>
          )}

          {/* Sin datos */}
          {!loading && meses.length > 0 && data.every(d =>
            d.quita_convivencia === 0 && d.quita_var === 0 && d.derivados_consejo === 0 &&
            d.asistencia_pct === 0 && d.uniforme_pct === 0 && d.acciones_positivas === 0
          ) && (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: 'white', border: '2px solid rgba(45,122,79,0.14)',
              borderRadius: '16px',
            }}>
              <BarChart3 size={44} style={{ color: '#E5E7EB', marginBottom: '14px' }} />
              <p style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.9rem', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                SIN REGISTROS PARA LOS MESES SELECCIONADOS
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: '#D1D5DB', fontSize: '0.78rem', margin: 0 }}>
                Cargá datos desde el módulo de Preceptoras.
              </p>
            </div>
          )}

          {/* KPIs */}
          {!loading && cur && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '12px' }}>
                INDICADORES — {cur.nombre.toUpperCase()}
                {prev ? ` vs ${prev.nombre.toUpperCase()}` : ''}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px', marginBottom: '28px',
              }}>
                <KpiCard label="ICE (ALUMNOS)" value={cur.quita_convivencia} prev={prev?.quita_convivencia ?? null} unit="" />
                <KpiCard label="VIR (NO RESUELTOS)" value={cur.quita_var} prev={prev?.quita_var ?? null} unit="" />
                <KpiCard label="DERIVADOS CONSEJO"  value={cur.derivados_consejo}  prev={prev?.derivados_consejo  ?? null} />
                <KpiCard label="% ASISTENCIA"       value={cur.asistencia_pct}     prev={prev?.asistencia_pct     ?? null} unit="%" />
                <KpiCard label="% UNIFORME"         value={cur.uniforme_pct}       prev={prev?.uniforme_pct       ?? null} unit="%" />
                <KpiCard label="ACCIONES POSITIVAS" value={cur.acciones_positivas} prev={prev?.acciones_positivas ?? null} />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '18px' }}>

                <ChartCard title="QUITA DE PUNTOS POR MES">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="corto" tick={TICK_STYLE} />
                      <YAxis tick={TICK_STYLE} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={LEGEND_STYLE} />
                      <Bar dataKey="quita_convivencia" name="ICE (Alumnos)" fill="#991B1B" radius={[4,4,0,0]} />
                      <Bar dataKey="quita_var"          name="VIR"        fill="#E85D04" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="ASISTENCIA Y UNIFORME (%)">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="corto" tick={TICK_STYLE} />
                      <YAxis domain={[0, 100]} tick={TICK_STYLE} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={LEGEND_STYLE} />
                      <Line type="monotone" dataKey="asistencia_pct" name="Asistencia %" stroke="#2D7A4F" strokeWidth={2} dot={{ r: 4, fill: '#2D7A4F' }} />
                      <Line type="monotone" dataKey="uniforme_pct"   name="Uniforme %"   stroke="#1D4ED8" strokeWidth={2} dot={{ r: 4, fill: '#1D4ED8' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="ACCIONES POSITIVAS Y DERIVADOS">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="corto" tick={TICK_STYLE} />
                      <YAxis tick={TICK_STYLE} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={LEGEND_STYLE} />
                      <Bar dataKey="acciones_positivas" name="Acc. Positivas" fill="#2D7A4F" radius={[4,4,0,0]} />
                      <Bar dataKey="derivados_consejo"  name="Derivados"      fill="#B45309" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

              </div>
            </>
          )}

          {/* Pie de página del reporte */}
          <div className="print-only" style={{ display: 'none', marginTop: '32px', textAlign: 'center', fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem' }}>
            Esc. Nº 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · Sistema VIR {YEAR}
          </div>
        </div>
      </main>
    </div>
  )
}
