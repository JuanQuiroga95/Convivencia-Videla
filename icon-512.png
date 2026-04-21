import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'

const RUBRICA_LIMPIEZA = [
  { val: '⭐⭐⭐⭐⭐', label: '5 – Aula impecable', desc: 'Sin residuos, bancos ordenados, pizarrón limpio.' },
  { val: '⭐⭐⭐⭐',   label: '4 – Orden general correcto', desc: 'Pequeños detalles pero el aula luce ordenada.' },
  { val: '⭐⭐⭐',     label: '3 – Detalles menores', desc: 'Papeles en el piso, bancos algo desordenados.' },
  { val: '⭐⭐',       label: '2 – Desorden visible', desc: 'Múltiples puntos sucios o desordenados.' },
  { val: '⭐',         label: '1 – Incumplimiento reiterado', desc: 'Aula sistemáticamente descuidada.' },
]

const G = '#2D7A4F'; const GD = '#1A4D2E'; const O = '#E85D04'; const R = '#C1121F'; const GOLD = '#B45309'

export default function CriteriosPage() {
  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>

      {/* Header público — sin Nav interno */}
      <header style={{ background: GD, borderBottom: `3px solid ${O}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${O}` }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>CONVIVENCIA</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: O, letterSpacing: '0.05em', lineHeight: 1 }}>VIDELIANA</div>
            </div>
          </div>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
            <ArrowLeft size={14}/> Volver
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ background: GD, borderRadius: '12px', padding: '10px' }}>
            <BookOpen size={24} style={{ color: O }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: GD, letterSpacing: '0.05em', margin: 0 }}>CRITERIOS DE CONVIVENCIA</h1>
            <p style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.85rem', margin: '2px 0 0' }}>
              Esc. N° 4-012 Ing. Ricardo Videla · Sistema de seguimiento institucional
            </p>
          </div>
        </div>

        {/* ── DIMENSIONES ── */}
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: GD, letterSpacing: '0.06em', marginBottom: '14px', borderLeft: `4px solid ${O}`, paddingLeft: '12px' }}>
            DIMENSIONES DEL SISTEMA
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            {[
              { title: 'CONVIVENCIA',             pts: '40 pts',  color: R,        bg: '#FEE2E2', border: '#FCA5A5', desc: 'Gestión de VIR e ICE' },
              { title: 'HÁBITOS INSTITUCIONALES',  pts: '40 pts',  color: '#064E3B', bg: '#D1FAE5', border: '#6EE7B7', desc: 'Uniforme, asistencia, entorno' },
              { title: 'APORTES A LA CONVIVENCIA', pts: '+20 pts', color: GOLD,      bg: '#FEF3C7', border: '#FCD34D', desc: 'Acciones positivas' },
              { title: 'DESEMPEÑO ACADÉMICO',      pts: '20 pts',  color: '#78350F', bg: '#FEF3C7', border: '#FCD34D', desc: 'Aprobados por período' },
            ].map(({ title, pts, color, bg, border, desc }) => (
              <div key={title} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.72rem', letterSpacing: '0.1em', fontWeight: 700 }}>{title}</div>
                <div style={{ fontFamily: 'var(--font-display)', color, fontSize: '1.7rem', margin: '4px 0', lineHeight: 1 }}>{pts}</div>
                <div style={{ fontFamily: 'var(--font-body)', color, fontSize: '0.75rem', opacity: 0.85 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#E8F5EE', border: '2px solid rgba(45,122,79,0.3)', borderRadius: '10px', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700, fontSize: '0.85rem' }}>
              📊 Base mensual: 80 pts (Convivencia + Hábitos Institucionales) + hasta 20 pts de Aportes a la Convivencia = hasta 100 pts/mes
            </div>
            <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.8rem', marginTop: '3px' }}>
              + 20 pts académicos al cierre de cada período (julio · diciembre)
            </div>
          </div>
        </section>

        {/* ── APORTES A LA CONVIVENCIA ── */}
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: GOLD, letterSpacing: '0.06em', marginBottom: '14px', borderLeft: `4px solid ${GOLD}`, paddingLeft: '12px' }}>
            ⭐ APORTES A LA CONVIVENCIA — CÓMO GANAR PUNTOS
          </h2>
          <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '12px', padding: '18px', marginBottom: '12px' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: '#78350F', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              Los <strong>Aportes a la Convivencia</strong> reconocen a los cursos que participan en acciones institucionales destacadas con puntos extra que se suman al puntaje mensual.
              Permite que cursos puedan <strong>recuperar terreno</strong> en el ranking.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #FCD34D' }}>
            <div style={{ background: GOLD, color: 'white', padding: '10px 16px', fontFamily: 'var(--font-condensed)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              ACCIONES QUE SUMAN PUNTOS
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
          <div style={{ background: 'white', border: '2px solid #FCD34D', borderRadius: '10px', padding: '14px 16px', marginTop: '10px' }}>
            <div style={{ fontFamily: 'var(--font-condensed)', color: GOLD, fontWeight: 700, fontSize: '0.8rem', marginBottom: '10px' }}>ESCALA DE PUNTOS (asignada por el docente)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {[['2','Participación básica'],['4','Buena participación'],['6','Participación destacada'],['8','Impacto institucional'],['10','Impacto excepcional']].map(([pts, label]) => (
                <div key={pts} style={{ textAlign: 'center', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '8px', padding: '10px 4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', color: GOLD, fontSize: '1.5rem', lineHeight: 1 }}>+{pts}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.62rem', marginTop: '4px', lineHeight: 1.3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VIR ── */}
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: R, letterSpacing: '0.06em', marginBottom: '14px', borderLeft: `4px solid ${R}`, paddingLeft: '12px' }}>
            VIR — VARIABLE DE INCIDENCIA Y REPARACIÓN
          </h2>
          <div style={{ background: '#FEE2E2', border: '2px solid #FCA5A5', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: '#7F1D1D', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>
              El VIR es una herramienta de <strong>registro y seguimiento</strong> de situaciones de convivencia.
              Cuando se activa un VIR en un curso, se espera una <strong>reparación</strong> (disculpa, acción concreta o reflexión guiada).
              Los VIR resueltos suman puntos al curso; los no resueltos se escalan.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--green-border)' }}>
            <div style={{ background: GD, color: 'white', padding: '10px 16px', fontFamily: 'var(--font-condensed)', fontSize: '0.82rem', fontWeight: 700 }}>CATEGORÍAS DE SITUACIONES</div>
            {[
              { cat: '🟢 Interacción entre Pares', items: ['Esconder/romper materiales', 'Conflicto verbal', 'Hostigamiento'] },
              { cat: '🟠 Relación con Docente / Preceptor', items: ['Desobediencia', 'Respuesta verbal inadecuada', 'Ignorar consignas'] },
              { cat: '🟣 Cuidado del Entorno', items: ['Desorden', 'Suciedad', 'Deterioro de mobiliario', 'Rayar/pintar'] },
              { cat: '🔵 Relación con la Clase', items: ['Interrupción reiterada', 'Uso indebido del celular', 'Ingreso tardío'] },
            ].map(({ cat, items }, i) => (
              <div key={cat} style={{ padding: '12px 16px', background: i % 2 === 0 ? 'white' : '#F4F7F4', borderTop: i > 0 ? '1px solid rgba(45,122,79,0.12)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>{cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {items.map(item => (
                    <span key={item} style={{ background: '#E8F5EE', color: G, border: '1px solid rgba(45,122,79,0.3)', borderRadius: '20px', padding: '2px 10px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
            {[
              { tipo: 'Disculpa explícita', emoji: '🤝', desc: 'Reconocimiento ante los afectados.' },
              { tipo: 'Acción reparadora', emoji: '🔧', desc: 'Una acción que repara el daño.' },
              { tipo: 'Reflexión guiada', emoji: '💭', desc: 'Proceso reflexivo con un adulto.' },
            ].map(({ tipo, emoji, desc }) => (
              <div key={tipo} style={{ background: 'white', border: '2px solid var(--green-border)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{emoji}</div>
                <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>{tipo}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.78rem', lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RÚBRICA LIMPIEZA ── */}
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: G, letterSpacing: '0.06em', marginBottom: '14px', borderLeft: `4px solid ${G}`, paddingLeft: '12px' }}>
            RÚBRICA: CUIDADO DEL ENTORNO
          </h2>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--green-border)' }}>
            {RUBRICA_LIMPIEZA.map((r, i) => (
              <div key={i} style={{ padding: '12px 16px', background: i % 2 === 0 ? 'white' : '#F4F7F4', borderTop: i > 0 ? '1px solid rgba(45,122,79,0.12)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{r.val}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: GD, fontWeight: 700, fontSize: '0.9rem' }}>{r.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#5A7A5C', fontSize: '0.8rem', marginTop: '2px' }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: '#8A9E87', fontSize: '0.78rem', borderTop: '1px solid var(--green-border)', paddingTop: '20px' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza · 2026
        </div>
      </div>
    </div>
  )
}
