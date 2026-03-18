import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'videla_session'

function getSession(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE)
  if (!cookie?.value) return null
  try {
    return JSON.parse(Buffer.from(cookie.value, 'base64').toString())
  } catch { return null }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSession(request)

  // Rutas solo para admin
  const soloAdmin = ['/admin']
  // Rutas para operativo + admin (docentes/preceptores)
  const operativo = ['/var', '/indicadores', '/qr']

  if (soloAdmin.some(r => pathname.startsWith(r))) {
    if (!session || session.rol !== 'admin') {
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
    }
  }

  if (operativo.some(r => pathname.startsWith(r))) {
    if (!session || !['admin', 'operativo'].includes(session.rol)) {
      return NextResponse.redirect(new URL('/login?from=' + pathname, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/var/:path*', '/indicadores/:path*', '/qr/:path*', '/admin/:path*'],
}
