'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Shield, Trophy, History, ClipboardList, BarChart3, BookOpen, QrCode, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SessionData { autenticado: boolean; rol?: string; nombre?: string; usuario?: string }

const navItems = [
  { href: '/dashboard',   label: 'Inicio',             icon: LayoutDashboard, rol: ['admin', 'operativo'] },
  { href: '/tablero',     label: 'Tablero',             icon: BarChart3,       rol: ['admin', 'operativo'] },
  { href: '/var',         label: 'Activar VIR',         icon: Shield,          rol: ['admin', 'operativo'], accent: true },
  { href: '/campo',       label: 'Acciones positivas',  icon: Trophy,          rol: ['admin', 'operativo'], gold: true },
  { href: '/historial',   label: 'Historial VIR',       icon: History,         rol: ['admin', 'operativo'] },
  { href: '/indicadores', label: 'Indicadores',         icon: ClipboardList,   rol: ['admin', 'operativo'] },
  { href: '/reglas',      label: 'Criterios',           icon: BookOpen,        rol: ['admin', 'operativo'] },
  { href: '/qr',          label: 'Códigos QR',          icon: QrCode,          rol: ['admin'] },
  { href: '/admin',       label: 'Admin',               icon: Settings,        rol: ['admin'] },
]

const GD = '#1A4D2E'; const O = '#E85D04'

export default function Nav() {
  const pathname = usePathname()
  const [session, setSession] = useState<SessionData>({ autenticado: false })
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(setSession)
  }, [])

  // Cerrar drawer al cambiar de ruta
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    window.location.href = '/login'
  }

  const itemsVisibles = navItems.filter(item => !session.rol || item.rol.includes(session.rol))

  const NavLinks = () => (
    <>
      {itemsVisibles.map(({ href, label, icon: Icon, accent, gold }: any) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
        const textColor = active ? GD : accent ? '#FCA5A5' : gold ? '#FCD34D' : 'rgba(255,255,255,0.72)'
        return (
          <Link key={href} href={href}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 20px', textDecoration: 'none',
              fontFamily: 'var(--font-condensed)', letterSpacing: '0.03em', fontSize: '0.95rem',
              color: textColor,
              background: active ? 'rgba(255,255,255,0.92)' : 'transparent',
              borderLeft: active ? `3px solid ${O}` : '3px solid transparent',
              fontWeight: active ? 700 : 400, transition: 'all 0.15s',
            }}>
            <Icon size={17} />
            {label}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <nav className="sidebar-nav-desktop fixed left-0 top-0 h-full flex-col z-50"
        style={{ width: '224px', background: GD, borderRight: `3px solid ${O}` }}>
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
        <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          <NavLinks />
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {session.autenticado && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: O, fontSize: '0.82rem', fontWeight: 700, marginBottom: '1px' }}>{session.nombre || 'Usuario'}</div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', marginBottom: '2px' }}>•{session.usuario}</div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginBottom: '10px' }}>{session.rol === 'admin' ? 'Administrador' : 'Operativo'}</div>
              <button onClick={handleLogout} style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <LogOut size={13} /> CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile: top bar con hamburguesa ── */}
      <header className="mobile-header-top fixed top-0 left-0 right-0 z-50" style={{ background: GD, borderBottom: `3px solid ${O}`, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/escudo.jpg" alt="Escudo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${O}` }} />
          <div>
            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.9rem', color: 'white', fontWeight: 700, lineHeight: 1.1 }}>CONVIVENCIA <span style={{ color: O }}>VIDELIANA</span></div>
            <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.35)', fontSize: '0.55rem', letterSpacing: '0.1em' }}>SISTEMA VIR · 2026</div>
          </div>
        </div>
        <button onClick={() => setDrawerOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'rgba(255,255,255,0.8)' }}>
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ── Mobile: offset para el top bar ── */}
      <div className="mobile-spacer" style={{ height: '52px' }} />

      {/* ── Mobile: overlay oscuro ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} />
      )}

      {/* ── Mobile: drawer lateral izquierdo ── */}
      <nav className="mobile-drawer-nav fixed top-0 left-0 h-full flex flex-col"
        style={{
          width: '240px', background: GD, borderRight: `3px solid ${O}`,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          zIndex: 60,
        }}>
        {/* Header del drawer */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/escudo.jpg" alt="Escudo" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${O}` }} />
            <div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.95rem', color: 'white', fontWeight: 700, lineHeight: 1.1 }}>CONVIVENCIA</div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.95rem', color: O, fontWeight: 700, lineHeight: 1.1 }}>VIDELIANA</div>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <NavLinks />
        </div>

        {/* User info + logout */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {session.autenticado && (
            <>
              <div style={{ fontFamily: 'var(--font-condensed)', color: O, fontSize: '0.85rem', fontWeight: 700, marginBottom: '1px' }}>{session.nombre || 'Usuario'}</div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '2px' }}>•{session.usuario}</div>
              <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', marginBottom: '12px' }}>{session.rol === 'admin' ? 'Administrador' : 'Operativo'}</div>
              <button onClick={handleLogout} style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                <LogOut size={13} /> CERRAR SESIÓN
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
