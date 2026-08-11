"use strict";(()=>{var e={};e.id=268,e.ids=[268],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},90406:(e,r,a)=>{a.r(r),a.d(r,{originalPathname:()=>O,patchFetch:()=>l,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>I,staticGenerationAsyncStorage:()=>p});var o={};a.r(o),a.d(o,{GET:()=>L,POST:()=>R,dynamic:()=>T});var t=a(49303),i=a(88716),s=a(60670),n=a(87070),E=a(9487);let T="force-dynamic",u="videla_session",A={usuario:"Videla.4012",password:"VirVidela4012",rol:"admin",nombre:"Administrador"},N={usuario:"precevidela",password:"virprece2026",rol:"preceptora",nombre:"Preceptoras"};async function R(e){let r=await e.json(),{action:a}=r;if("logout"===a){let e=n.NextResponse.json({ok:!0});return e.cookies.set(u,"",{maxAge:0,path:"/"}),e}let o=(r.usuario||"").trim(),t=(r.password||"").trim();if(!o||!t)return n.NextResponse.json({ok:!1,error:"Complet\xe1 usuario y contrase\xf1a."},{status:400});let i=null,s=await (0,E.AH)();if(s)try{let e=await s`
        SELECT id, nombre, usuario, rol
        FROM usuarios
        WHERE usuario = ${o} AND password = ${t} AND activo = true
        LIMIT 1
      `;e.rows.length>0&&(i=e.rows[0])}catch(e){console.error("DB auth error:",e)}if(i||o!==A.usuario||t!==A.password||(i=A),i||o!==N.usuario||t!==N.password||(i=N),!i)return n.NextResponse.json({ok:!1,error:"Usuario o contrase\xf1a incorrectos."},{status:401});let T=JSON.stringify({usuario:i.usuario,rol:i.rol,nombre:i.nombre,ts:Date.now()}),R=Buffer.from(T).toString("base64"),L=n.NextResponse.json({ok:!0,rol:i.rol,nombre:i.nombre});return L.cookies.set(u,R,{httpOnly:!0,secure:!0,sameSite:"lax",maxAge:36e3,path:"/"}),L}async function L(e){let r=e.cookies.get(u);if(!r?.value)return n.NextResponse.json({autenticado:!1});try{let e=JSON.parse(Buffer.from(r.value,"base64").toString());if(!e.usuario||!e.rol)return n.NextResponse.json({autenticado:!1});return n.NextResponse.json({autenticado:!0,rol:e.rol,nombre:e.nombre,usuario:e.usuario})}catch{return n.NextResponse.json({autenticado:!1})}}let c=new t.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/auth/route",pathname:"/api/auth",filename:"route",bundlePath:"app/api/auth/route"},resolvedPagePath:"C:\\Users\\juanp\\.gemini\\antigravity-ide\\scratch\\Convivencia-Videla\\app\\api\\auth\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:I}=c,O="/api/auth/route";function l(){return(0,s.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:p})}},9487:(e,r,a)=>{async function o(){if(!process.env.POSTGRES_URL)return null;try{return(await a.e(462).then(a.bind(a,28462))).sql}catch{return null}}async function t(){if(!process.env.POSTGRES_URL)return null;try{return(await a.e(462).then(a.bind(a,28462))).db}catch{return null}}async function i(){let e=await o();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    division VARCHAR(5) NOT NULL,
    anio INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO cursos (nombre, division, anio) VALUES
    ('1°1°', '1', 1), ('1°2°', '2', 1), ('1°3°', '3', 1), ('1°4°', '4', 1), ('1°5°', '5', 1),
    ('2°1°', '1', 2), ('2°2°', '2', 2), ('2°3°', '3', 2), ('2°4°', '4', 2), ('2°5°', '5', 2),
    ('3°1°', '1', 3), ('3°2°', '2', 3), ('3°3°', '3', 3), ('3°4°', '4', 3), ('3°5°', '5', 3),
    ('4°1°', '1', 4), ('4°2°', '2', 4), ('4°3°', '3', 4), ('4°4°', '4', 4),
    ('5°1°', '1', 5), ('5°2°', '2', 5), ('5°3°', '3', 5), ('5°4°', '4', 5)
    ON CONFLICT (nombre) DO NOTHING`,await e`CREATE TABLE IF NOT EXISTS var_registros (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES cursos(id),
    categoria_id VARCHAR(50),
    tipo_situacion VARCHAR(200) NOT NULL,
    resuelto BOOLEAN NOT NULL DEFAULT false,
    tipo_reparacion VARCHAR(100),
    intervino VARCHAR(50) NOT NULL,
    nombre_activador VARCHAR(150),
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS categoria_id VARCHAR(50)`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS nombre_activador VARCHAR(150)`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS estudiantes_involucrados TEXT`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS desc_mediacion TEXT`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'Pendiente'`,await e`UPDATE var_registros SET estado = 'Resuelto' WHERE resuelto = true AND (estado IS NULL OR estado = 'Pendiente')`,await e`CREATE TABLE IF NOT EXISTS vir_resoluciones_consejo (
    id_resolucion SERIAL PRIMARY KEY,
    id_vir INTEGER REFERENCES var_registros(id) ON DELETE CASCADE,
    fecha_resolucion TIMESTAMP DEFAULT NOW(),
    tipo_accion VARCHAR(150) NOT NULL,
    puntos_descontados INTEGER,
    observaciones TEXT,
    autor_registro VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`CREATE TABLE IF NOT EXISTS indicadores (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES cursos(id),
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    limpieza INTEGER,
    uniforme VARCHAR(20),
    asistencia DECIMAL(5,2),
    actas INTEGER DEFAULT 0,
    ice_puntos INTEGER DEFAULT 0,
    pct_aprobados DECIMAL(5,2),
    interv_tempranas INTEGER DEFAULT 0,
    situaciones_previas INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id, mes, anio)
  )`,await e`ALTER TABLE indicadores ADD COLUMN IF NOT EXISTS interv_tempranas INTEGER DEFAULT 0`,await e`ALTER TABLE indicadores ADD COLUMN IF NOT EXISTS situaciones_previas INTEGER DEFAULT 0`,await e`ALTER TABLE indicadores ADD COLUMN IF NOT EXISTS asistencia DECIMAL(5,2)`,await e`CREATE TABLE IF NOT EXISTS campo_positivo (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES cursos(id),
    tipo_accion VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia_url VARCHAR(500),
    evidencia_tipo VARCHAR(20) DEFAULT 'enlace',
    puntos INTEGER NOT NULL DEFAULT 5,
    fecha DATE NOT NULL,
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    nombre_docente VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`CREATE TABLE IF NOT EXISTS configuracion (
    clave VARCHAR(50) PRIMARY KEY,
    valor TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO configuracion (clave, valor) VALUES ('pin_vir', '1240') ON CONFLICT (clave) DO NOTHING`,{ok:!0}}async function s(){let e=await o();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}a.d(r,{$C:()=>s,AH:()=>o,VK:()=>t,kF:()=>i})}};var r=require("../../../webpack-runtime.js");r.C(e);var a=e=>r(r.s=e),o=r.X(0,[948,972],()=>a(90406));module.exports=o})();