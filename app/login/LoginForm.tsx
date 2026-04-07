'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'

export default function LoginForm() {
  const params = useSearchParams()
  const from = params.get('from') || '/var'
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Si ya está logueado, redirigir
  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then(d => {
        if (d.autenticado) window.location.href = from
      })
  }, [])

  const handleSubmit = async () => {
    if (!form.usuario || !form.password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', usuario: form.usuario.trim(), password: form.password }),
      })
      const data = await res.json()
      if (data.ok) {
        // Usar window.location para forzar recarga completa con la cookie nueva
        window.location.href = from
      } else {
        setError(data.error || data.message || 'Usuario o contraseña incorrectos')
        setLoading(false)
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--green-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '24px' }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{ background: 'rgba(232,93,4,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '18px', marginBottom: '16px', border: '2px solid var(--orange)' }}>
            <Shield size={36} style={{ color: 'var(--orange)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1.1 }}>
            VIDELA<br /><span style={{ color: 'var(--orange)' }}>CONVIVENCIA</span>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.18em', marginTop: '6px' }}>
            SISTEMA VIR · 2026
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--green-dark)', fontSize: '1.3rem', letterSpacing: '0.06em', marginBottom: '22px' }}>
            INICIAR SESIÓN
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg"
              style={{ background: '#FEE2E2', border: '2px solid #FCA5A5' }}>
              <AlertCircle size={16} style={{ color: '#C1121F', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#991B1B', fontSize: '0.88rem' }}>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.78rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                USUARIO
              </label>
              <input
                type="text"
                autoComplete="username"
                className="input-videla"
                placeholder="Ingresá tu usuario"
                value={form.usuario}
                onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.78rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-videla"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ paddingRight: '44px' }}
                />
                <button type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A9E87', padding: '4px' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!form.usuario || !form.password || loading}
              className="btn-gold w-full"
              style={{ marginTop: '8px', fontSize: '1.05rem', padding: '13px 24px' }}>
              {loading ? 'Verificando...' : 'INGRESAR'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo
        </div>
      </div>
    </div>
  )
}
