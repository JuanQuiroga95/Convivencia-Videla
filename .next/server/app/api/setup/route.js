"use strict";(()=>{var e={};e.id=838,e.ids=[838],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},29023:(e,r,i)=>{i.r(r),i.d(r,{originalPathname:()=>d,patchFetch:()=>p,requestAsyncStorage:()=>R,routeModule:()=>A,serverHooks:()=>c,staticGenerationAsyncStorage:()=>L});var o={};i.r(o),i.d(o,{GET:()=>u,POST:()=>N,dynamic:()=>T});var a=i(49303),t=i(88716),s=i(60670),n=i(87070),E=i(9487);let T="force-dynamic";async function u(){try{return await (0,E.kF)(),await (0,E.$C)(),n.NextResponse.json({ok:!0,message:"Base de datos configurada correctamente ✓"})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}async function N(){let e=await (0,E.AH)();if(!e)return n.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let r=0;for(let i of[{nombre:"1\xb04\xb0",division:"4",anio:1},{nombre:"1\xb05\xb0",division:"5",anio:1},{nombre:"2\xb04\xb0",division:"4",anio:2},{nombre:"2\xb05\xb0",division:"5",anio:2},{nombre:"3\xb04\xb0",division:"4",anio:3},{nombre:"3\xb05\xb0",division:"5",anio:3},{nombre:"4\xb04\xb0",division:"4",anio:4},{nombre:"5\xb04\xb0",division:"4",anio:5}])(await e`
        INSERT INTO cursos (nombre, division, anio)
        VALUES (${i.nombre}, ${i.division}, ${i.anio})
        ON CONFLICT (nombre) DO NOTHING
      `).rowCount>0&&r++;let i=await e`SELECT COUNT(*) as count FROM cursos`;return n.NextResponse.json({ok:!0,message:`${r} cursos nuevos agregados. Total en DB: ${i.rows[0].count} cursos.`})}catch(e){return n.NextResponse.json({ok:!1,error:e.message},{status:500})}}let A=new a.AppRouteRouteModule({definition:{kind:t.x.APP_ROUTE,page:"/api/setup/route",pathname:"/api/setup",filename:"route",bundlePath:"app/api/setup/route"},resolvedPagePath:"C:\\Users\\Docente\\Desktop\\Proyectos\\videla\\Convivencia-Videla-push\\app\\api\\setup\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:R,staticGenerationAsyncStorage:L,serverHooks:c}=A,d="/api/setup/route";function p(){return(0,s.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:L})}},9487:(e,r,i)=>{async function o(){if(!process.env.POSTGRES_URL)return null;try{return(await i.e(462).then(i.bind(i,28462))).sql}catch{return null}}async function a(){if(!process.env.POSTGRES_URL)return null;try{return(await i.e(462).then(i.bind(i,28462))).db}catch{return null}}async function t(){let e=await o();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}i.d(r,{$C:()=>s,AH:()=>o,VK:()=>a,kF:()=>t})}};var r=require("../../../webpack-runtime.js");r.C(e);var i=e=>r(r.s=e),o=r.X(0,[948,972],()=>i(29023));module.exports=o})();