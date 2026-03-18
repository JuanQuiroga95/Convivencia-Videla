'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, BarChart3, ClipboardList, BookOpen, QrCode, Settings, LogOut, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SessionData {
  autenticado: boolean
  rol?: string
  nombre?: string
}

const navItems = [
  { href: '/var', label: 'Cargar VAR', icon: Shield, rol: ['admin', 'operativo'] },
  { href: '/indicadores', label: 'Indicadores', icon: ClipboardList, rol: ['admin', 'operativo'] },
  { href: '/tablero', label: 'Tablero', icon: BarChart3, rol: ['admin', 'operativo'] },
  { href: '/reglas', label: 'Reglas', icon: BookOpen, rol: ['admin', 'operativo'] },
  { href: '/qr', label: 'Códigos QR', icon: QrCode, rol: ['admin'] },
  { href: '/admin', label: 'Admin', icon: Settings, rol: ['admin'] },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<SessionData>({ autenticado: false })

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(setSession)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    router.replace('/login')
  }

  const itemsVisibles = navItems.filter(item => !session.rol || item.rol.includes(session.rol))
  const mobileItems = itemsVisibles.slice(0, 5)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col z-50"
        style={{ background: 'rgba(10,22,40,0.97)', borderRight: '1px solid rgba(201,168,76,0.15)' }}>

        <div className="p-5 border-b" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.1 }} className="text-gold-gradient">
            VIDELA<br />CONVIVENCIA
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: '#374151', fontSize: '0.65rem', letterSpacing: '0.15em', marginTop: '4px' }}>
            ACTIVA 2026
          </div>
        </div>

        <div className="flex-1 py-3 overflow-y-auto">
          {itemsVisibles.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-all ${active ? 'nav-active' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                style={{ fontFamily: 'var(--font-condensed)', letterSpacing: '0.05em', textDecoration: 'none' }}>
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* User info + logout */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {session.autenticado && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '2px' }}>
                {session.nombre}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#374151', fontSize: '0.7rem', marginBottom: '10px' }}>
                {session.rol === 'admin' ? 'Administrador' : 'Operativo'}
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-2 w-full text-sm transition-all hover:text-white"
                style={{ fontFamily: 'var(--font-condensed)', color: '#4B5563', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', padding: '6px 0' }}>
                <LogOut size={14} /> CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: 'rgba(10,22,40,0.98)', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex justify-around py-2">
          {mobileItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all ${active ? 'text-yellow-400' : 'text-gray-500'}`}
                style={{ textDecoration: 'none' }}>
                <Icon size={20} />
                <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '10px' }}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
