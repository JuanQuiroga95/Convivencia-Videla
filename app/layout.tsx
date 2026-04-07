import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Videla Convivencia — Sistema VIR 2026',
  description: 'Variable de Incidencia y Reparación · Esc. N° 4-012 Ing. Ricardo Videla · Luján de Cuyo, Mendoza',
  themeColor: '#1A4D2E',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
