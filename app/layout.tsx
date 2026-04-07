import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Modelo Videla — Convivencia Activa 2026',
  description: 'Sistema Formativo – Preventivo – Resolutivo · Escuela N° 4-012 Ing. Ricardo Videla',
  themeColor: '#1A4D2E',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
