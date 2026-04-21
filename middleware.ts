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

  const soloAdmin = ['/admin', '/qr']
  // /var e /indicadores son públicas: solo piden nombre del profesor/preceptor, no login
  const protegidas = ['/dashboard', '/campo', '/historial', '/tablero']

  if (soloAdmin.some(r => pathname.startsWith(r))) {
    if (!session || session.rol !== 'admin')
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  if (protegidas.some(r => pathname.startsWith(r))) {
    if (!session || !['admin', 'operativo', 'visor'].includes(session.rol))
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/campo/:path*', '/historial/:path*', '/tablero/:path*', '/qr/:path*', '/admin/:path*'],
}
