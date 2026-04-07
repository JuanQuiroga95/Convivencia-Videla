'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const params = useSearchParams()
  const from = params.get('from') || '/var'
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => {
      if (d.autenticado) window.location.href = from
    })
  }, [])

  const handleSubmit = async () => {
    if (!form.usuario || !form.password) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', usuario: form.usuario.trim(), password: form.password }),
      })
      const data = await res.json()
      if (data.ok) { window.location.href = from }
      else { setError(data.error || 'Usuario o contraseña incorrectos'); setLoading(false) }
    } catch { setError('Error de conexión.'); setLoading(false) }
  }

  return (
    <div style={{ background: 'var(--green-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Escudo + título */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/escudo.jpg" alt="Escudo Videla"
            style={{ width: '115px', height: '115px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--orange)', display: 'block', margin: '0 auto 16px' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'white', letterSpacing: '0.05em', lineHeight: 1.1 }}>
            CLIMA DE CONVIVENCIA<br/><span style={{ color: 'var(--orange)' }}>VIDELA</span>
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', letterSpacing: '0.14em', marginTop: '8px' }}>
            ESTADO INSTITUCIONAL · ABRIL 2026
          </div>
          <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)', fontSize: '0.74rem', marginTop: '5px', lineHeight: 1.5 }}>
            Sistema de seguimiento del clima escolar<br/>
            <span style={{ fontSize: '0.7rem' }}>(VIR, indicadores y acciones formativas)</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--green-dark)', fontSize: '1.3rem', letterSpacing: '0.06em', marginBottom: '20px' }}>
            INICIAR SESIÓN
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', border: '2px solid #FCA5A5', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} style={{ color: '#C1121F', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#991B1B', fontSize: '0.88rem' }}>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.78rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px', fontWeight: 700 }}>USUARIO</label>
              <input type="text" autoComplete="username" className="input-videla"
                placeholder="Ingresá tu usuario" value={form.usuario}
                onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-condensed)', color: '#2D5A30', fontSize: '0.78rem', letterSpacing: '0.1em', display: 'block', marginBottom: '6px', fontWeight: 700 }}>CONTRASEÑA</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} autoComplete="current-password"
                  className="input-videla" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A9E87' }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>
            <button type="button" onClick={handleSubmit}
              disabled={!form.usuario || !form.password || loading}
              className="btn-gold w-full" style={{ marginTop: '4px', fontSize: '1.05rem', padding: '13px 24px' }}>
              {loading ? 'Verificando...' : 'INGRESAR'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '14px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '0.73rem' }}>
          Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo
        </div>
      </div>
    </div>
  )
}
