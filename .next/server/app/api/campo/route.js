"use strict";(()=>{var e={};e.id=662,e.ids=[662],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},73559:(e,r,o)=>{o.r(r),o.d(r,{originalPathname:()=>I,patchFetch:()=>O,requestAsyncStorage:()=>p,routeModule:()=>A,serverHooks:()=>d,staticGenerationAsyncStorage:()=>L});var t={};o.r(t),o.d(t,{DELETE:()=>u,GET:()=>N,POST:()=>R,dynamic:()=>c,revalidate:()=>T});var a=o(49303),i=o(88716),s=o(60670),E=o(87070),n=o(9487);let c="force-dynamic",T=0;async function R(e){let r=await (0,n.AH)();if(!r)return E.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let{curso_id:o,tipo_accion:t,descripcion:a,evidencia_url:i,evidencia_tipo:s,puntos:n,fecha:c,nombre_docente:T}=await e.json();if(!o||!t||!a||!n||!c||!T)return E.NextResponse.json({ok:!1,error:"Todos los campos obligatorios deben completarse."},{status:400});if(n<1||n>10)return E.NextResponse.json({ok:!1,error:"Los puntos deben ser entre 1 y 10."},{status:400});let R=new Date(c),N=R.getMonth()+1,u=R.getFullYear();return await r`
      INSERT INTO campo_positivo
        (curso_id, tipo_accion, descripcion, evidencia_url, evidencia_tipo, puntos, fecha, mes, anio, nombre_docente)
      VALUES
        (${o}, ${t}, ${a}, ${i||null},
         ${s||"enlace"}, ${n}, ${c}, ${N}, ${u}, ${T.trim()})
    `,E.NextResponse.json({ok:!0,message:"Acci\xf3n de campo registrada exitosamente"})}catch(e){return E.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function N(e){let r=await (0,n.AH)();if(!r)return E.NextResponse.json([]);try{let o;let{searchParams:t}=new URL(e.url),a=t.get("mes"),i=t.get("anio")||new Date().getFullYear(),s=t.get("curso_id");return o=a&&s?await r`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.mes = ${a} AND cp.anio = ${i} AND cp.curso_id = ${s}
        ORDER BY cp.created_at DESC
      `:a?await r`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.mes = ${a} AND cp.anio = ${i}
        ORDER BY cp.created_at DESC
      `:s?await r`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.anio = ${i} AND cp.curso_id = ${s}
        ORDER BY cp.created_at DESC
        LIMIT 100
      `:await r`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.anio = ${i}
        ORDER BY cp.created_at DESC
        LIMIT 100
      `,E.NextResponse.json(o.rows)}catch{return E.NextResponse.json([])}}async function u(e){let r=await (0,n.AH)();if(!r)return E.NextResponse.json({ok:!1,error:"Sin DB"},{status:503});try{let{searchParams:o}=new URL(e.url),t=o.get("id");if(!t)return E.NextResponse.json({ok:!1,error:"ID requerido"},{status:400});return await r`DELETE FROM campo_positivo WHERE id = ${t}`,E.NextResponse.json({ok:!0})}catch(e){return E.NextResponse.json({ok:!1,error:e.message},{status:500})}}let A=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/campo/route",pathname:"/api/campo",filename:"route",bundlePath:"app/api/campo/route"},resolvedPagePath:"C:\\Users\\juanp\\.gemini\\antigravity-ide\\scratch\\Convivencia-Videla\\app\\api\\campo\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:p,staticGenerationAsyncStorage:L,serverHooks:d}=A,I="/api/campo/route";function O(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:L})}},9487:(e,r,o)=>{async function t(){if(!process.env.POSTGRES_URL)return null;try{return(await o.e(462).then(o.bind(o,28462))).sql}catch{return null}}async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await o.e(462).then(o.bind(o,28462))).db}catch{return null}}async function i(){let e=await t();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,await e`INSERT INTO configuracion (clave, valor) VALUES ('pin_vir', '1240') ON CONFLICT (clave) DO NOTHING`,{ok:!0}}async function s(){let e=await t();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}o.d(r,{$C:()=>s,AH:()=>t,VK:()=>a,kF:()=>i})}};var r=require("../../../webpack-runtime.js");r.C(e);var o=e=>r(r.s=e),t=r.X(0,[948,972],()=>o(73559));module.exports=t})();