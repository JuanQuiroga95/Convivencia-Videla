"use strict";(()=>{var e={};e.id=912,e.ids=[912],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},36183:(e,i,a)=>{a.r(i),a.d(i,{originalPathname:()=>p,patchFetch:()=>O,requestAsyncStorage:()=>R,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>L});var r={};a.r(r),a.d(r,{GET:()=>A,POST:()=>c,dynamic:()=>T,revalidate:()=>N});var t=a(49303),o=a(88716),s=a(60670),E=a(87070),n=a(9487);let T="force-dynamic",N=0;async function c(e){let i=await (0,n.AH)();if(!i)return E.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let a=await e.json(),{curso_id:r,mes:t,anio:o,es_cierre_academico:s}=a;if(s)await i`
        INSERT INTO indicadores (curso_id, mes, anio, pct_aprobados, updated_at)
        VALUES (${r}, ${t}, ${o}, ${a.pct_aprobados}, NOW())
        ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
          pct_aprobados = EXCLUDED.pct_aprobados,
          updated_at    = NOW()
      `;else{let{limpieza:e,uniforme:s,asistencia:E,actas:n,ice_puntos:T,interv_tempranas:N,situaciones_previas:c}=a;await i`
        INSERT INTO indicadores
          (curso_id, mes, anio, limpieza, uniforme, asistencia,
           actas, ice_puntos, interv_tempranas, situaciones_previas, updated_at)
        VALUES
          (${r}, ${t}, ${o}, ${e}, ${s||null}, ${E},
           ${n}, ${T}, ${N??0}, ${c??0}, NOW())
        ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
          limpieza            = EXCLUDED.limpieza,
          uniforme            = EXCLUDED.uniforme,
          asistencia          = EXCLUDED.asistencia,
          actas               = EXCLUDED.actas,
          ice_puntos          = EXCLUDED.ice_puntos,
          interv_tempranas    = EXCLUDED.interv_tempranas,
          situaciones_previas = EXCLUDED.situaciones_previas,
          updated_at          = NOW()
      `}return E.NextResponse.json({ok:!0,message:"Guardado exitosamente"})}catch(e){return E.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function A(e){let i=await (0,n.AH)();if(!i)return E.NextResponse.json([]);try{let a;let{searchParams:r}=new URL(e.url),t=r.get("mes"),o=r.get("anio")||new Date().getFullYear();return a=t?await i`
        SELECT i.*, c.nombre as curso_nombre FROM indicadores i
        JOIN cursos c ON c.id = i.curso_id
        WHERE i.mes = ${t} AND i.anio = ${o}
        ORDER BY c.anio, c.division
      `:await i`
        SELECT i.*, c.nombre as curso_nombre FROM indicadores i
        JOIN cursos c ON c.id = i.curso_id
        WHERE i.anio = ${o}
        ORDER BY i.mes DESC, c.anio, c.division
      `,E.NextResponse.json(a.rows)}catch{return E.NextResponse.json([])}}let u=new t.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/indicadores/route",pathname:"/api/indicadores",filename:"route",bundlePath:"app/api/indicadores/route"},resolvedPagePath:"C:\\Users\\juanp\\.gemini\\antigravity-ide\\scratch\\Convivencia-Videla\\app\\api\\indicadores\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:R,staticGenerationAsyncStorage:L,serverHooks:d}=u,p="/api/indicadores/route";function O(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:L})}},9487:(e,i,a)=>{async function r(){if(!process.env.POSTGRES_URL)return null;try{return(await a.e(462).then(a.bind(a,28462))).sql}catch{return null}}async function t(){if(!process.env.POSTGRES_URL)return null;try{return(await a.e(462).then(a.bind(a,28462))).db}catch{return null}}async function o(){let e=await r();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,await e`INSERT INTO configuracion (clave, valor) VALUES ('pin_vir', '1240') ON CONFLICT (clave) DO NOTHING`,{ok:!0}}async function s(){let e=await r();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}a.d(i,{$C:()=>s,AH:()=>r,VK:()=>t,kF:()=>o})}};var i=require("../../../webpack-runtime.js");i.C(e);var a=e=>i(i.s=e),r=i.X(0,[948,972],()=>a(36183));module.exports=r})();