import Nav from '@/components/Nav'
import { BookOpen } from 'lucide-react'

const RUBRICA_LIMPIEZA = [
  { val: '⭐⭐⭐⭐⭐', label: '5 – Aula impecable', desc: 'Sin residuos, bancos ordenados, pizarrón limpio, no hay elementos personales olvidados.' },
  { val: '⭐⭐⭐⭐', label: '4 – Orden general correcto', desc: 'Pequeños detalles pero el aula luce ordenada y limpia en términos generales.' },
  { val: '⭐⭐⭐', label: '3 – Detalles menores', desc: 'Papeles en el piso, bancos algo desordenados, requiere atención puntual.' },
  { val: '⭐⭐', label: '2 – Desorden visible', desc: 'Múltiples puntos sucios o desordenados que requieren intervención.' },
  { val: '⭐', label: '1 – Incumplimiento reiterado', desc: 'Aula sistemáticamente descuidada. Se registra y comunica a la división.' },
]

const PUNTAJE_TABLA = [
  { indicador: 'VAR resueltos sin escalar (100%)', pts: '+15', dim: 'Resolutivo', color: '#FCA5A5' },
  { indicador: 'Sin actas disciplinarias', pts: '+10', dim: 'Resolutivo', color: '#FCA5A5' },
  { indicador: 'Puntos ICE = 0', pts: '+5', dim: 'Resolutivo', color: '#FCA5A5' },
  { indicador: 'Limpieza 5/5', pts: '+8', dim: 'Formativo', color: '#6EE7B7' },
  { indicador: 'Uniforme >95%', pts: '+8', dim: 'Formativo', color: '#6EE7B7' },
  { indicador: 'Puntualidad ≥95%', pts: '+7', dim: 'Formativo', color: '#6EE7B7' },
  { indicador: 'Asistencia ≥95%', pts: '+7', dim: 'Formativo', color: '#6EE7B7' },
  { indicador: 'Intervenciones tempranas ×3 (máx 10)', pts: '+10', dim: 'Preventivo', color: '#93C5FD' },
  { indicador: 'Situaciones antes de acta ×3 (máx 10)', pts: '+10', dim: 'Preventivo', color: '#93C5FD' },
  { indicador: 'Materias aprobadas ≥90%', pts: '+20', dim: 'Académico', color: '#FCD34D' },
]

