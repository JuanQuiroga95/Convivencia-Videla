'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Shield, Trophy, History, ClipboardList, BarChart3, BookOpen, QrCode, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SessionData { autenticado: boolean; rol?: string; nombre?: string; usuario?: string }

const navItems = [
  { href: '/dashboard',   label: 'Inicio',          icon: LayoutDashboard, rol: ['admin', 'operativo'] },
  { href: '/tablero',     label: 'Tablero',          icon: BarChart3,       rol: ['admin', 'operativo'] },
  { href: '/var',         label: 'Activar VIR',      icon: Shield,          rol: ['admin', 'operativo'], accent: true },
  { href: '/campo',       label: 'Acciones positivas',icon: Trophy,         rol: ['admin', 'operativo'], gold: true },
  { href: '/historial',   label: 'Historial VIR',    icon: History,         rol: ['admin', 'operativo'] },
  { href: '/indicadores', label: 'Indicadores',      icon: ClipboardList,   rol: ['admin', 'operativo'] },
  { href: '/reglas',      label: 'Criterios',        icon: BookOpen,        rol: ['admin', 'operativo'] },
  { href: '/qr',          label: 'Códigos QR',       icon: QrCode,          rol: ['admin'] },
  { href: '/admin',       label: 'Admin',            icon: Settings,        rol: ['admin'] },
]

const GD = '#1A4D2E'; const G = '#2D7A4F'; const O = '#E85D04'; const GOLD = '#B45309'

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
        style={{ background: GD, borderRight: `3px solid ${O}` }}>

        {/* Logo */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${O}`, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '1rem', color: 'white', fontWeight: 700, lineHeight: 1.1 }}>CONVIVENCIA</div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '1rem', color: O, fontWeight: 700, lineHeight: 1.1 }}>VIDELIANA</div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', letterSpacing: '0.12em' }}>SISTEMA VIR · 2026</div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {itemsVisibles.map(({ href, label, icon: Icon, accent, gold }: any) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
            const textColor = active ? GD : accent ? '#FCA5A5' : gold ? '#FCD34D' : 'rgba(255,255,255,0.72)'
            return (
              <Link key={href} href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 20px', textDecoration: 'none',
                  fontFamily: 'var(--font-condensed)', letterSpacing: '0.03em', fontSize: '0.9rem',
                  color: textColor,
                  background: active ? 'rgba(255,255,255,0.92)' : 'transparent',
                  borderLeft: active ? `3px solid ${O}` : '3px solid transparent',
                  fontWeight: active ? 700 : 400, transition: 'all 0.15s',
                }}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* User info */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {session.autenticado && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: O, fontSize: '0.82rem', fontWeight: 700, marginBottom: '1px' }}>
                {session.nombre || 'Usuario'}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', marginBottom: '2px' }}>
                •{session.usuario}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginBottom: '10px' }}>
                {session.rol === 'admin' ? 'Administrador' : 'Operativo'}
              </div>
              <button onClick={handleLogout}
                style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <LogOut size={13}/> CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: GD, borderTop: `2px solid ${O}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 0' }}>
          {mobileItems.map(({ href, label, icon: Icon, accent, gold }: any) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '4px 8px', minWidth: '52px',
                  color: active ? O : accent ? 'rgba(252,165,165,0.85)' : gold ? 'rgba(252,211,77,0.85)' : 'rgba(255,255,255,0.5)' }}>
                <Icon size={20} />
                <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '9px', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
