"use strict";(()=>{var e={};e.id=662,e.ids=[662],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},50019:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>I,patchFetch:()=>O,requestAsyncStorage:()=>A,routeModule:()=>p,serverHooks:()=>d,staticGenerationAsyncStorage:()=>L});var o={};t.r(o),t.d(o,{DELETE:()=>N,GET:()=>R,POST:()=>T,dynamic:()=>c,revalidate:()=>u});var a=t(49303),i=t(88716),s=t(60670),n=t(87070),E=t(9487);let c="force-dynamic",u=0;async function T(e){let r=await (0,E.AH)();if(!r)return n.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let{curso_id:t,tipo_accion:o,descripcion:a,evidencia_url:i,evidencia_tipo:s,puntos:E,fecha:c,nombre_docente:u}=await e.json();if(!t||!o||!a||!E||!c||!u)return n.NextResponse.json({ok:!1,error:"Todos los campos obligatorios deben completarse."},{status:400});if(E<1||E>10)return n.NextResponse.json({ok:!1,error:"Los puntos deben ser entre 1 y 10."},{status:400});let T=new Date(c),R=T.getMonth()+1,N=T.getFullYear();return await r`
      INSERT INTO campo_positivo
        (curso_id, tipo_accion, descripcion, evidencia_url, evidencia_tipo, puntos, fecha, mes, anio, nombre_docente)
      VALUES
        (${t}, ${o}, ${a}, ${i||null},
         ${s||"enlace"}, ${E}, ${c}, ${R}, ${N}, ${u.trim()})
    `,n.NextResponse.json({ok:!0,message:"Acci\xf3n de campo registrada exitosamente"})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function R(e){let r=await (0,E.AH)();if(!r)return n.NextResponse.json([]);try{let t;let{searchParams:o}=new URL(e.url),a=o.get("mes"),i=o.get("anio")||new Date().getFullYear(),s=o.get("curso_id");return t=a?await r`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.mes = ${a} AND cp.anio = ${i}
        ${s?r`AND cp.curso_id = ${s}`:r``}
        ORDER BY cp.created_at DESC
      `:await r`
        SELECT cp.*, c.nombre as curso_nombre
        FROM campo_positivo cp
        JOIN cursos c ON c.id = cp.curso_id
        WHERE cp.anio = ${i}
        ${s?r`AND cp.curso_id = ${s}`:r``}
        ORDER BY cp.created_at DESC
        LIMIT 100
      `,n.NextResponse.json(t.rows)}catch{return n.NextResponse.json([])}}async function N(e){let r=await (0,E.AH)();if(!r)return n.NextResponse.json({ok:!1,error:"Sin DB"},{status:503});try{let{searchParams:t}=new URL(e.url),o=t.get("id");if(!o)return n.NextResponse.json({ok:!1,error:"ID requerido"},{status:400});return await r`DELETE FROM campo_positivo WHERE id = ${o}`,n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}let p=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/campo/route",pathname:"/api/campo",filename:"route",bundlePath:"app/api/campo/route"},resolvedPagePath:"C:\\Users\\Docente\\Desktop\\Proyectos\\videla\\Convivencia-Videla-push\\app\\api\\campo\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:A,staticGenerationAsyncStorage:L,serverHooks:d}=p,I="/api/campo/route";function O(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:L})}},9487:(e,r,t)=>{async function o(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).sql}catch{return null}}async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).db}catch{return null}}async function i(){let e=await o();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,{ok:!0}}async function s(){let e=await o();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}t.d(r,{$C:()=>s,AH:()=>o,VK:()=>a,kF:()=>i})}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[948,972],()=>t(50019));module.exports=o})();