export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSQL } from '@/lib/db'

const COOKIE = 'videla_session'
const ADMIN = { usuario: 'Videla.4012', password: 'VirVidela4012', rol: 'admin', nombre: 'Administrador' }

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action } = body

  if (action === 'logout') {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, '', { maxAge: 0, path: '/' })
    return res
  }

  // Login
  const usuario  = (body.usuario  || '').trim()
  const password = (body.password || '').trim()

  if (!usuario || !password) {
    return NextResponse.json({ ok: false, error: 'Completá usuario y contraseña.' }, { status: 400 })
  }

  let user: any = null

  // Try DB first
  const sql = await getSQL()
  if (sql) {
    try {
      const result = await sql`
        SELECT id, nombre, usuario, rol
        FROM usuarios
        WHERE usuario = ${usuario} AND password = ${password} AND activo = true
        LIMIT 1
      `
      if (result.rows.length > 0) user = result.rows[0]
    } catch (e) {
      console.error('DB auth error:', e)
    }
  }

  // Fallback hardcoded admin (always works even without DB)
  if (!user && usuario === ADMIN.usuario && password === ADMIN.password) {
    user = ADMIN
  }

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Usuario o contraseña incorrectos.' }, { status: 401 })
  }

  const sessionData = JSON.stringify({
    usuario: user.usuario,
    rol: user.rol,
    nombre: user.nombre,
    ts: Date.now(),
  })
  const sessionB64 = Buffer.from(sessionData).toString('base64')

  const res = NextResponse.json({ ok: true, rol: user.rol, nombre: user.nombre })
  res.cookies.set(COOKIE, sessionB64, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 10, // 10 horas
    path: '/',
  })
  return res
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE)
  if (!cookie?.value) return NextResponse.json({ autenticado: false })
  try {
    const data = JSON.parse(Buffer.from(cookie.value, 'base64').toString())
    if (!data.usuario || !data.rol) return NextResponse.json({ autenticado: false })
    return NextResponse.json({ autenticado: true, rol: data.rol, nombre: data.nombre, usuario: data.usuario })
  } catch {
    return NextResponse.json({ autenticado: false })
  }
}
