import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'videla_session'

// Rutas accesibles desde QR sin necesidad de login
const RUTAS_QR = ['/var', '/campo', '/indicadores', '/reglas', '/ranking-publico']

function getSession(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE)
  if (!cookie?.value) return null
  try { return JSON.parse(Buffer.from(cookie.value, 'base64').toString()) }
  catch { return null }
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const session = getSession(request)

  // Si viene con ?qr=1 y la ruta es una de las permitidas por QR → dejar pasar sin login
  if (searchParams.get('qr') === '1' && RUTAS_QR.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const soloAdmin = ['/admin', '/qr']
  const protegidas = ['/dashboard', '/var', '/campo', '/indicadores', '/historial', '/tablero']

  if (soloAdmin.some(r => pathname.startsWith(r))) {
    if (!session || session.rol !== 'admin')
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  if (protegidas.some(r => pathname.startsWith(r))) {
    if (!session || !['admin', 'operativo'].includes(session.rol))
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/var/:path*', '/campo/:path*', '/indicadores/:path*', '/historial/:path*', '/tablero/:path*', '/qr/:path*', '/admin/:path*'],
}
