'use client'
import { useState, useEffect, useCallback } from 'react'
import Nav from '@/components/Nav'
import { History, Search, Filter, X, ChevronDown, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { CATEGORIAS_VIR, INTERVINIENTES, MESES } from '@/lib/scoring'

interface VIRRecord {
  id: number
  curso_nombre: string
  categoria_id: string
  tipo_situacion: string
  resuelto: boolean
  tipo_reparacion: string | null
  intervino: string
  nombre_activador: string | null
  mes: number
  anio: number
  created_at: string
}

const now = new Date()

export default function HistorialPage() {
  const [registros, setRegistros] = useState<VIRRecord[]>([])
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const LIMIT = 20

  const [filtros, setFiltros] = useState({
    mes: '',
    anio: String(now.getFullYear()),
    curso_id: '',
    categoria: '',
    resuelto: '',
    intervino: '',
    busqueda: '',
  })
  const [showFiltros, setShowFiltros] = useState(false)

  const G = '#2D7A4F'
  const O = '#E85D04'

  const cargar = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtros.mes) params.set('mes', filtros.mes)
      if (filtros.anio) params.set('anio', filtros.anio)
      if (filtros.curso_id) params.set('curso_id', filtros.curso_id)
      if (filtros.categoria) params.set('categoria', filtros.categoria)
      if (filtros.resuelto !== '') params.set('resuelto', filtros.resuelto)
      if (filtros.intervino) params.set('intervino', filtros.intervino)
      params.set('page', String(p))
      params.set('limit', String(LIMIT))
      const res = await fetch(`/api/var?${params}`)
      const data = await res.json()
      setRegistros(Array.isArray(data) ? data : [])
      setPage(p)
    } catch {}
    setLoading(false)
  }, [filtros])

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
  }, [])

  useEffect(() => {
    cargar(1)
  }, [cargar])

  const limpiarFiltros = () => {
    setFiltros({ mes: '', anio: String(now.getFullYear()), curso_id: '', categoria: '', resuelto: '', intervino: '', busqueda: '' })
  }

  const aplicar = () => { setShowFiltros(false); cargar(1) }

  const registrosFiltrados = filtros.busqueda
    ? registros.filter(r =>
        r.tipo_situacion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        r.curso_nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        r.nombre_activador?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        r.intervino?.toLowerCase().includes(filtros.busqueda.toLowerCase())
      )
    : registros

  const getCategoriaLabel = (id: string) => CATEGORIAS_VIR.find(c => c.id === id)?.label || id || '—'

  const sectionHeader = (text: string, color = G) => (
    <div style={{ background: color, color: 'white', padding: '6px 14px', borderRadius: '6px 6px 0 0', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em', fontSize: '0.78rem', fontWeight: 700 }}>{text}</div>
  )

  const ANIOS = [now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />
      <main className="main-with-sidebar-tall">
        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(232,93,4,0.2)' }}>
              <History size={24} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>
                HISTORIAL VIR
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                Todas las activaciones registradas
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 max-w-3xl">
          {/* Search bar + filter toggle */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar por situación, curso, activador..."
                className="input-videla"
                style={{ paddingLeft: '36px' }}
                value={filtros.busqueda}
                onChange={e => setFiltros(f => ({ ...f, busqueda: e.target.value }))}
              />
            </div>
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              style={{
                background: showFiltros ? G : 'white',
                color: showFiltros ? 'white' : G,
                border: `1.5px solid ${G}`,
                borderRadius: '8px',
                padding: '0 14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-condensed)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}>
              <Filter size={15} /> Filtros
              <ChevronDown size={14} style={{ transform: showFiltros ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>
            <button onClick={() => { cargar(1) }} style={{ background: O, color: 'white', border: 'none', borderRadius: '8px', padding: '0 14px', cursor: 'pointer', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
              Buscar
            </button>
          </div>

          {/* Filtros panel */}
          {showFiltros && (
            <div className="mb-4 slide-in rounded-xl" style={{ border: '1.5px solid var(--green-border)', overflow: 'hidden' }}>
              {sectionHeader('FILTROS DE BÚSQUEDA', O)}
              <div className="p-4 grid grid-cols-2 gap-3" style={{ background: 'var(--bg-alt)' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>AÑO</label>
                  <select className="input-videla" value={filtros.anio} onChange={e => setFiltros(f => ({ ...f, anio: e.target.value }))}>
                    {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>MES</label>
                  <select className="input-videla" value={filtros.mes} onChange={e => setFiltros(f => ({ ...f, mes: e.target.value }))}>
                    <option value="">Todos los meses</option>
                    {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>CURSO</label>
                  <select className="input-videla" value={filtros.curso_id} onChange={e => setFiltros(f => ({ ...f, curso_id: e.target.value }))}>
                    <option value="">Todos los cursos</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>CATEGORÍA</label>
                  <select className="input-videla" value={filtros.categoria} onChange={e => setFiltros(f => ({ ...f, categoria: e.target.value }))}>
                    <option value="">Todas</option>
                    {CATEGORIAS_VIR.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>ESTADO</label>
                  <select className="input-videla" value={filtros.resuelto} onChange={e => setFiltros(f => ({ ...f, resuelto: e.target.value }))}>
                    <option value="">Todos</option>
                    <option value="true">Resuelto</option>
                    <option value="false">No resuelto</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>INTERVINO</label>
                  <select className="input-videla" value={filtros.intervino} onChange={e => setFiltros(f => ({ ...f, intervino: e.target.value }))}>
                    <option value="">Todos</option>
                    {INTERVINIENTES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="col-span-2 flex gap-2 mt-1">
                  <button onClick={aplicar} className="btn-gold flex-1">Aplicar filtros</button>
                  <button onClick={limpiarFiltros} className="btn-outline" style={{ padding: '10px 14px' }}>
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats bar */}
          <div className="flex gap-3 mb-4 text-sm flex-wrap">
            <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>
              {registrosFiltrados.length} registros {filtros.busqueda ? '(filtrado)' : ''}
            </div>
            <div style={{ background: 'rgba(45,122,79,0.08)', border: '1px solid var(--green-border)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'var(--font-condensed)', color: G }}>
              ✓ Resueltos: {registrosFiltrados.filter(r => r.resuelto).length}
            </div>
            <div style={{ background: 'rgba(193,18,31,0.07)', border: '1px solid rgba(193,18,31,0.2)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'var(--font-condensed)', color: '#C1121F' }}>
              ✗ Escalados: {registrosFiltrados.filter(r => !r.resuelto).length}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>CARGANDO HISTORIAL...</div>
            </div>
          )}

          {/* Records */}
          {!loading && registrosFiltrados.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              No se encontraron registros con los filtros aplicados.
            </div>
          )}

          <div className="space-y-3">
            {registrosFiltrados.map(r => {
              const cat = CATEGORIAS_VIR.find(c => c.id === r.categoria_id)
              return (
                <div key={r.id} className="rounded-xl card-hover" style={{ border: '1.5px solid var(--green-border)', overflow: 'hidden', background: 'white' }}>
                  {/* Top stripe */}
                  <div style={{ background: cat?.color || G, height: '4px' }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, color: 'var(--green-dark)', fontSize: '1rem' }}>
                            {r.curso_nombre}
                          </span>
                          <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: '20px' }}>
                            {MESES[r.mes]} {r.anio}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 500 }}>
                          {r.tipo_situacion}
                        </div>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: cat?.color || G, fontSize: '0.78rem', marginTop: '3px' }}>
                          {cat?.label || r.categoria_id || '—'}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: r.resuelto ? 'rgba(45,122,79,0.1)' : 'rgba(193,18,31,0.08)',
                        color: r.resuelto ? G : '#C1121F',
                        border: `1px solid ${r.resuelto ? 'rgba(45,122,79,0.3)' : 'rgba(193,18,31,0.25)'}`,
                        borderRadius: '20px', padding: '3px 10px',
                        fontFamily: 'var(--font-condensed)', fontSize: '0.75rem', fontWeight: 700,
                        whiteSpace: 'nowrap' as const,
                      }}>
                        {r.resuelto
                          ? <><CheckCircle size={12} /> Resuelto</>
                          : <><XCircle size={12} /> No</>
                        }
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2" style={{ borderTop: '1px solid var(--green-light)', paddingTop: '8px' }}>
                      {r.tipo_reparacion && (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Reparación:</span> {r.tipo_reparacion}
                        </span>
                      )}
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Intervino:</span> {r.intervino}
                      </span>
                      {r.nombre_activador && (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Activador:</span> {r.nombre_activador}
                        </span>
                      )}
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        #{r.id} · {new Date(r.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {registrosFiltrados.length >= LIMIT && (
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => cargar(page - 1)} disabled={page <= 1} className="btn-outline" style={{ padding: '8px 16px' }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontFamily: 'var(--font-condensed)', padding: '8px 16px', color: 'var(--text-secondary)' }}>
                Página {page}
              </span>
              <button onClick={() => cargar(page + 1)} disabled={registrosFiltrados.length < LIMIT} className="btn-outline" style={{ padding: '8px 16px' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
