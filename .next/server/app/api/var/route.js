"use strict";(()=>{var e={};e.id=899,e.ids=[899],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},92232:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>d,patchFetch:()=>I,requestAsyncStorage:()=>c,routeModule:()=>R,serverHooks:()=>p,staticGenerationAsyncStorage:()=>L});var a={};t.r(a),t.d(a,{GET:()=>A,POST:()=>N,dynamic:()=>u,revalidate:()=>T});var i=t(49303),o=t(88716),s=t(60670),n=t(87070),E=t(9487);let u="force-dynamic",T=0;async function N(e){let r=await (0,E.AH)();if(!r)return n.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let{curso_id:t,categoria_id:a,tipo_situacion:i,resuelto:o,tipo_reparacion:s,intervino:E,nombre_activador:u}=await e.json();if(!u||u.trim().length<3)return n.NextResponse.json({ok:!1,error:"El nombre del activador es obligatorio."},{status:400});let T=new Date;return await r`INSERT INTO var_registros
      (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, mes, anio)
      VALUES (
        ${t},
        ${a||null},
        ${i},
        ${o},
        ${s||null},
        ${E},
        ${u.trim()},
        ${T.getMonth()+1},
        ${T.getFullYear()}
      )`,n.NextResponse.json({ok:!0,message:"VIR registrado exitosamente"})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function A(e){let r=await (0,E.VK)();if(!r)return n.NextResponse.json([]);try{let{searchParams:t}=new URL(e.url),a=t.get("mes"),i=t.get("anio")||new Date().getFullYear(),o=t.get("curso_id"),s=t.get("categoria"),E=t.get("resuelto"),u=t.get("intervino"),T=parseInt(t.get("page")||"1"),N=parseInt(t.get("limit")||"50"),A=`
      SELECT v.*, c.nombre as curso_nombre
      FROM var_registros v
      JOIN cursos c ON c.id = v.curso_id
      WHERE v.anio = $1
    `,R=[i],c=1;a&&(c++,A+=` AND v.mes = $${c}`,R.push(a)),o&&(c++,A+=` AND v.curso_id = $${c}`,R.push(o));let L=t.get("curso_nombre");L&&(c++,A+=` AND c.nombre = $${c}`,R.push(L)),s&&(c++,A+=` AND v.categoria_id = $${c}`,R.push(s)),("true"===E||"false"===E)&&(c++,A+=` AND v.resuelto = $${c}`,R.push("true"===E)),u&&(c++,A+=` AND v.intervino = $${c}`,R.push(u)),A+=` ORDER BY v.created_at DESC LIMIT $${c+1} OFFSET $${c+2}`,R.push(N,(T-1)*N);let p=await r.query(A,R);return n.NextResponse.json(p.rows)}catch(e){return console.error("Error fetching VIR:",e),n.NextResponse.json([])}}let R=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/var/route",pathname:"/api/var",filename:"route",bundlePath:"app/api/var/route"},resolvedPagePath:"C:\\Users\\Docente\\Desktop\\Proyectos\\videla\\Convivencia-Videla-push\\app\\api\\var\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:L,serverHooks:p}=R,d="/api/var/route";function I(){return(0,s.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:L})}},9487:(e,r,t)=>{async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).sql}catch{return null}}async function i(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).db}catch{return null}}async function o(){let e=await a();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,{ok:!0}}async function s(){let e=await a();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}t.d(r,{$C:()=>s,AH:()=>a,VK:()=>i,kF:()=>o})}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948,972],()=>t(92232));module.exports=a})();