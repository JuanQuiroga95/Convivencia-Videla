'use client'

import { useState, useEffect, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileText, AlertTriangle, CheckCircle, Clock, Download, Plus } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface VIR {
  id: number
  curso_nombre: string
  estudiantes_involucrados: string
  tipo_situacion: string
  estado: string
  resuelto: boolean
  created_at: string
  intervino: string
}

interface Resolucion {
  id_resolucion: number
  id_vir: number
  fecha_resolucion: string
  tipo_accion: string
  puntos_descontados: number
  observaciones: string
  autor_registro: string
}

export default function HistorialVirClient({ role }: { role: 'admin' | 'preceptora' }) {
  const [virs, setVirs] = useState<VIR[]>([])
  const [resoluciones, setResoluciones] = useState<Resolucion[]>([])
  const [tab, setTab] = useState<'pendientes' | 'escalados'>('pendientes')
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedVir, setSelectedVir] = useState<VIR | null>(null)
  const [tipoAccion, setTipoAccion] = useState('Quita de puntos')
  const [puntos, setPuntos] = useState<number>(0)
  const [observaciones, setObservaciones] = useState('')

  const dashboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const resVirs = await fetch('/api/var')
      const dataVirs = await resVirs.json()
      setVirs(dataVirs)
      
      if (role === 'admin') {
        const resRes = await fetch('/api/resoluciones-consejo')
        const dataRes = await resRes.json()
        setResoluciones(dataRes)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleEscalar = async (id: number) => {
    if (!confirm('¿Estás seguro de derivar este caso al Consejo Escolar?')) return
    
    try {
      const res = await fetch(`/api/var/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Escalado_Consejo' })
      })
      if (res.ok) {
        fetchData()
      } else {
        alert('Error al escalar')
      }
    } catch (e) {
      alert('Error de conexión')
    }
  }

  const handleGuardarResolucion = async () => {
    if (!selectedVir) return
    try {
      const res = await fetch('/api/resoluciones-consejo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_vir: selectedVir.id,
          tipo_accion: tipoAccion,
          puntos_descontados: puntos,
          observaciones
        })
      })
      if (res.ok) {
        setShowModal(false)
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (e) {
      alert('Error de conexión')
    }
  }

  const exportPDF = async () => {
    if (!dashboardRef.current) return
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('informe_consejo.pdf')
  }

  const virsPendientesResueltos = virs.filter(v => v.estado === 'Pendiente' || v.estado === 'Resuelto')
  const virsEscalados = virs.filter(v => v.estado === 'Escalado_Consejo' || resoluciones.some(r => r.id_vir === v.id))

  // Dashboard Stats
  const escaladosMes = virsEscalados.length
  const resueltosConsejo = resoluciones.length
  const pendientesConsejo = escaladosMes - resueltosConsejo
  const puntosTotales = resoluciones.reduce((acc, r) => acc + (r.puntos_descontados || 0), 0)

  // Charts Data
  const cursosData = Object.values(virsEscalados.reduce((acc, v) => {
    acc[v.curso_nombre] = acc[v.curso_nombre] || { name: v.curso_nombre, cantidad: 0 }
    acc[v.curso_nombre].cantidad += 1
    return acc
  }, {} as any)).sort((a: any, b: any) => b.cantidad - a.cantidad).slice(0, 5)

  const accionesData = Object.values(resoluciones.reduce((acc, r) => {
    acc[r.tipo_accion] = acc[r.tipo_accion] || { name: r.tipo_accion, value: 0 }
    acc[r.tipo_accion].value += 1
    return acc
  }, {} as any))

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1']

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Historial VIR y Consejo Escolar</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setTab('pendientes')}
          className={`py-2 px-4 ${tab === 'pendientes' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}
        >
          VIR Generales
        </button>
        <button
          onClick={() => setTab('escalados')}
          className={`py-2 px-4 ${tab === 'escalados' ? 'border-b-2 border-red-600 text-red-600 font-bold' : 'text-gray-500'}`}
        >
          Casos Escalados (Consejo)
        </button>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : tab === 'pendientes' ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante(s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {virsPendientesResueltos.map(vir => (
                <tr key={vir.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(vir.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vir.curso_nombre}</td>
                  <td className="px-6 py-4">{vir.estudiantes_involucrados}</td>
                  <td className="px-6 py-4">{vir.tipo_situacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vir.estado === 'Resuelto' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {vir.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vir.estado === 'Pendiente' && role === 'preceptora' && (
                      <button onClick={() => handleEscalar(vir.id)} className="text-red-600 hover:text-red-900 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" /> Derivar al Consejo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={dashboardRef} className="space-y-6 bg-gray-50 p-6 rounded-lg">
          {role === 'admin' && (
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Panel de Control: Consejo Escolar</h2>
              <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center">
                <Download className="w-4 h-4 mr-2" /> Exportar Informe PDF
              </button>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="text-gray-500 text-sm font-bold uppercase">Total Escalados</div>
              <div className="text-3xl font-bold text-gray-800">{escaladosMes}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <div className="text-gray-500 text-sm font-bold uppercase">Casos Resueltos</div>
              <div className="text-3xl font-bold text-gray-800">{resueltosConsejo}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="text-gray-500 text-sm font-bold uppercase">Casos Pendientes</div>
              <div className="text-3xl font-bold text-gray-800">{pendientesConsejo}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <div className="text-gray-500 text-sm font-bold uppercase">Puntos Descontados</div>
              <div className="text-3xl font-bold text-gray-800">{puntosTotales} pts</div>
            </div>
          </div>

          {/* Charts */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4 text-center">Top 5 Cursos con Derivaciones</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cursosData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4 text-center">Distribución de Medidas</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={accionesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {accionesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* List of Escalated Cases */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-lg font-bold p-4 bg-gray-100 border-b">Detalle de Casos</h3>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante(s)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolución</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {virsEscalados.map(vir => {
                  const resolucion = resoluciones.find(r => r.id_vir === vir.id)
                  return (
                    <tr key={vir.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(vir.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vir.curso_nombre}</td>
                      <td className="px-6 py-4">{vir.estudiantes_involucrados}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{vir.tipo_situacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resolucion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {resolucion ? 'Resuelto por Consejo' : 'Pendiente Consejo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {resolucion ? (
                          <div>
                            <strong>{resolucion.tipo_accion}</strong> {resolucion.puntos_descontados > 0 && `(-${resolucion.puntos_descontados} pts)`}
                            <p className="text-gray-500 text-xs mt-1">{resolucion.observaciones}</p>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!resolucion && role === 'admin' && (
                          <button onClick={() => { setSelectedVir(vir); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 flex items-center text-sm font-bold">
                            <Plus className="w-4 h-4 mr-1" /> Registrar Intervención
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedVir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Registrar Intervención del Consejo</h3>
            <div className="mb-4 text-sm text-gray-600">
              <p><strong>Estudiantes:</strong> {selectedVir.estudiantes_involucrados}</p>
              <p><strong>Situación:</strong> {selectedVir.tipo_situacion}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Acción</label>
                <select className="mt-1 block w-full p-2 border rounded" value={tipoAccion} onChange={e => setTipoAccion(e.target.value)}>
                  <option>Quita de puntos</option>
                  <option>Citación tutores</option>
                  <option>Acta de compromiso</option>
                  <option>Suspensión</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Puntos Descontados (Opcional)</label>
                <input type="number" min="0" className="mt-1 block w-full p-2 border rounded" value={puntos} onChange={e => setPuntos(Number(e.target.value))} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones (Acta Digital)</label>
                <textarea className="mt-1 block w-full p-2 border rounded h-24" value={observaciones} onChange={e => setObservaciones(e.target.value)}></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleGuardarResolucion} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar Resolución</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
