import HistorialVirClient from '@/components/HistorialVirClient'
import Nav from '@/components/Nav'

export default function HistorialVirPreceptorasPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="py-10">
        <HistorialVirClient role="preceptora" />
      </div>
    </div>
  )
}
