"use strict";(()=>{var e={};e.id=912,e.ids=[912],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},67363:(e,i,r)=>{r.r(i),r.d(i,{originalPathname:()=>p,patchFetch:()=>O,requestAsyncStorage:()=>R,routeModule:()=>d,serverHooks:()=>L,staticGenerationAsyncStorage:()=>A});var a={};r.r(a),r.d(a,{GET:()=>N,POST:()=>u,dynamic:()=>T,revalidate:()=>c});var t=r(49303),o=r(88716),s=r(60670),n=r(87070),E=r(9487);let T="force-dynamic",c=0;async function u(e){let i=await (0,E.AH)();if(!i)return n.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let r=await e.json(),{curso_id:a,mes:t,anio:o,es_cierre_academico:s}=r;if(s)await i`
        INSERT INTO indicadores (curso_id, mes, anio, pct_aprobados, updated_at)
        VALUES (${a}, ${t}, ${o}, ${r.pct_aprobados}, NOW())
        ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
          pct_aprobados = EXCLUDED.pct_aprobados,
          updated_at    = NOW()
      `;else{let{limpieza:e,uniforme:s,asistencia:n,actas:E,ice_puntos:T,interv_tempranas:c,situaciones_previas:u}=r;await i`
        INSERT INTO indicadores
          (curso_id, mes, anio, limpieza, uniforme, asistencia,
           actas, ice_puntos, interv_tempranas, situaciones_previas, updated_at)
        VALUES
          (${a}, ${t}, ${o}, ${e}, ${s||null}, ${n},
           ${E}, ${T}, ${c??0}, ${u??0}, NOW())
        ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
          limpieza            = EXCLUDED.limpieza,
          uniforme            = EXCLUDED.uniforme,
          asistencia          = EXCLUDED.asistencia,
          actas               = EXCLUDED.actas,
          ice_puntos          = EXCLUDED.ice_puntos,
          interv_tempranas    = EXCLUDED.interv_tempranas,
          situaciones_previas = EXCLUDED.situaciones_previas,
          updated_at          = NOW()
      `}return n.NextResponse.json({ok:!0,message:"Guardado exitosamente"})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function N(e){let i=await (0,E.AH)();if(!i)return n.NextResponse.json([]);try{let r;let{searchParams:a}=new URL(e.url),t=a.get("mes"),o=a.get("anio")||new Date().getFullYear();return r=t?await i`
        SELECT i.*, c.nombre as curso_nombre FROM indicadores i
        JOIN cursos c ON c.id = i.curso_id
        WHERE i.mes = ${t} AND i.anio = ${o}
        ORDER BY c.anio, c.division
      `:await i`
        SELECT i.*, c.nombre as curso_nombre FROM indicadores i
        JOIN cursos c ON c.id = i.curso_id
        WHERE i.anio = ${o}
        ORDER BY i.mes DESC, c.anio, c.division
      `,n.NextResponse.json(r.rows)}catch{return n.NextResponse.json([])}}let d=new t.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/indicadores/route",pathname:"/api/indicadores",filename:"route",bundlePath:"app/api/indicadores/route"},resolvedPagePath:"C:\\Users\\Docente\\Desktop\\Proyectos\\videla\\Convivencia-Videla-push\\app\\api\\indicadores\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:R,staticGenerationAsyncStorage:A,serverHooks:L}=d,p="/api/indicadores/route";function O(){return(0,s.patchFetch)({serverHooks:L,staticGenerationAsyncStorage:A})}},9487:(e,i,r)=>{async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await r.e(462).then(r.bind(r,28462))).sql}catch{return null}}async function t(){if(!process.env.POSTGRES_URL)return null;try{return(await r.e(462).then(r.bind(r,28462))).db}catch{return null}}async function o(){let e=await a();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}r.d(i,{$C:()=>s,AH:()=>a,VK:()=>t,kF:()=>o})}};var i=require("../../../webpack-runtime.js");i.C(e);var r=e=>i(i.s=e),a=i.X(0,[948,972],()=>r(67363));module.exports=a})();