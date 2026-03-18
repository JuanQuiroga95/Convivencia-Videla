'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Settings, Database, CheckCircle, AlertCircle, Users, Plus, Trash2, Edit2, X } from 'lucide-react'
import { MESES } from '@/lib/scoring'

interface Usuario { id: number; nombre: string; usuario: string; rol: string; activo: boolean }

export default function AdminPage() {
  const [tab, setTab] = useState<'usuarios' | 'setup' | 'var' | 'indicadores'>('usuarios')
  const [setupStatus, setSetupStatus] = useState<any>(null)
  const [setupLoading, setSetupLoading] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [varList, setVarList] = useState<any[]>([])
  const [indList, setIndList] = useState<any[]>([])
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<Usuario | null>(null)
  const [nuevoUser, setNuevoUser] = useState({ nombre: '', usuario: '', password: '', rol: 'operativo' })
  const [userMsg, setUserMsg] = useState<{ ok: boolean; msg: string } | null>(null)

  const loadUsuarios = () => fetch('/api/usuarios').then(r => r.json()).then(setUsuarios)
  const loadVar = () => fetch(`/api/var?mes=${mes}&anio=${new Date().getFullYear()}`).then(r => r.json()).then(d => setVarList(Array.isArray(d) ? d : []))
  const loadInd = () => fetch(`/api/indicadores?mes=${mes}&anio=${new Date().getFullYear()}`).then(r => r.json()).then(d => setIndList(Array.isArray(d) ? d : []))

  useEffect(() => {
    if (tab === 'usuarios') loadUsuarios()
    if (tab === 'var') loadVar()
    if (tab === 'indicadores') loadInd()
  }, [tab, mes])

  const handleSetup = async () => {
    setSetupLoading(true)
    const res = await fetch('/api/setup')
    setSetupStatus(await res.json())
    setSetupLoading(false)
  }

  const handleCrearUsuario = async () => {
    if (!nuevoUser.nombre || !nuevoUser.usuario || !nuevoUser.password) {
      setUserMsg({ ok: false, msg: 'Completá todos los campos' }); return
    }
    const res = await fetch('/api/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoUser) })
    const data = await res.json()
    setUserMsg({ ok: data.ok, msg: data.ok ? 'Usuario creado correctamente' : data.error })
    if (data.ok) { setNuevoUser({ nombre: '', usuario: '', password: '', rol: 'operativo' }); setShowForm(false); loadUsuarios() }
  }

  const handleEditarUsuario = async () => {
    if (!editUser) return
    const res = await fetch('/api/usuarios', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editUser) })
    const data = await res.json()
    setUserMsg({ ok: data.ok, msg: data.ok ? 'Usuario actualizado' : data.error })
    if (data.ok) { setEditUser(null); loadUsuarios() }
  }

  const handleToggleActivo = async (u: Usuario) => {
    await fetch('/api/usuarios', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...u, activo: !u.activo }) })
    loadUsuarios()
  }

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que querés eliminar este usuario?')) return
    await fetch('/api/usuarios', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadUsuarios()
  }

  const tabs = [
    { key: 'usuarios', label: 'Usuarios', icon: Users },
    { key: 'setup', label: 'Base de datos', icon: Database },
    { key: 'var', label: 'Registros VAR', icon: Settings },
    { key: 'indicadores', label: 'Indicadores', icon: Settings },
  ]

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>
      <Nav />
      <main className="md:ml-56 pb-24 md:pb-8">
        <div className="px-6 py-8" style={{ background: 'linear-gradient(135deg, #0a0a14, #141428, #0a0a14)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Settings size={24} style={{ color: '#9CA3AF' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'white' }}>ADMINISTRACIÓN</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key as any)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ fontFamily: 'var(--font-condensed)', cursor: 'pointer', background: tab === key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${tab === key ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`, color: tab === key ? 'white' : '#6B7280' }}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 max-w-2xl">

          {/* USUARIOS TAB */}
          {tab === 'usuarios' && (
            <div className="space-y-4">
              {userMsg && (
                <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: userMsg.ok ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)', border: `1px solid ${userMsg.ok ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.3)'}` }}>
                  {userMsg.ok ? <CheckCircle size={16} style={{ color: '#6EE7B7' }} /> : <AlertCircle size={16} style={{ color: '#FCA5A5' }} />}
                  <span style={{ fontFamily: 'var(--font-condensed)', color: userMsg.ok ? '#6EE7B7' : '#FCA5A5', fontSize: '0.9rem' }}>{userMsg.msg}</span>
                  <button onClick={() => setUserMsg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={14} /></button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  {usuarios.length} USUARIOS REGISTRADOS
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditUser(null) }} className="btn-gold flex items-center gap-2" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={14} /> Nuevo usuario
                </button>
              </div>

              {/* Formulario nuevo usuario */}
              {showForm && (
                <div className="rounded-xl p-5 space-y-3 slide-in" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '4px' }}>NUEVO USUARIO</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>NOMBRE COMPLETO</label>
                      <input type="text" className="input-videla" placeholder="ej: María González" value={nuevoUser.nombre} onChange={e => setNuevoUser(f => ({ ...f, nombre: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>USUARIO</label>
                      <input type="text" className="input-videla" placeholder="ej: mgonzalez" value={nuevoUser.usuario} onChange={e => setNuevoUser(f => ({ ...f, usuario: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>CONTRASEÑA</label>
                      <input type="text" className="input-videla" placeholder="Contraseña inicial" value={nuevoUser.password} onChange={e => setNuevoUser(f => ({ ...f, password: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>ROL</label>
                      <select className="input-videla" value={nuevoUser.rol} onChange={e => setNuevoUser(f => ({ ...f, rol: e.target.value }))}>
                        <option value="operativo">Operativo (docente/preceptor)</option>
                        <option value="admin">Admin (directivo/informático)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleCrearUsuario} className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Crear</button>
                    <button onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Lista usuarios */}
              <div className="space-y-2">
                {usuarios.map(u => (
                  <div key={u.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${u.activo ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`, opacity: u.activo ? 1 : 0.5 }}>
                    {editUser?.id === u.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>NOMBRE</label>
                            <input type="text" className="input-videla" value={editUser.nombre} onChange={e => setEditUser({ ...editUser, nombre: e.target.value })} />
                          </div>
                          <div>
                            <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>USUARIO</label>
                            <input type="text" className="input-videla" value={editUser.usuario} onChange={e => setEditUser({ ...editUser, usuario: e.target.value })} />
                          </div>
                          <div>
                            <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>ROL</label>
                            <select className="input-videla" value={editUser.rol} onChange={e => setEditUser({ ...editUser, rol: e.target.value })}>
                              <option value="operativo">Operativo</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleEditarUsuario} className="btn-gold" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Guardar</button>
                          <button onClick={() => setEditUser(null)} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div style={{ fontFamily: 'var(--font-condensed)', color: 'white', fontSize: '0.95rem' }}>{u.nombre}</div>
                          <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.8rem' }}>
                            @{u.usuario} ·{' '}
                            <span style={{ color: u.rol === 'admin' ? '#FCD34D' : '#93C5FD' }}>
                              {u.rol === 'admin' ? 'Admin' : 'Operativo'}
                            </span>
                            {!u.activo && <span style={{ color: '#374151', marginLeft: '6px' }}>· Inactivo</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleActivo(u)} title={u.activo ? 'Desactivar' : 'Activar'}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: u.activo ? '#6EE7B7' : '#374151' }}>
                            {u.activo ? '✓' : '○'}
                          </button>
                          <button onClick={() => setEditUser(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#6B7280' }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleEliminar(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#374151' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {usuarios.length === 0 && (
                  <div className="text-center py-8" style={{ color: '#374151', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                    No hay usuarios creados aún
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#93C5FD', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '6px' }}>CÓMO FUNCIONA</div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <strong style={{ color: '#FCD34D' }}>Admin:</strong> accede a todo (directivos e informático).<br />
                  <strong style={{ color: '#93C5FD' }}>Operativo:</strong> puede cargar VAR e Indicadores (docentes y preceptores).<br />
                  Los QR de las aulas llevan a la pantalla de login. Los operativos ingresan con su usuario y contraseña y cargan directamente.
                </div>
              </div>
            </div>
          )}

          {/* SETUP TAB */}
          {tab === 'setup' && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-5">
                <div style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', letterSpacing: '0.05em', marginBottom: '8px' }}>CONFIGURAR BASE DE DATOS</div>
                <p style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>
                  Ejecutar si es la primera vez o para crear la tabla de usuarios.
                </p>
                {setupStatus?.ok && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)' }}>
                    <CheckCircle size={16} style={{ color: '#6EE7B7' }} />
                    <span style={{ fontFamily: 'var(--font-condensed)', color: '#6EE7B7' }}>{setupStatus.message}</span>
                  </div>
                )}
                {setupStatus && !setupStatus.ok && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
                    <AlertCircle size={16} style={{ color: '#FCA5A5' }} />
                    <span style={{ fontFamily: 'var(--font-body)', color: '#FCA5A5', fontSize: '0.85rem' }}>{setupStatus.error}</span>
                  </div>
                )}
                <button onClick={handleSetup} disabled={setupLoading} className="btn-gold flex items-center gap-2">
                  <Database size={16} />
                  {setupLoading ? 'Configurando...' : 'Inicializar base de datos'}
                </button>
              </div>
            </div>
          )}

          {/* VAR LIST TAB */}
          {tab === 'var' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select value={mes} onChange={e => setMes(parseInt(e.target.value))} className="input-videla" style={{ width: 'auto' }}>
                  {MESES.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
                <span style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', fontSize: '0.85rem' }}>{varList.length} registros</span>
              </div>
              {varList.length === 0 ? (
                <div className="text-center py-10" style={{ color: '#374151', fontFamily: 'var(--font-body)' }}>No hay registros VAR para {MESES[mes]}</div>
              ) : (
                <div className="space-y-2">
                  {varList.map((v: any) => (
                    <div key={v.id} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span style={{ fontFamily: 'var(--font-display)', color: '#C9A84C', fontSize: '1.1rem' }}>{v.curso_nombre}</span>
                          <span className="ml-3 px-2 py-0.5 rounded text-xs" style={{ fontFamily: 'var(--font-condensed)', background: v.resuelto ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)', color: v.resuelto ? '#6EE7B7' : '#FCA5A5' }}>
                            {v.resuelto ? 'RESUELTO' : 'SIN RESOLVER'}
                          </span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.8rem' }}>
                          {new Date(v.created_at).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', color: '#9CA3AF', fontSize: '0.85rem', marginTop: '4px' }}>
                        {v.tipo_situacion} · {v.intervino}{v.tipo_reparacion && ` · ${v.tipo_reparacion}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INDICADORES TAB */}
          {tab === 'indicadores' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select value={mes} onChange={e => setMes(parseInt(e.target.value))} className="input-videla" style={{ width: 'auto' }}>
                  {MESES.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
                <span style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', fontSize: '0.85rem' }}>{indList.length} cursos cargados</span>
              </div>
              {indList.length === 0 ? (
                <div className="text-center py-10" style={{ color: '#374151', fontFamily: 'var(--font-body)' }}>No hay indicadores para {MESES[mes]}</div>
              ) : (
                <div className="glass rounded-xl overflow-x-auto">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-condensed)', fontSize: '0.8rem', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {['Curso', 'Limpieza', 'Uniforme', 'Puntual%', 'Asist%', 'Actas', 'ICE', 'Aprob%'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', color: '#6B7280', textAlign: 'center' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {indList.map((ind: any) => (
                        <tr key={ind.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '8px 10px', color: '#C9A84C', fontWeight: 600 }}>{ind.curso_nombre}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#D1D5DB' }}>{'⭐'.repeat(ind.limpieza || 0)}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#D1D5DB' }}>{ind.uniforme || '-'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#D1D5DB' }}>{ind.puntualidad || '-'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#D1D5DB' }}>{ind.asistencia || '-'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: ind.actas > 0 ? '#FCA5A5' : '#6EE7B7' }}>{ind.actas}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: ind.ice_puntos > 0 ? '#FCA5A5' : '#6EE7B7' }}>{ind.ice_puntos}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#FCD34D' }}>{ind.pct_aprobados || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
