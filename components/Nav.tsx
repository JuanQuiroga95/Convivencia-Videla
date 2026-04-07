'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Shield, Trophy, History, ClipboardList, BarChart3, BookOpen, QrCode, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SessionData { autenticado: boolean; rol?: string; nombre?: string }

const navItems = [
  { href: '/dashboard',   label: 'Inicio',          icon: LayoutDashboard, rol: ['admin', 'operativo'] },
  { href: '/tablero',     label: 'Tablero',          icon: BarChart3,       rol: ['admin', 'operativo'] },
  { href: '/var',         label: 'Registrar VIR',   icon: Shield,          rol: ['admin', 'operativo'] },
  { href: '/campo',       label: 'Campo Positivo',  icon: Trophy,          rol: ['admin', 'operativo'] },
  { href: '/historial',   label: 'Historial VIR',   icon: History,         rol: ['admin', 'operativo'] },
  { href: '/indicadores', label: 'Indicadores',     icon: ClipboardList,   rol: ['admin', 'operativo'] },
  { href: '/reglas',      label: 'Reglas',           icon: BookOpen,        rol: ['admin', 'operativo'] },
  { href: '/qr',          label: 'Códigos QR',       icon: QrCode,          rol: ['admin'] },
  { href: '/admin',       label: 'Admin',            icon: Settings,        rol: ['admin'] },
]

export default function Nav() {
  const pathname = usePathname()
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

        {/* Logo */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--orange)', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                CLIMA<br/><span style={{ color: 'var(--orange)' }}>VIDELIANO</span>
              </div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', letterSpacing: '0.12em', marginTop: '6px' }}>
            SISTEMA VIR · 2026
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-2 overflow-y-auto">
          {itemsVisibles.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
            const isVIR  = href === '/var'
            const isCampo = href === '/campo'
            return (
              <Link key={href} href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 18px', textDecoration: 'none',
                  fontFamily: 'var(--font-condensed)', letterSpacing: '0.04em', fontSize: '0.88rem',
                  color: active ? 'var(--green-dark)' : isVIR ? '#FCA5A5' : isCampo ? '#FCD34D' : 'rgba(255,255,255,0.65)',
                  background: active ? 'var(--green-light)' : 'transparent',
                  borderLeft: active ? '3px solid var(--orange)' : '3px solid transparent',
                  fontWeight: active ? 700 : 400, transition: 'all 0.15s',
                }}>
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {session.autenticado && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', fontSize: '0.75rem', letterSpacing: '0.04em', marginBottom: '1px', fontWeight: 700 }}>{session.nombre}</div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', marginBottom: '8px' }}>{session.rol === 'admin' ? 'Administrador' : 'Operativo'}</div>
              <button onClick={handleLogout} style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                <LogOut size={13}/> CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: 'var(--green-dark)', borderTop: '2px solid var(--orange)' }}>
        <div className="flex justify-around py-1">
          {mobileItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            const isVIR  = href === '/var'
            const isCampo = href === '/campo'
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg"
                style={{ textDecoration: 'none', color: active ? 'var(--orange)' : isVIR ? 'rgba(252,165,165,0.8)' : isCampo ? 'rgba(252,211,77,0.8)' : 'rgba(255,255,255,0.5)', minWidth: '52px' }}>
                <Icon size={19} />
                <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '9px', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
