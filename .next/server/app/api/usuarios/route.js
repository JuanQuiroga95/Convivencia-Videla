"use strict";(()=>{var e={};e.id=67,e.ids=[67],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},53676:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>O,patchFetch:()=>S,requestAsyncStorage:()=>p,routeModule:()=>L,serverHooks:()=>I,staticGenerationAsyncStorage:()=>d});var s={};t.r(s),t.d(s,{DELETE:()=>c,GET:()=>R,POST:()=>N,PUT:()=>A,dynamic:()=>E});var a=t(49303),o=t(88716),i=t(60670),n=t(87070),u=t(9487);let E="force-dynamic";async function T(e){let r=e.cookies.get("videla_session");if(!r?.value)return!1;try{let e=JSON.parse(Buffer.from(r.value,"base64").toString());return"admin"===e.rol}catch{return!1}}async function R(e){if(!await T(e))return n.NextResponse.json({error:"Sin permisos"},{status:403});let r=await (0,u.AH)();if(!r)return n.NextResponse.json([]);try{let e=await r`SELECT id, nombre, usuario, rol, activo, created_at FROM usuarios ORDER BY created_at DESC`;return n.NextResponse.json(e.rows)}catch{return n.NextResponse.json([])}}async function N(e){if(!await T(e))return n.NextResponse.json({error:"Sin permisos"},{status:403});let r=await (0,u.AH)();if(!r)return n.NextResponse.json({ok:!1,error:"DB no disponible"},{status:503});try{let{nombre:t,usuario:s,password:a,rol:o}=await e.json();return await r`INSERT INTO usuarios (nombre, usuario, password, rol) VALUES (${t}, ${s}, ${a}, ${o||"operativo"})`,n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({ok:!1,error:e.message.includes("unique")?"Ese usuario ya existe":e.message},{status:400})}}async function A(e){if(!await T(e))return n.NextResponse.json({error:"Sin permisos"},{status:403});let r=await (0,u.AH)();if(!r)return n.NextResponse.json({ok:!1,error:"DB no disponible"},{status:503});try{let{id:t,nombre:s,usuario:a,password:o,rol:i,activo:u}=await e.json();return o?await r`UPDATE usuarios SET nombre=${s}, usuario=${a}, password=${o}, rol=${i}, activo=${u} WHERE id=${t}`:await r`UPDATE usuarios SET nombre=${s}, usuario=${a}, rol=${i}, activo=${u} WHERE id=${t}`,n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:400})}}async function c(e){if(!await T(e))return n.NextResponse.json({error:"Sin permisos"},{status:403});let r=await (0,u.AH)();if(!r)return n.NextResponse.json({ok:!1},{status:503});try{let{id:t}=await e.json();return await r`DELETE FROM usuarios WHERE id=${t}`,n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:400})}}let L=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/usuarios/route",pathname:"/api/usuarios",filename:"route",bundlePath:"app/api/usuarios/route"},resolvedPagePath:"C:\\Users\\Docente\\Desktop\\Proyectos\\videla\\Convivencia-Videla-push\\app\\api\\usuarios\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:I}=L,O="/api/usuarios/route";function S(){return(0,i.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:d})}},9487:(e,r,t)=>{async function s(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).sql}catch{return null}}async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).db}catch{return null}}async function o(){let e=await s();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS categoria_id VARCHAR(50)`,await e`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS nombre_activador VARCHAR(150)`,await e`CREATE TABLE IF NOT EXISTS indicadores (
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
  )`,{ok:!0}}async function i(){let e=await s();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}t.d(r,{$C:()=>i,AH:()=>s,VK:()=>a,kF:()=>o})}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[948,972],()=>t(53676));module.exports=s})();