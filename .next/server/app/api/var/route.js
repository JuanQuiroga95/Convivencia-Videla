"use strict";(()=>{var e={};e.id=899,e.ids=[899],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},49242:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>I,patchFetch:()=>p,requestAsyncStorage:()=>c,routeModule:()=>R,serverHooks:()=>d,staticGenerationAsyncStorage:()=>L});var a={};t.r(a),t.d(a,{GET:()=>N,POST:()=>A,dynamic:()=>T,revalidate:()=>u});var i=t(49303),o=t(88716),s=t(60670),n=t(87070),E=t(9487);let T="force-dynamic",u=0;async function A(e){let r=await (0,E.AH)();if(!r)return n.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let{curso_id:t,categoria_id:a,tipo_situacion:i,resuelto:o,tipo_reparacion:s,intervino:E,nombre_activador:T,estudiantes_involucrados:u,desc_mediacion:A,pin:N,estado:R}=await e.json();if(!T||T.trim().length<3)return n.NextResponse.json({ok:!1,error:"El nombre del activador es obligatorio."},{status:400});if(!N)return n.NextResponse.json({ok:!1,error:"El PIN de autorizaci\xf3n es obligatorio."},{status:400});let c=await r`SELECT valor FROM configuracion WHERE clave = 'pin_vir'`,L=c.rows.length>0?c.rows[0].valor:"1240";if(N!==L)return n.NextResponse.json({ok:!1,error:"PIN de autorizaci\xf3n incorrecto."},{status:401});let d=new Date;return await r`INSERT INTO var_registros
      (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, estudiantes_involucrados, desc_mediacion, mes, anio, estado)
      VALUES (
        ${t},
        ${a||null},
        ${i},
        ${o},
        ${s||null},
        ${E},
        ${T.trim()},
        ${u||null},
        ${A||null},
        ${d.getMonth()+1},
        ${d.getFullYear()},
        ${R||(o?"Resuelto":"Pendiente")}
      )`,n.NextResponse.json({ok:!0,message:"VIR registrado exitosamente"})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function N(e){let r=await (0,E.VK)();if(!r)return n.NextResponse.json([]);try{let{searchParams:t}=new URL(e.url),a=t.get("mes"),i=t.get("anio")||new Date().getFullYear(),o=t.get("curso_id"),s=t.get("categoria"),E=t.get("resuelto"),T=t.get("intervino"),u=t.get("estado"),A=parseInt(t.get("page")||"1"),N=parseInt(t.get("limit")||"50"),R=`
      SELECT v.*, c.nombre as curso_nombre
      FROM var_registros v
      JOIN cursos c ON c.id = v.curso_id
      WHERE v.anio = $1
    `,c=[i],L=1;a&&(L++,R+=` AND v.mes = $${L}`,c.push(a)),o&&(L++,R+=` AND v.curso_id = $${L}`,c.push(o));let d=t.get("curso_nombre");d&&(L++,R+=` AND c.nombre = $${L}`,c.push(d)),s&&(L++,R+=` AND v.categoria_id = $${L}`,c.push(s)),("true"===E||"false"===E)&&(L++,R+=` AND v.resuelto = $${L}`,c.push("true"===E)),T&&(L++,R+=` AND v.intervino = $${L}`,c.push(T)),u&&(L++,R+=` AND v.estado = $${L}`,c.push(u)),R+=` ORDER BY v.created_at DESC LIMIT $${L+1} OFFSET $${L+2}`,c.push(N,(A-1)*N);let I=await r.query(R,c);return n.NextResponse.json(I.rows)}catch(e){return console.error("Error fetching VIR:",e),n.NextResponse.json([])}}let R=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/var/route",pathname:"/api/var",filename:"route",bundlePath:"app/api/var/route"},resolvedPagePath:"C:\\Users\\juanp\\.gemini\\antigravity-ide\\scratch\\Convivencia-Videla\\app\\api\\var\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:L,serverHooks:d}=R,I="/api/var/route";function p(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:L})}},9487:(e,r,t)=>{async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).sql}catch{return null}}async function i(){if(!process.env.POSTGRES_URL)return null;try{return(await t.e(462).then(t.bind(t,28462))).db}catch{return null}}async function o(){let e=await a();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,await e`INSERT INTO configuracion (clave, valor) VALUES ('pin_vir', '1240') ON CONFLICT (clave) DO NOTHING`,{ok:!0}}async function s(){let e=await a();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}t.d(r,{$C:()=>s,AH:()=>a,VK:()=>i,kF:()=>o})}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948,972],()=>t(49242));module.exports=a})();