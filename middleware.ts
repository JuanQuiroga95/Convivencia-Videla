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

  // Solo admin
  const soloAdmin = ['/admin', '/qr']
  if (soloAdmin.some(r => pathname.startsWith(r))) {
    if (!session || session.rol !== 'admin')
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }

  // Login requerido (pero NO /var, /campo, /indicadores — esos son accesibles por QR)
  const protegidas = ['/dashboard', '/historial', '/tablero']
  if (protegidas.some(r => pathname.startsWith(r))) {
    if (!session || !['admin', 'operativo'].includes(session.rol))
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // /docentes y /alumnos son páginas públicas — NO se incluyen en el matcher
  matcher: ['/dashboard/:path*', '/historial/:path*', '/tablero/:path*', '/qr/:path*', '/admin/:path*', '/var/:path*', '/campo/:path*', '/indicadores/:path*'],
}
