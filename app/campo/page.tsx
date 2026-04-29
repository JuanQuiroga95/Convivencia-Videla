'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Nav from '@/components/Nav'
import { Star, CheckCircle, AlertCircle, ChevronRight, Trash2, Trophy, Upload, X } from 'lucide-react'
import { TIPOS_ACCION_CAMPO, PUNTOS_CAMPO_OPCIONES, MESES } from '@/lib/scoring'

interface CampoRecord {
  id: number; curso_nombre: string; tipo_accion: string; descripcion: string
  evidencia_url: string | null; puntos: number; fecha: string; nombre_docente: string; mes: number; anio: number
}

const G = '#2D7A4F'; const O = '#E85D04'; const GOLD = '#B45309'
const now = new Date()

export default function CampoPage() {
  const [cursos, setCursos] = useState<{id: number, nombre: string}[]>([])
  const [tab, setTab] = useState<'registrar' | 'historial'>('registrar')
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    curso_id: '', tipo_accion: '', descripcion: '',
    puntos: 5, fecha: now.toISOString().split('T')[0], nombre_docente: '',
  })
  const [archivoNombre, setArchivoNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok: boolean; message?: string; error?: string} | null>(null)
  const [step, setStep] = useState(1)
  // Local state for description to avoid re-render lag on mobile
  const [descLocal, setDescLocal] = useState('')

  const [registros, setRegistros] = useState<CampoRecord[]>([])
  const [loadingHist, setLoadingHist] = useState(false)
  const [filtroMes, setFiltroMes] = useState(String(now.getMonth() + 1))
  const [filtroAnio] = useState(String(now.getFullYear()))

  useEffect(() => {
    fetch('/api/cursos').then(r => r.json()).then(setCursos)
  }, [])

  useEffect(() => {
    if (tab === 'historial') cargarHistorial()
  }, [tab, filtroMes])

  const cargarHistorial = async () => {
    setLoadingHist(true)
    try {
      const res = await fetch(`/api/campo?mes=${filtroMes}&anio=${filtroAnio}`)
      setRegistros(await res.json())
    } catch {}
    setLoadingHist(false)
  }

  const handleSubmit = async () => {
    const formToSend = { ...form, descripcion: descLocal }
    setLoading(true)
    try {
      const res = await fetch('/api/campo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formToSend,
          curso_id: parseInt(formToSend.curso_id),
          evidencia_url: archivoNombre || null,
          evidencia_tipo: archivoNombre ? 'archivo' : null,
        }),
      })
      const data = await res.json()
      setResult(data)
      if (data.ok) {
        setForm({ curso_id: '', tipo_accion: '', descripcion: '', puntos: 5, fecha: now.toISOString().split('T')[0], nombre_docente: '' })
        setDescLocal('')
        setArchivoNombre('')
        setStep(1)
      }
    } catch { setResult({ ok: false, error: 'Error de conexión' }) }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta acción?')) return
    await fetch(`/api/campo?id=${id}`, { method: 'DELETE' })
    cargarHistorial()
  }

  const canStep1 = form.curso_id && form.tipo_accion && form.fecha
  // descripcion solo necesita algo de texto, sin mínimo estricto
  const canStep2 = descLocal.trim().length >= 3
  const canSubmit = form.nombre_docente.trim().length >= 3 && Number(form.puntos) >= 1

  const SH = ({ text, color = G }: { text: string; color?: string }) => (
    <div style={{ background: color, color: 'white', padding: '10px 16px', borderRadius: '10px 10px 0 0', fontFamily: 'var(--font-condensed)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em' }}>{text}</div>
  )
  const SB = ({ children, bc }: any) => (
    <div style={{ border: `2px solid ${bc || 'var(--green-border)'}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px', background: 'white' }}>{children}</div>
  )
  const Lbl = ({ text, color = '#1A4D2E' }: any) => (
    <label style={{ fontFamily: 'var(--font-condensed)', color, fontSize: '0.78rem', display: 'block', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.08em' }}>{text}</label>
  )

  return (
    <div style={{ background: '#F4F7F4', minHeight: '100vh' }}>
      <Nav />
      <main className="main-content-tall">

        {/* Header */}
        <div className="px-6 py-6" style={{ background: 'var(--green-dark)', borderBottom: '3px solid var(--orange)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(180,83,9,0.3)', border: '1px solid rgba(180,83,9,0.5)' }}>
              <Trophy size={24} style={{ color: '#FCD34D' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>APORTES A LA CONVIVENCIA</h1>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>Acciones destacadas · Reconocimiento institucional</p>
            </div>
          </div>
          <div style={{ background: 'rgba(180,83,9,0.25)', border: '1px solid rgba(252,211,77,0.4)', borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Star size={15} style={{ color: '#FCD34D', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-condensed)', color: '#FEF3C7', fontSize: '0.82rem', lineHeight: 1.4 }}>
              Los cursos pueden <strong>ganar hasta 20 puntos por mes</strong>. El docente asigna el valor (1–10 pts).
            </span>
          </div>
          <div className="flex gap-2">
            {[{ id: 'registrar', label: '⭐ Registrar Acción' }, { id: 'historial', label: '📋 Historial' }].map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id as any)} style={{ background: tab === id ? 'white' : 'transparent', color: tab === id ? GOLD : 'rgba(255,255,255,0.6)', border: `1.5px solid ${tab === id ? 'white' : 'rgba(255,255,255,0.25)'}`, borderRadius: '8px', padding: '7px 18px', cursor: 'pointer', fontFamily: 'var(--font-condensed)', fontSize: '0.88rem', fontWeight: 700, transition: 'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── REGISTRAR ── */}
        {tab === 'registrar' && (
          <div className="px-6 py-6 max-w-lg">
            {/* Stepper */}
            <div className="flex items-center gap-2 mb-6">
              {[1,2,3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= s ? GOLD : '#E5E7EB', color: step >= s ? 'white' : '#9CA3AF', fontFamily: 'var(--font-display)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{s}</div>
                  {s < 3 && <div style={{ width: '32px', height: '3px', borderRadius: '2px', background: step > s ? GOLD : '#E5E7EB' }} />}
                </div>
              ))}
              <span style={{ fontFamily: 'var(--font-condensed)', color: '#5A7A5C', fontSize: '0.8rem', marginLeft: '8px' }}>
                {step === 1 ? 'Identificación' : step === 2 ? 'Descripción' : 'Valoración'}
              </span>
            </div>

            {result?.ok && (
              <div className="mb-5 p-4 rounded-xl flex items-center gap-3 slide-in" style={{ background: '#D1FAE5', border: '2px solid #6EE7B7' }}>
                <CheckCircle size={20} style={{ color: G }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: G, fontWeight: 700 }}>¡Acción registrada! +{form.puntos} pts</div>
                  <button onClick={() => setResult(null)} style={{ fontFamily: 'var(--font-body)', color: '#4A6741', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Registrar otra →</button>
                </div>
              </div>
            )}
            {result && !result.ok && (
              <div className="mb-5 p-4 rounded-xl flex items-center gap-3" style={{ background: '#FEE2E2', border: '2px solid #FCA5A5' }}>
                <AlertCircle size={20} style={{ color: '#C1121F' }} />
                <span style={{ fontFamily: 'var(--font-body)', color: '#991B1B', fontSize: '0.9rem' }}>{result.error}</span>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 slide-in">
                <div>
                  <SH text="CURSO Y FECHA" color={O} />
                  <SB bc="rgba(232,93,4,0.3)">
                    <div className="space-y-3">
                      <div>
                        <Lbl text="CURSO" color="#7C2D12" />
                        <select className="input-videla" value={form.curso_id} onChange={e => setForm(f => ({ ...f, curso_id: e.target.value }))}>
                          <option value="">Seleccionar curso...</option>
                          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <Lbl text="FECHA DE LA ACCIÓN" color="#7C2D12" />
                        <input type="date" className="input-videla" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
                      </div>
                    </div>
                  </SB>
                </div>

                <div>
                  <SH text="TIPO DE ACCIÓN" color={GOLD} />
                  <SB bc="#FCD34D">
                    <div className="space-y-2">
                      {TIPOS_ACCION_CAMPO.map(tipo => (
                        <label key={tipo} className="flex items-start gap-3 p-3 rounded-lg cursor-pointer"
                          style={{ background: form.tipo_accion === tipo ? '#FEF3C7' : '#F9FAFB', border: `2px solid ${form.tipo_accion === tipo ? GOLD : '#E5E7EB'}` }}>
                          <input type="radio" name="tipo_accion" value={tipo} checked={form.tipo_accion === tipo}
                            onChange={e => setForm(f => ({ ...f, tipo_accion: e.target.value }))}
                            style={{ accentColor: GOLD, marginTop: '3px', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: form.tipo_accion === tipo ? '#78350F' : '#374151', fontWeight: form.tipo_accion === tipo ? 600 : 400 }}>{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </SB>
                </div>

                <button onClick={() => setStep(2)} disabled={!canStep1} className="btn-gold w-full flex items-center justify-center gap-2">
                  Continuar <ChevronRight size={16}/>
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4 slide-in">
                {/* Resumen */}
                <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.75rem', letterSpacing: '0.08em' }}>ACCIÓN SELECCIONADA</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#78350F', fontWeight: 600, marginTop: '2px' }}>{form.tipo_accion}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: GOLD, fontSize: '0.82rem' }}>
                    {cursos.find(c => String(c.id) === form.curso_id)?.nombre} · {new Date(form.fecha + 'T12:00:00').toLocaleDateString('es-AR')}
                  </div>
                </div>

                {/* Descripción — textarea simple sin validación estricta para móvil */}
                <div>
                  <SH text="DESCRIPCIÓN DE LA ACCIÓN" color={G} />
                  <SB>
                    <Lbl text="BREVE DESCRIPCIÓN" />
                    {/* Input normal en lugar de textarea para evitar problemas en móvil */}
                    <input
                      type="text"
                      className="input-videla"
                      placeholder="Describí brevemente qué hizo el curso..."
                      value={descLocal}
                      onChange={e => setDescLocal(e.target.value)}
                      style={{ fontSize: '16px' /* evita zoom en iOS */ }}
                    />
                  </SB>
                </div>

                {/* Evidencia — completamente opcional, por archivo */}
                <div>
                  <SH text="EVIDENCIA — OPCIONAL" color="#1D4ED8" />
                  <SB bc="rgba(29,78,216,0.25)">
                    <div style={{ fontFamily: 'var(--font-body)', color: '#1E3A5F', fontSize: '0.82rem', marginBottom: '12px', lineHeight: 1.5 }}>
                      Podés adjuntar una foto, imagen o archivo desde tu dispositivo. <strong>No es obligatorio.</strong>
                    </div>

                    {/* Input file oculto */}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        setArchivoNombre(file ? file.name : '')
                      }}
                    />

                    {archivoNombre ? (
                      <div style={{ background: '#EFF6FF', border: '2px solid #93C5FD', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Upload size={16} style={{ color: '#1D4ED8', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-body)', color: '#1E3A5F', fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{archivoNombre}</span>
                        <button type="button" onClick={() => { setArchivoNombre(''); if (fileRef.current) fileRef.current.value = '' }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C1121F', flexShrink: 0 }}>
                          <X size={16}/>
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileRef.current?.click()}
                        style={{ width: '100%', padding: '12px', border: '2px dashed #93C5FD', borderRadius: '8px', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-condensed)', color: '#1D4ED8', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Upload size={18}/> Seleccionar archivo (opcional)
                      </button>
                    )}
                    <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.73rem', marginTop: '6px' }}>
                      Formatos: imagen, PDF, Word · Podés omitir este paso sin problema.
                    </div>
                  </SB>
                </div>

                <button onClick={() => { setForm(f => ({ ...f, descripcion: descLocal })); setStep(3) }} disabled={!canStep2} className="btn-gold w-full flex items-center justify-center gap-2">
                  Continuar <ChevronRight size={16}/>
                </button>
                <button onClick={() => setStep(1)} className="btn-outline w-full">Atrás</button>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 slide-in">
                <div>
                  <SH text="VALORACIÓN DEL DOCENTE" color={GOLD} />
                  <SB bc="#FCD34D">
                    <div className="space-y-4">
                      {/* Puntos */}
                      <div>
                        <Lbl text="PUNTOS A OTORGAR (1–10) — ASIGNADOS POR EL DOCENTE" color={GOLD} />
                        <div className="flex gap-2 flex-wrap mb-2">
                          {PUNTOS_CAMPO_OPCIONES.map(p => (
                            <button key={p} type="button" onClick={() => setForm(f => ({ ...f, puntos: p }))}
                              style={{ width: '46px', height: '46px', borderRadius: '10px', background: form.puntos === p ? GOLD : '#FEF3C7', color: form.puntos === p ? 'white' : GOLD, border: `2px solid ${form.puntos === p ? GOLD : '#FCD34D'}`, fontFamily: 'var(--font-display)', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                              {p}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.78rem' }}>Valor personalizado:</span>
                          <input type="number" min={1} max={10} value={form.puntos}
                            onChange={e => setForm(f => ({ ...f, puntos: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) }))}
                            style={{ width: '64px', height: '40px', borderRadius: '8px', border: `2px solid ${GOLD}`, fontFamily: 'var(--font-display)', fontSize: '1.2rem', textAlign: 'center', color: GOLD, fontWeight: 700, fontSize: '16px' }} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#92400E', fontSize: '0.76rem', marginTop: '6px' }}>
                          ⚠ El docente es responsable de asignar un valor justo. Máx. 10 pts por acción.
                        </div>
                      </div>

                      {/* Nombre docente */}
                      <div>
                        <Lbl text="NOMBRE Y APELLIDO DEL DOCENTE *" color={GOLD} />
                        <input type="text" className="input-videla"
                          placeholder="Ej: María González"
                          value={form.nombre_docente}
                          onChange={e => setForm(f => ({ ...f, nombre_docente: e.target.value }))}
                          style={{ fontSize: '16px' }} />
                      </div>
                    </div>
                  </SB>
                </div>

                {/* Resumen */}
                <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: GOLD, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '10px' }}>RESUMEN</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px' }}>
                    {[
                      ['Curso',    cursos.find(c => String(c.id) === form.curso_id)?.nombre],
                      ['Acción',   form.tipo_accion],
                      ['Fecha',    new Date(form.fecha + 'T12:00:00').toLocaleDateString('es-AR')],
                      ['Puntos',   `+${form.puntos} pts`],
                      ['Docente',  form.nombre_docente],
                      archivoNombre ? ['Archivo', archivoNombre] : null,
                    ].filter(Boolean).map(([k, v]) => (
                      <>
                        <span key={`k-${k}`} style={{ color: '#92400E', fontFamily: 'var(--font-condensed)', fontSize: '0.75rem' }}>{k}</span>
                        <span key={`v-${k}`} style={{ color: '#78350F', fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                      </>
                    ))}
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gold w-full" style={{ fontSize: '1.05rem', padding: '13px' }}>
                  {loading ? 'Registrando...' : `REGISTRAR ACCIÓN (+${form.puntos} pts)`}
                </button>
                <button onClick={() => setStep(2)} className="btn-outline w-full">Atrás</button>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORIAL ── */}
        {tab === 'historial' && (
          <div className="px-6 py-6 max-w-2xl">
            <div className="flex gap-3 mb-4 flex-wrap items-center">
              <select className="input-videla" style={{ width: 'auto' }} value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
                {MESES.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m} {filtroAnio}</option>)}
              </select>
              <button onClick={cargarHistorial} className="btn-outline" style={{ padding: '8px 16px' }}>Actualizar</button>
              {registros.length > 0 && (
                <>
                  <span style={{ fontFamily: 'var(--font-condensed)', color: G, fontSize: '0.82rem', fontWeight: 700, background: '#D1FAE5', border: '1.5px solid #6EE7B7', borderRadius: '8px', padding: '5px 12px' }}>{registros.length} acciones</span>
                  <span style={{ fontFamily: 'var(--font-condensed)', color: GOLD, fontSize: '0.82rem', fontWeight: 700, background: '#FEF3C7', border: '1.5px solid #FCD34D', borderRadius: '8px', padding: '5px 12px' }}>+{registros.reduce((s, r) => s + r.puntos, 0)} pts totales</span>
                </>
              )}
            </div>

            {loadingHist && <div style={{ textAlign: 'center', padding: '48px', color: '#5A7A5C', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>CARGANDO...</div>}
            {!loadingHist && registros.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#8A9E87', fontFamily: 'var(--font-body)' }}>No hay acciones en {MESES[parseInt(filtroMes)]} {filtroAnio}.</div>
            )}

            <div className="space-y-3">
              {registros.map(r => (
                <div key={r.id} style={{ background: 'white', border: '2px solid #FCD34D', borderRadius: '12px', overflow: 'hidden' }} className="card-hover">
                  <div style={{ background: GOLD, height: '4px' }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--green-dark)', letterSpacing: '0.04em' }}>{r.curso_nombre}</span>
                          <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.73rem', color: '#5A7A5C', background: '#F4F7F4', padding: '2px 8px', borderRadius: '20px' }}>{new Date(r.fecha).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-condensed)', color: '#78350F', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>{r.tipo_accion}</div>
                        <div style={{ fontFamily: 'var(--font-body)', color: '#374151', fontSize: '0.85rem', lineHeight: 1.5 }}>{r.descripcion}</div>
                        {r.evidencia_url && (
                          <div style={{ fontFamily: 'var(--font-condensed)', color: '#1D4ED8', fontSize: '0.78rem', marginTop: '4px' }}>📎 {r.evidencia_url}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: GOLD, lineHeight: 1 }}>+{r.puntos}</div>
                          <div style={{ fontFamily: 'var(--font-condensed)', color: '#92400E', fontSize: '0.62rem' }}>PUNTOS</div>
                        </div>
                        <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: '1.5px solid #FCA5A5', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#C1121F' }}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#8A9E87', fontSize: '0.75rem', marginTop: '8px', borderTop: '1px solid #F4F7F4', paddingTop: '8px' }}>
                      Registrado por: <span style={{ fontWeight: 600, color: '#5A7A5C' }}>{r.nombre_docente}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
