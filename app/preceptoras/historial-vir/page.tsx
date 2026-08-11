import HistorialVirClient from '@/components/HistorialVirClient'
import Nav from '@/components/Nav'

export default function HistorialVirPreceptorasPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="main-with-sidebar">
        <div className="py-6 px-4 md:px-8">
          <HistorialVirClient role="preceptora" />
        </div>
      </main>
    </div>
  )
}
