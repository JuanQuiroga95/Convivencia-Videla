'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/var'
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Si ya está logueado, redirigir
  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => {
      if (d.autenticado) router.replace(from)
    })
  }, [])

  const handleLogin = async () => {
    if (!form.usuario || !form.password) { setError('Completá usuario y contraseña'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: form.usuario, password: form.password }),
      })
      const data = await res.json()
      if (data.ok) {
        router.replace(from)
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch { setError('Error de conexión') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #C9A84C, #E8C96E)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(201,168,76,0.3)'
          }}>
            <Shield size={32} style={{ color: '#0A1628' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'white', letterSpacing: '0.05em' }}>
            VIDELA
          </h1>
          <p style={{ fontFamily: 'var(--font-condensed)', color: '#C9A84C', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
            CONVIVENCIA ACTIVA 2026
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: '#6B7280', fontSize: '0.8rem', marginTop: '4px' }}>
            Panel de gestión institucional
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px' }}>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <AlertCircle size={16} style={{ color: '#FCA5A5', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#FCA5A5', fontSize: '0.9rem' }}>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                USUARIO
              </label>
              <input
                type="text"
                className="input-videla"
                placeholder="Ingresá tu usuario"
                value={form.usuario}
                onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoComplete="username"
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#9CA3AF', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-videla"
                  placeholder="Ingresá tu contraseña"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading} className="btn-gold w-full mt-2" style={{ marginTop: '8px' }}>
              {loading ? 'Ingresando...' : 'INGRESAR'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" style={{ fontFamily: 'var(--font-condensed)', color: '#374151', fontSize: '0.8rem', letterSpacing: '0.05em', textDecoration: 'none' }}>
            ← Volver al tablero público
          </a>
        </div>
      </div>
    </div>
  )
}
