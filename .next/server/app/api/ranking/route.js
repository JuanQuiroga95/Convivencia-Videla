"use strict";(()=>{var e={};e.id=791,e.ids=[791],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},15206:e=>{e.exports=require("zlib")},78630:(e,a,r)=>{r.r(a),r.d(a,{originalPathname:()=>R,patchFetch:()=>L,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>N,staticGenerationAsyncStorage:()=>A});var i={};r.r(i),r.d(i,{GET:()=>T,dynamic:()=>E,revalidate:()=>c});var o=r(49303),t=r(88716),n=r(60670),s=r(87070),u=r(9487);[{id:"pares",label:"\uD83D\uDFE2 Interacci\xf3n entre Pares",color:"#2D7A4F",situaciones:["Esconder materiales de estudio","Romper materiales de estudio","Conflicto verbal entre estudiantes","Hostigamiento (burla, provocaci\xf3n, empujones)"]},{id:"docente",label:"\uD83D\uDFE0 Relaci\xf3n con Docente / Preceptor",color:"#E85D04",situaciones:["Desobediencia a indicaciones","Respuesta verbal inadecuada","Ignorar consignas de trabajo en forma reiterada"]},{id:"entorno",label:"\uD83D\uDFE3 Cuidado del Entorno",color:"#7C3AED",situaciones:["Desorden del espacio de trabajo","Suciedad del espacio","Deterioro del mobiliario","Intervenci\xf3n sobre superficies (rayar, pintar)","Uso inadecuado de materiales"]},{id:"clase",label:"\uD83D\uDD35 Relaci\xf3n con la Clase",color:"#1D4ED8",situaciones:["Interrupci\xf3n reiterada de la clase","Uso indebido del celular","Ingreso tard\xedo al aula (posterior al timbre)","No realizaci\xf3n de la actividad en el momento"]}].flatMap(e=>e.situaciones);let E="force-dynamic",c=0,d=["1\xb01\xb0","1\xb02\xb0","1\xb03\xb0","1\xb04\xb0","1\xb05\xb0","2\xb01\xb0","2\xb02\xb0","2\xb03\xb0","2\xb04\xb0","2\xb05\xb0","3\xb01\xb0","3\xb02\xb0","3\xb03\xb0","3\xb04\xb0","3\xb05\xb0","4\xb01\xb0","4\xb02\xb0","4\xb03\xb0","4\xb04\xb0","5\xb01\xb0","5\xb02\xb0","5\xb03\xb0","5\xb04\xb0"].map((e,a)=>({id:a+1,nombre:e}));async function T(e){let{searchParams:a}=new URL(e.url),r=parseInt(a.get("mes")||String(new Date().getMonth()+1)),i=parseInt(a.get("anio")||String(new Date().getFullYear())),o=a.get("modo")||"mensual",t=parseInt(a.get("periodo")||(7>new Date().getMonth()?"1":"2")),n=await (0,u.AH)();if(!n){let e=d.map(e=>({curso_id:e.id,curso_nombre:e.nombre,mes:r,anio:i,puntaje_total:40,puntaje_resolutivo:40,puntaje_formativo:0,puntaje_campo:0,puntaje_academico:0,pct_var_resueltos:0,campo_bonus:0,tiene_datos:!0}));return s.NextResponse.json({ranking:e,mes:r,anio:i})}try{let e=(await n`SELECT * FROM cursos ORDER BY anio, division`).rows;if("periodo"===o){let a=1===t?[1,2,3,4,5,6,7]:[8,9,10,11,12],r=await n`
        SELECT DISTINCT ON (curso_id) curso_id, pct_aprobados
        FROM indicadores
        WHERE anio = ${i} AND mes = ANY(${a}) AND pct_aprobados IS NOT NULL
        ORDER BY curso_id, mes DESC
      `,o=new Map(r.rows.map(e=>[e.curso_id,e])),u=e.map(e=>{let a=o.get(e.id)||null,r=a?parseFloat(a.pct_aprobados):null;return{curso_id:e.id,curso_nombre:e.nombre,pct_aprobados:r,puntaje_academico:null===r?0:r>=90?20:r>=80?15:r>=70?10:r>=60?6:2,tiene_datos:null!==r}}).sort((e,a)=>e.tiene_datos||a.tiene_datos?e.tiene_datos?a.tiene_datos?a.puntaje_academico-e.puntaje_academico:-1:1:0);return s.NextResponse.json({ranking:u,periodo:t,anio:i,modo:"periodo"})}let a=await n`
      SELECT curso_id,
        COUNT(*)::int as var_total,
        SUM(CASE WHEN resuelto = true THEN 1 ELSE 0 END)::int as var_resueltos
      FROM var_registros
      WHERE mes = ${r} AND anio = ${i}
      GROUP BY curso_id
    `,u=new Map(a.rows.map(e=>[e.curso_id,e])),E=await n`SELECT * FROM indicadores WHERE mes = ${r} AND anio = ${i}`,c=new Map(E.rows.map(e=>[e.curso_id,e])),d=await n`
      SELECT curso_id, SUM(puntos)::int as total_puntos, COUNT(*)::int as total_acciones
      FROM campo_positivo
      WHERE mes = ${r} AND anio = ${i}
      GROUP BY curso_id
    `,T=new Map(d.rows.map(e=>[e.curso_id,e])),l=e.map(e=>{let a=u.get(e.id)||null,o=c.get(e.id)||null,t=T.get(e.id)||null;return{...function(e){let a=40,r=0;if(e.tiene_var&&e.var_total>0){let i=e.var_total-e.var_resueltos;r=Math.round(e.var_resueltos/e.var_total*100),a-=2*e.var_resueltos,a-=5*i,a=Math.max(a,0)}let i=0;e.tiene_indicadores&&(null!==e.limpieza&&(i+=Math.round((e.limpieza-1)/4*14)),">95%"===e.uniforme?i+=14:"85-95%"===e.uniforme?i+=8:"<85%"===e.uniforme&&(i+=3),null!==e.asistencia&&(e.asistencia>=95?i+=12:e.asistencia>=85?i+=8:e.asistencia>=75?i+=5:i+=2));let o=Math.min(e.campo_bonus,20),t=Math.min(a+i+o,100);return{curso_id:e.curso_id,curso_nombre:e.curso_nombre,mes:e.mes,anio:e.anio,puntaje_resolutivo:Math.min(a,40),puntaje_formativo:Math.min(i,40),puntaje_campo:o,puntaje_academico:0,puntaje_total:t,pct_var_resueltos:r,tiene_datos:!0}}({curso_id:e.id,curso_nombre:e.nombre,mes:r,anio:i,tiene_var:!!a,tiene_indicadores:!!o,var_total:a?.var_total??0,var_resueltos:a?.var_resueltos??0,actas:o?.actas??0,ice_puntos:o?.ice_puntos??0,limpieza:o?.limpieza??null,uniforme:o?.uniforme??null,asistencia:o?.asistencia!==null&&o?.asistencia!==void 0?parseFloat(o.asistencia):null,pct_aprobados:null,campo_bonus:t?.total_puntos??0}),campo_acciones:t?.total_acciones??0}});return l.sort((e,a)=>a.puntaje_total-e.puntaje_total),s.NextResponse.json({ranking:l,mes:r,anio:i,modo:"mensual"})}catch(e){return console.error("Ranking error:",e),s.NextResponse.json({ranking:[],mes:r,anio:i,error:e.message})}}let l=new o.AppRouteRouteModule({definition:{kind:t.x.APP_ROUTE,page:"/api/ranking/route",pathname:"/api/ranking",filename:"route",bundlePath:"app/api/ranking/route"},resolvedPagePath:"C:\\Users\\juanp\\.gemini\\antigravity-ide\\scratch\\Convivencia-Videla\\app\\api\\ranking\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:A,serverHooks:N}=l,R="/api/ranking/route";function L(){return(0,n.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:A})}},9487:(e,a,r)=>{async function i(){if(!process.env.POSTGRES_URL)return null;try{return(await r.e(462).then(r.bind(r,28462))).sql}catch{return null}}async function o(){if(!process.env.POSTGRES_URL)return null;try{return(await r.e(462).then(r.bind(r,28462))).db}catch{return null}}async function t(){let e=await i();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS cursos (
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
  )`,await e`INSERT INTO configuracion (clave, valor) VALUES ('pin_vir', '1240') ON CONFLICT (clave) DO NOTHING`,{ok:!0}}async function n(){let e=await i();if(!e)throw Error("POSTGRES_URL no configurada.");return await e`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await e`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}r.d(a,{$C:()=>n,AH:()=>i,VK:()=>o,kF:()=>t})}};var a=require("../../../webpack-runtime.js");a.C(e);var r=e=>a(a.s=e),i=a.X(0,[948,972],()=>r(78630));module.exports=i})();