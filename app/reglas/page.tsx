import Nav from '@/components/Nav'
import { BookOpen } from 'lucide-react'

const RUBRICA_LIMPIEZA = [
  { val: '⭐⭐⭐⭐⭐', label: '5 – Aula impecable', desc: 'Sin residuos, bancos ordenados, pizarrón limpio.' },
  { val: '⭐⭐⭐⭐',   label: '4 – Orden general correcto', desc: 'Pequeños detalles pero el aula luce ordenada.' },
  { val: '⭐⭐⭐',     label: '3 – Detalles menores', desc: 'Papeles en el piso, bancos algo desordenados.' },
  { val: '⭐⭐',       label: '2 – Desorden visible', desc: 'Múltiples puntos sucios o desordenados.' },
  { val: '⭐',         label: '1 – Incumplimiento reiterado', desc: 'Aula sistemáticamente descuidada.' },
]

export default function ReglasPage() {
  const G    = '#2D7A4F'
  const O    = '#E85D04'
  const R    = '#C1121F'
  const GOLD = '#B45309'

  const SectionTitle = ({ text, color = G }: { text: string; color?: string }) => (
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color, letterSpacing: '0.08em', marginBottom: '14px', borderLeft: `4px solid ${color}`, paddingLeft: '12px' }}>
      {text}
    </h2>
  )

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="main-content-tall">

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

          {/* Dimensiones */}
          <section>
            <SectionTitle text="DIMENSIONES DEL MODELO" color="var(--green-dark)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'CONVIVENCIA',             sub: 'VIR, actas, ICE',              pts: '40 pts',        color: R,         bg: '#FEE2E2', border: '#FCA5A5' },
                { title: 'HÁBITOS INSTITUCIONALES',  sub: 'Uniforme, asistencia, entorno', pts: '40 pts',        color: '#064E3B', bg: '#D1FAE5', border: '#6EE7B7' },
                { title: 'APORTES A LA CONVIVENCIA', sub: 'Acciones destacadas',           pts: 'hasta +20 pts', color: GOLD,       bg: '#FEF3C7', border: '#FCD34D' },
                { title: 'DESEMPEÑO ACADÉMICO',      sub: 'Aprobados por período',         pts: '20 pts',        color: '#78350F', bg: '#FEF3C7', border: '#FCD34D' },
              ].map(({ title, sub, pts, color, bg, border }) => (
                <div key={title} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color, letterSpacing: '0.05em' }}>{title}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '1.6rem', lineHeight: 1, margin: '4px 0' }}>{pts}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color, fontSize: '0.82rem', opacity: 0.85 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#E8F5EE', border: '2px solid var(--green-border)', borderRadius: '10px', padding: '12px 16px', marginTop: '12px' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700, fontSize: '0.85rem' }}>
                📊 Total base: 80 pts (Convivencia + Hábitos Institucionales) + hasta 20 pts de Aportes a la Convivencia = hasta 100 pts/mes
              </div>
              <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.8rem', marginTop: '2px', opacity: 0.8 }}>
                + 20 pts académicos al cierre de cada período (julio y diciembre)
              </div>
            </div>
          </section>

          {/* Aportes a la Convivencia - explicación completa */}
          <section>
            <SectionTitle text="⭐ APORTES A LA CONVIVENCIA — CÓMO FUNCIONA" color={GOLD} />
            <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--font-body)', color: '#78350F', lineHeight: 1.7, fontSize: '0.92rem' }}>
                Los <strong>Aportes a la Convivencia</strong> reconocen a los cursos que participan en acciones institucionales destacadas con puntos extra
                que se suman al puntaje mensual.
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.85rem', marginTop: '10px', lineHeight: 1.6 }}>
                • El <strong>docente o preceptor</strong> que registra la acción asigna el valor (1 a 10 pts).<br />
                • Se pueden acumular múltiples acciones por mes, con un <strong>tope de 20 pts/mes</strong>.<br />
                • Permite que cursos puedan <strong>recuperar terreno</strong> en el ranking.
              </div>
            </div>

            {/* Tipos de acción */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #FCD34D' }}>
              <div style={{ background: GOLD, color: 'white', padding: '10px 16px', fontFamily: 'var(--font-condensed)', fontSize: '0.8rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                TIPOS DE ACCIONES VÁLIDAS
              </div>
              {[
                { accion: 'Participación en actos escolares', ej: 'Izamiento, acto del 25 de mayo, etc.' },
                { accion: 'Representación institucional en actividades externas', ej: 'Competencias, olimpíadas, exposiciones' },
                { accion: 'Proyecto solidario', ej: 'Colectas, campañas de concientización' },
                { accion: 'Producción institucional', ej: 'Flyers, campañas de comunicación, streaming' },
                { accion: 'Propuesta del curso', ej: 'Día del niño, actividades internas de la división' },
              ].map(({ accion, ej }, i) => (
                <div key={accion} style={{ padding: '12px 16px', background: i % 2 === 0 ? 'white' : '#FFFBEB', borderTop: i > 0 ? '1px solid #FDE68A' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontWeight: 700, fontSize: '0.88rem' }}>{accion}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.78rem', marginTop: '2px', opacity: 0.8 }}>Ej: {ej}</div>
                </div>
              ))}
            </div>

            {/* Escala de puntos */}
            <div style={{ background: 'white', border: '2px solid #FCD34D', borderRadius: '10px', padding: '16px', marginTop: '12px' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: GOLD, fontWeight: 700, fontSize: '0.82rem', marginBottom: '10px', letterSpacing: '0.08em' }}>
                ESCALA DE PUNTOS (asignada por el docente)
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { pts: '2', label: 'Participación básica' },
                  { pts: '4', label: 'Buena participación' },
                  { pts: '6', label: 'Participación destacada' },
                  { pts: '8', label: 'Impacto institucional' },
                  { pts: '10', label: 'Impacto excepcional' },
                ].map(({ pts, label }) => (
                  <div key={pts} style={{ textAlign: 'center', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '8px', padding: '10px 6px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', color: GOLD, fontSize: '1.5rem', lineHeight: 1 }}>+{pts}</div>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.65rem', marginTop: '4px', lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tabla de puntajes */}
          <section>
            <SectionTitle text="TABLA DE PUNTAJES MENSUAL" color={O} />
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--green-border)' }}>
              <div style={{ background: G, color: 'white', padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', fontFamily: 'var(--font-condensed)', fontSize: '0.8rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                <span>INDICADOR</span><span>DIM.</span><span>PTS</span>
              </div>
              {[
                { indicador: 'VIR resueltos sin escalar (100%)', pts: '+20', dim: 'Convivencia',  color: '#991B1B', bg: '#FEE2E2' },
                { indicador: 'Sin actas disciplinarias',          pts: '+12', dim: 'Convivencia',  color: '#991B1B', bg: '#FEE2E2' },
                { indicador: 'Puntos ICE = 0',                    pts: '+8',  dim: 'Convivencia',  color: '#991B1B', bg: '#FEE2E2' },
                { indicador: 'Limpieza 5/5',                      pts: '+10', dim: 'Hábitos',      color: '#064E3B', bg: '#D1FAE5' },
                { indicador: 'Uniforme >95%',                     pts: '+10', dim: 'Hábitos',      color: '#064E3B', bg: '#D1FAE5' },
                { indicador: 'Asistencia ≥95%',                   pts: '+10', dim: 'Hábitos',      color: '#064E3B', bg: '#D1FAE5' },
                { indicador: 'Acción de campo (valor docente)',    pts: '+1 a +10', dim: 'Aportes', color: '#78350F', bg: '#FEF3C7' },
                { indicador: 'Materias aprobadas ≥90% (período)', pts: '+20', dim: 'Desempeño Ac.',color: '#78350F', bg: '#FEF3C7' },
              ].map((r, i) => (
                <div key={i} style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', alignItems: 'center', background: i % 2 === 0 ? 'white' : '#F4F7F4', borderTop: '1px solid rgba(45,122,79,0.1)' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#0F2010', fontWeight: 500 }}>{r.indicador}</span>
                  <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.72rem', background: r.bg, color: r.color, padding: '3px 8px', borderRadius: '20px', fontWeight: 700, whiteSpace: 'nowrap' as const }}>{r.dim}</span>
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
                <div key={i} style={{ padding: '12px 16px', background: i % 2 === 0 ? 'white' : '#F4F7F4', borderTop: i > 0 ? '1px solid rgba(45,122,79,0.12)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{r.val}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: '#1A4D2E', fontWeight: 700, fontSize: '0.9rem' }}>{r.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.82rem', marginTop: '2px' }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
