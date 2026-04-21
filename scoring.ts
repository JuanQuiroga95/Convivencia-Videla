import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-condensed)', color: '#6B7280', letterSpacing: '0.1em' }}>CARGANDO...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
