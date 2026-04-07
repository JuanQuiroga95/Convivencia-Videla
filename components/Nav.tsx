'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, BarChart3, ClipboardList, BookOpen, QrCode, Settings, LogOut, History, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SessionData { autenticado: boolean; rol?: string; nombre?: string }

const navItems = [
  { href: '/var',        label: 'Activar VIR',    icon: Shield,      rol: ['admin', 'operativo'] },
  { href: '/campo',      label: 'Campo Positivo',  icon: Trophy,      rol: ['admin', 'operativo'] },
  { href: '/historial',  label: 'Historial VIR',   icon: History,     rol: ['admin', 'operativo'] },
  { href: '/indicadores',label: 'Indicadores',     icon: ClipboardList,rol: ['admin', 'operativo'] },
  { href: '/tablero',    label: 'Tablero',          icon: BarChart3,   rol: ['admin', 'operativo'] },
  { href: '/reglas',     label: 'Reglas',           icon: BookOpen,    rol: ['admin', 'operativo'] },
  { href: '/qr',         label: 'Códigos QR',       icon: QrCode,      rol: ['admin'] },
  { href: '/admin',      label: 'Admin',            icon: Settings,    rol: ['admin'] },
]

export default function Nav() {
  const pathname = usePathname()
  const router   = useRouter()
  const [session, setSession] = useState<SessionData>({ autenticado: false })

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(setSession)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    window.location.href = '/login'
  }

  const itemsVisibles = navItems.filter(item => !session.rol || item.rol.includes(session.rol))
  const mobileItems   = itemsVisibles.slice(0, 5)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col z-50"
        style={{ background: 'var(--green-dark)', borderRight: '3px solid var(--orange)' }}>

        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.1, color: 'white' }}>
            VIDELA<br /><span style={{ color: 'var(--orange)' }}>CONVIVENCIA</span>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', letterSpacing: '0.15em', marginTop: '4px' }}>
            SISTEMA VIR · 2026
          </div>
        </div>

        <div className="flex-1 py-3 overflow-y-auto">
          {itemsVisibles.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            const isCampo = href === '/campo'
            return (
              <Link key={href} href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 20px', textDecoration: 'none',
                  fontFamily: 'var(--font-condensed)', letterSpacing: '0.05em', fontSize: '0.9rem',
                  color: active ? 'var(--green-dark)' : isCampo ? '#FCD34D' : 'rgba(255,255,255,0.65)',
                  background: active ? 'var(--green-light)' : 'transparent',
                  borderLeft: active ? '3px solid var(--orange)' : isCampo && !active ? '3px solid rgba(252,211,77,0.4)' : '3px solid transparent',
                  transition: 'all 0.15s',
                  fontWeight: active ? 700 : isCampo ? 600 : 400,
                }}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {session.autenticado && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '2px', fontWeight: 700 }}>
                {session.nombre}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', marginBottom: '10px' }}>
                {session.rol === 'admin' ? 'Administrador' : 'Operativo'}
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-2 w-full text-sm"
                style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', padding: '6px 0' }}>
                <LogOut size={14} /> CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: 'var(--green-dark)', borderTop: '2px solid var(--orange)' }}>
        <div className="flex justify-around py-2">
          {mobileItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            const isCampo = href === '/campo'
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg"
                style={{ textDecoration: 'none', color: active ? 'var(--orange)' : isCampo ? '#FCD34D' : 'rgba(255,255,255,0.5)' }}>
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
