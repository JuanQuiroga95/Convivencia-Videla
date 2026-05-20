import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'videla_session'

function getSession(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE)
  if (!cookie?.value) return null
  try { return JSON.parse(Buffer.from(cookie.value, 'base64').toString()) }
  catch { return null }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSession(request)

  // Solo admin necesita login (panel, QR interno, estadísticas, dashboard, historial, tablero)
  const soloAdmin   = ['/admin', '/qr', '/estadisticas']
  const protegidas  = ['/dashboard', '/historial', '/tablero']

  // Preceptoras también necesitan login
  const preceRoutes = ['/preceptoras']

  // /var, /indicadores, /campo son accesibles vía QR Maestro sin login
  // /ranking-publico y /reglas son públicas para alumnos y maestros

  if (soloAdmin.some(r => pathname.startsWith(r))) {
    if (!session || session.rol !== 'admin')
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  if (protegidas.some(r => pathname.startsWith(r))) {
    if (!session || !['admin', 'operativo'].includes(session.rol))
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  if (preceRoutes.some(r => pathname.startsWith(r))) {
    if (!session || !['admin', 'preceptora'].includes(session.rol))
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', '/historial/:path*', '/tablero/:path*',
    '/qr/:path*', '/admin/:path*',
    '/preceptoras/:path*', '/estadisticas/:path*',
  ],
}