export default function ReglasPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">

        {/* Header */}
        <div className="px-6 py-8" style={{
          background: 'linear-gradient(135deg, #0a1205, #1a2c08, #0a1205)',
          borderBottom: '1px solid rgba(201,168,76,0.2)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(201,168,76,0.2)' }}>
              <BookOpen size={24} style={{ color: '#FCD34D' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                REGLAS Y RÚBRICAS
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem' }}>
                Criterios objetivos y sistema de puntos
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-2xl space-y-8">

          {/* Dimensions */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '12px' }}>
              DIMENSIONES DEL MODELO
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'RESOLUTIVA', sub: 'Gestión de conflictos', pts: '30 pts máx.', color: '#DC2626', badge: 'badge-resolutivo',
                  items: ['VAR activados y resueltos', 'Actas disciplinarias', 'Puntos ICE'] },
                { title: 'FORMATIVA', sub: 'Hábitos institucionales', pts: '30 pts máx.', color: '#059669', badge: 'badge-formativo',
                  items: ['Limpieza del aula', 'Cumplimiento de uniforme', 'Puntualidad', 'Asistencia'] },
                { title: 'PREVENTIVA', sub: 'Anticipación al conflicto', pts: '20 pts máx.', color: '#2563EB', badge: 'badge-preventivo',
                  items: ['Intervenciones tempranas', 'Situaciones abordadas antes de acta'] },
                { title: 'ACADÉMICA', sub: 'Rendimiento escolar', pts: '20 pts máx.', color: '#C9A84C', badge: 'badge-academico',
                  items: ['% materias aprobadas'] },
              ].map(({ title, sub, pts, color, badge, items }) => (
                <div key={title} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}33` }}>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs mb-2 ${badge}`} style={{ fontFamily: 'var(--font-condensed)' }}>
                    {title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.8rem' }}>{sub}</div>
                  <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.1rem', margin: '4px 0' }}>{pts}</div>
                  <ul className="space-y-1">
                    {items.map(item => (
                      <li key={item} style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.8rem', paddingLeft: '8px', borderLeft: `2px solid ${color}44` }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* VAR Protocol */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '12px' }}>
              PROTOCOLO VAR
            </h2>
            <div className="space-y-3">
              {[
                { letra: 'V', titulo: 'VERSIÓN DE LOS HECHOS', desc: 'Cada parte involucrada expone su versión sin interrupciones. El adulto modera sin juzgar. Se respeta el turno de palabra y no se permiten ironías ni acusaciones cruzadas.', color: '#DC2626' },
                { letra: 'A', titulo: 'ACUERDO VULNERADO', desc: 'Se identifica cuál norma positiva acordada fue afectada. No se habla de "portarse mal", sino de qué compromiso institucional no se respetó.', color: '#D97706' },
                { letra: 'R', titulo: 'REPARACIÓN CONCRETA', desc: 'Se define una acción reparadora: disculpa explícita, compromiso escrito, acción concreta de servicio al curso, o devolución/reposición. Si hay reparación, el conflicto no escala a acta.', color: '#059669' },
              ].map(({ letra, titulo, desc, color }) => (
                <div key={letra} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}33` }}>
                  <div style={{
                    width: '48px', height: '48px', flexShrink: 0,
                    background: `linear-gradient(135deg, ${color}, ${color}99)`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'white'
                  }}>
                    {letra}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      {titulo}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)' }}>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#6EE7B7', fontSize: '0.8rem' }}>
                💡 IMPORTANTE: Si el conflicto se resuelve con VAR → el curso NO pierde puntos y suma en la dimensión resolutiva.
              </div>
            </div>
          </section>

          {/* Limpieza rubric */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '12px' }}>
              RÚBRICA DE LIMPIEZA
            </h2>
            <div className="space-y-2">
              {RUBRICA_LIMPIEZA.map(({ val, label, desc }) => (
                <div key={val} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ minWidth: '80px', fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.85rem' }}>{val}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', fontSize: '0.9rem' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.8rem' }}>{desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Points table */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '12px' }}>
              TABLA DE PUNTOS
            </h2>
            <div className="glass rounded-xl overflow-hidden">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-condensed)', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', color: '#6B7280', letterSpacing: '0.05em' }}>INDICADOR</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', color: '#6B7280' }}>PUNTOS</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', color: '#6B7280' }}>DIMENSIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {PUNTAJE_TABLA.map(({ indicador, pts, dim, color }) => (
                    <tr key={indicador} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 12px', color: '#D1D5DB' }}>{indicador}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#C9A84C', fontWeight: 600 }}>{pts}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ color, fontSize: '0.75rem' }}>{dim}</span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.05)' }}>
                    <td style={{ padding: '10px 12px', color: 'white', fontWeight: 600 }}>TOTAL MÁXIMO</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#C9A84C', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>100</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Recognition */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '12px' }}>
              RECONOCIMIENTO FINAL
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { titulo: '🏆 Curso con Mayor Puntaje Integral', desc: 'El curso con mayor puntuación total al cierre de cada período.' },
                { titulo: '📈 Curso con Mayor Mejora', desc: 'El curso que más creció comparando su promedio del segundo período vs. el primero.' },
                { titulo: '🤝 Curso con Mejor Autorregulación', desc: 'El curso con mayor % de VAR resueltos sin escalar a acta.' },
                { titulo: '🎓 Curso con Mayor Compromiso Académico', desc: 'El curso con mayor porcentaje de materias aprobadas al cierre del trimestre.' },
              ].map(({ titulo, desc }) => (
                <div key={titulo} className="p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', marginBottom: '4px' }}>{titulo}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem' }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
