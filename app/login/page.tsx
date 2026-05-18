'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, LogIn, Eye, EyeOff } from 'lucide-react'

const GD = '#1A4D2E'; const O = '#E85D04'

export default function LoginPage() {
  const router = useRouter()
  const [usuario,  setUsuario]  = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [from,     setFrom]     = useState('/')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const f = params.get('from')
    if (f) setFrom(f)
    // Si ya hay sesión, redirigir
    fetch('/api/auth').then(r => r.json()).then(d => {
      if (d.autenticado) {
        if (d.rol === 'preceptora') router.replace('/preceptoras')
        else router.replace(f || '/dashboard')
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario.trim() || !password.trim()) {
      setError('Completá usuario y contraseña.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario.trim(), password: password.trim() }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Usuario o contraseña incorrectos.')
      } else {
        if (data.rol === 'preceptora') router.push('/preceptoras')
        else router.push(from !== '/' ? from : '/dashboard')
      }
    } catch {
      setError('Error de conexión. Intentá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0F1F12',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            border: `3px solid ${O}`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', background: 'rgba(232,93,4,0.12)',
          }}>
            <Shield size={32} style={{ color: O }} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem',
            color: 'white', letterSpacing: '0.06em', margin: '0 0 4px', lineHeight: 1.05,
          }}>
            CONVIVENCIA<br /><span style={{ color: O }}>VIDELIANA</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.35)',
            fontSize: '0.72rem', letterSpacing: '0.15em', margin: '6px 0 0',
          }}>
            SISTEMA VIR · 2026 · ESC. Nº 4-012
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px', padding: '28px 24px',
        }}>
          <div style={{
            fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.3)',
            fontSize: '0.7rem', letterSpacing: '0.15em', textAlign: 'center',
            marginBottom: '22px',
          }}>
            ACCESO AL SISTEMA
          </div>

          {/* Usuario */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)',
              fontSize: '0.72rem', letterSpacing: '0.12em', display: 'block', marginBottom: '7px',
            }}>
              USUARIO
            </label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              placeholder="Ingresá tu usuario"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
                padding: '12px 15px', color: 'white',
                fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{
              fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.45)',
              fontSize: '0.72rem', letterSpacing: '0.12em', display: 'block', marginBottom: '7px',
            }}>
              CONTRASEÑA
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
                  padding: '12px 42px 12px 15px', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', padding: '4px',
                }}
              >
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(193,18,31,0.15)', border: '1px solid rgba(193,18,31,0.4)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
            }}>
              <p style={{ fontFamily: 'var(--font-condensed)', color: '#FCA5A5', fontSize: '0.85rem', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#6B7280' : O,
              border: 'none', borderRadius: '10px', padding: '13px',
              color: 'white', fontFamily: 'var(--font-condensed)',
              fontSize: '1rem', letterSpacing: '0.08em', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            <LogIn size={17} />
            {loading ? 'INGRESANDO...' : 'INGRESAR AL SISTEMA'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontFamily: 'var(--font-condensed)',
          color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem',
          letterSpacing: '0.1em', marginTop: '24px',
        }}>
          Esc. Nº 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza
        </p>
      </div>
    </div>
  )
}
