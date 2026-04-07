'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/var'
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => {
      if (d.autenticado) router.replace(from)
    })
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...form })
      })
      const data = await res.json()
      if (data.ok) {
        router.replace(from)
      } else {
        setError(data.message || 'Credenciales incorrectas')
      }
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: 'var(--green-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '24px' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{ background: 'rgba(232,93,4,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', marginBottom: '16px', border: '2px solid var(--orange)' }}>
            <Shield size={32} style={{ color: 'var(--orange)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1.1 }}>
            VIDELA<br /><span style={{ color: 'var(--orange)' }}>CONVIVENCIA</span>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.15em', marginTop: '6px' }}>
            SISTEMA VIR · 2026
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--green-dark)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.05em' }}>
            INICIAR SESIÓN
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ background: 'rgba(193,18,31,0.08)', border: '1px solid rgba(193,18,31,0.3)' }}>
              <AlertCircle size={16} style={{ color: '#C1121F' }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#C1121F', fontSize: '0.88rem' }}>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                USUARIO
              </label>
              <input
                type="text"
                className="input-videla"
                placeholder="Ingresá tu usuario"
                value={form.usuario}
                onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: 'var(--text-secondary)', fontSize: '0.78rem', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-videla"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.usuario || !form.password || loading}
              className="btn-gold w-full mt-2"
              style={{ marginTop: '8px' }}>
              {loading ? 'Verificando...' : 'INGRESAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
