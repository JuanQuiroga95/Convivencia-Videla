import Nav from '@/components/Nav'
import { BookOpen } from 'lucide-react'

const RUBRICA_LIMPIEZA = [
  { val: '⭐⭐⭐⭐⭐', label: '5 – Aula impecable', desc: 'Sin residuos, bancos ordenados, pizarrón limpio.' },
  { val: '⭐⭐⭐⭐', label: '4 – Orden general correcto', desc: 'Pequeños detalles pero el aula luce ordenada.' },
  { val: '⭐⭐⭐', label: '3 – Detalles menores', desc: 'Papeles en el piso, bancos algo desordenados.' },
  { val: '⭐⭐', label: '2 – Desorden visible', desc: 'Múltiples puntos sucios o desordenados.' },
  { val: '⭐', label: '1 – Incumplimiento reiterado', desc: 'Aula sistemáticamente descuidada.' },
]

const PUNTAJE_TABLA = [
  { indicador: 'VIR resueltos sin escalar (100%)', pts: '+20', dim: 'Resolutivo', color: '#991B1B', bg: '#FEE2E2' },
  { indicador: 'Sin actas disciplinarias', pts: '+12', dim: 'Resolutivo', color: '#991B1B', bg: '#FEE2E2' },
  { indicador: 'Puntos ICE = 0', pts: '+8', dim: 'Resolutivo', color: '#991B1B', bg: '#FEE2E2' },
  { indicador: 'Limpieza 5/5', pts: '+10', dim: 'Formativo', color: '#064E3B', bg: '#D1FAE5' },
  { indicador: 'Uniforme >95%', pts: '+10', dim: 'Formativo', color: '#064E3B', bg: '#D1FAE5' },
  { indicador: 'Asistencia ≥95%', pts: '+10', dim: 'Formativo', color: '#064E3B', bg: '#D1FAE5' },
  { indicador: 'Materias aprobadas ≥90%', pts: '+20', dim: 'Académico', color: '#78350F', bg: '#FEF3C7' },
]

export default function ReglasPage() {
  const G = '#2D7A4F'
  const O = '#E85D04'
  const R = '#C1121F'

  const SectionTitle = ({ text, color = G }: { text: string, color?: string }) => (
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color, letterSpacing: '0.08em', marginBottom: '14px', borderLeft: `4px solid ${color}`, paddingLeft: '12px' }}>
      {text}
    </h2>
  )

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.25)', border: '1px solid rgba(232,93,4,0.4)' }}>
              <BookOpen size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                REGLAS Y RÚBRICAS
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Criterios objetivos y sistema de puntos
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-2xl space-y-8">

          {/* Dimensions */}
          <section>
            <SectionTitle text="DIMENSIONES DEL MODELO" color="var(--green-dark)" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'RESOLUTIVA', sub: 'Gestión de conflictos VIR', pts: '40 pts', color: R, bg: '#FEE2E2', border: '#FCA5A5' },
                { title: 'FORMATIVA',  sub: 'Uniforme, asistencia, entorno', pts: '40 pts', color: '#064E3B', bg: '#D1FAE5', border: '#6EE7B7' },
                { title: 'ACADÉMICA',  sub: 'Rendimiento académico', pts: '20 pts', color: '#78350F', bg: '#FEF3C7', border: '#FCD34D' },
              ].map(({ title, sub, pts, color, bg, border }) => (
                <div key={title} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color, letterSpacing: '0.05em' }}>{title}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '2rem', lineHeight: 1, margin: '4px 0' }}>{pts}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color, fontSize: '0.82rem', opacity: 0.8 }}>{sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Puntajes */}
          <section>
            <SectionTitle text="TABLA DE PUNTAJES" color={O} />
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--green-border)' }}>
              <div style={{ background: G, color: 'white', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', fontFamily: 'var(--font-condensed)', fontSize: '0.8rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                <span>INDICADOR</span><span>DIM.</span><span>PTS</span>
              </div>
              {PUNTAJE_TABLA.map((r, i) => (
                <div key={i} style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', alignItems: 'center', background: i % 2 === 0 ? 'white' : '#F4F7F4', borderTop: '1px solid rgba(45,122,79,0.12)' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#0F2010', fontWeight: 500 }}>{r.indicador}</span>
                  <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.75rem', background: r.bg, color: r.color, padding: '3px 8px', borderRadius: '20px', fontWeight: 700, whiteSpace: 'nowrap' as const }}>{r.dim}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: G, textAlign: 'right' as const }}>{r.pts}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Rúbrica limpieza */}
          <section>
            <SectionTitle text="RÚBRICA: CUIDADO DEL ENTORNO" color={G} />
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--green-border)' }}>
              {RUBRICA_LIMPIEZA.map((r, i) => (
                <div key={i} style={{ padding: '12px 16px', background: i % 2 === 0 ? 'white' : '#F4F7F4', borderTop: i > 0 ? '1px solid rgba(45,122,79,0.12)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{r.val}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontWeight: 700, fontSize: '0.9rem' }}>{r.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.82rem', marginTop: '2px' }}>{r.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* VIR Categorias */}
          <section>
            <SectionTitle text="CATEGORÍAS VIR" color={R} />
            <div className="space-y-2">
              {[
                { cat: '🟢 Interacción entre Pares', color: '#064E3B', bg: '#D1FAE5', border: '#6EE7B7', items: ['Esconder/romper materiales', 'Conflicto verbal', 'Hostigamiento'] },
                { cat: '🟠 Relación con Docente/Preceptor', color: '#7C2D12', bg: '#FEF3C7', border: '#FCD34D', items: ['Desobediencia', 'Respuesta verbal inadecuada', 'Ignorar consignas'] },
                { cat: '🟣 Cuidado del Entorno', color: '#4C1D95', bg: '#EDE9FE', border: '#C4B5FD', items: ['Desorden', 'Suciedad', 'Deterioro de mobiliario', 'Rayar/pintar superficies'] },
                { cat: '🔵 Relación con la Clase', color: '#1E3A5F', bg: '#DBEAFE', border: '#93C5FD', items: ['Interrupción reiterada', 'Uso indebido del celular', 'Ingreso tardío', 'No realizar la actividad'] },
                { cat: '🟡 Campo (Acciones Destacadas)', color: '#78350F', bg: '#FEF3C7', border: '#FCD34D', items: ['Actos escolares', 'Representación institucional', 'Proyectos solidarios', 'Producciones institucionales'] },
              ].map(({ cat, color, bg, border, items }) => (
                <div key={cat} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color, fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>{cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {items.map(item => (
                      <span key={item} style={{ background: 'white', color, border: `1px solid ${border}`, borderRadius: '20px', padding: '2px 10px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500 }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reparaciones */}
          <section>
            <SectionTitle text="TIPOS DE REPARACIÓN" color={G} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tipo: 'Disculpa explícita', desc: 'Reconocimiento verbal o escrito de la situación ante los afectados.', emoji: '🤝' },
                { tipo: 'Acción reparadora concreta', desc: 'Una acción específica que repara el daño causado.', emoji: '🔧' },
                { tipo: 'Reflexión guiada', desc: 'Proceso reflexivo acompañado por un adulto de la institución.', emoji: '💭' },
              ].map(({ tipo, desc, emoji }) => (
                <div key={tipo} style={{ background: 'white', border: '2px solid var(--green-border)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{emoji}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{tipo}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.8rem', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
