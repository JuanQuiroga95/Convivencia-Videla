"use strict";(()=>{var a={};a.id=971,a.ids=[971],a.modules={20399:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:a=>{a.exports=require("buffer")},6113:a=>{a.exports=require("crypto")},82361:a=>{a.exports=require("events")},57147:a=>{a.exports=require("fs")},13685:a=>{a.exports=require("http")},95687:a=>{a.exports=require("https")},41808:a=>{a.exports=require("net")},22037:a=>{a.exports=require("os")},71017:a=>{a.exports=require("path")},12781:a=>{a.exports=require("stream")},24404:a=>{a.exports=require("tls")},57310:a=>{a.exports=require("url")},15206:a=>{a.exports=require("zlib")},3169:(a,i,e)=>{e.r(i),e.d(i,{originalPathname:()=>D,patchFetch:()=>f,requestAsyncStorage:()=>v,routeModule:()=>b,serverHooks:()=>I,staticGenerationAsyncStorage:()=>O});var o={};e.r(o),e.d(o,{DELETE:()=>L,POST:()=>N,dynamic:()=>p,revalidate:()=>_});var r=e(49303),t=e(88716),c=e(60670),s=e(87070),n=e(9487);let p="force-dynamic",_=0,u=[3,4],l=[{categoria_id:"pares",tipo:"Conflicto verbal entre estudiantes",reparacion:"Disculpa expl\xedcita"},{categoria_id:"pares",tipo:"Hostigamiento (burla, provocaci\xf3n, empujones)",reparacion:"Reflexi\xf3n guiada"},{categoria_id:"pares",tipo:"Esconder materiales de estudio",reparacion:"Acci\xf3n reparadora concreta"},{categoria_id:"docente",tipo:"Desobediencia a indicaciones",reparacion:"Reflexi\xf3n guiada"},{categoria_id:"docente",tipo:"Respuesta verbal inadecuada",reparacion:"Disculpa expl\xedcita"},{categoria_id:"entorno",tipo:"Desorden del espacio de trabajo",reparacion:"Acci\xf3n reparadora concreta"},{categoria_id:"entorno",tipo:"Suciedad del espacio",reparacion:"Acci\xf3n reparadora concreta"},{categoria_id:"entorno",tipo:"Intervenci\xf3n sobre superficies (rayar, pintar)",reparacion:"Acci\xf3n reparadora concreta"},{categoria_id:"clase",tipo:"Uso indebido del celular",reparacion:"Reflexi\xf3n guiada"},{categoria_id:"clase",tipo:"Interrupci\xf3n reiterada de la clase",reparacion:"Disculpa expl\xedcita"},{categoria_id:"clase",tipo:"Ingreso tard\xedo al aula (posterior al timbre)",reparacion:"Reflexi\xf3n guiada"}],d=["Preceptor/a","Docente","SOE"],m=[{tipo:"Participaci\xf3n en actos escolares",desc:"Participaci\xf3n destacada en el acto conmemorativo institucional"},{tipo:"Representaci\xf3n institucional en actividades externas",desc:"Representaron a la escuela en olimp\xedadas intercolegiales"},{tipo:"Proyecto solidario",desc:"Organizaron una colecta de \xfatiles escolares para donaci\xf3n"},{tipo:"Producci\xf3n institucional (flyer, campa\xf1a, streaming)",desc:"Dise\xf1aron flyers para la campa\xf1a de concientizaci\xf3n ambiental"},{tipo:"Propuesta del curso (ej: d\xeda del ni\xf1o, actividad interna)",desc:"Organizaron actividad recreativa de integraci\xf3n con 1er a\xf1o"}],E=["Mar\xeda Gonz\xe1lez","Carlos P\xe9rez","Laura S\xe1nchez","Roberto D\xedaz","Alejandra L\xf3pez","Mart\xedn Fern\xe1ndez","Claudia Romero","Diego Morales"],T=["Ana Mart\xednez","Luis Torres","Patricia Vega","Hern\xe1n Su\xe1rez","Silvina Castro","Facundo R\xedos","Ver\xf3nica Molina"],R=[{vir_count:2,vir_count_abril:1,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:97,actas:0,ice:0,campo_pts_marzo:8,campo_pts_abril:6,pct_aprobados:92},{vir_count:4,vir_count_abril:3,resolucion_pct:75,limpieza:4,uniforme:">95%",asistencia:91,actas:1,ice:3,campo_pts_marzo:0,campo_pts_abril:4,pct_aprobados:85},{vir_count:6,vir_count_abril:4,resolucion_pct:67,limpieza:3,uniforme:"85-95%",asistencia:86,actas:1,ice:5,campo_pts_marzo:6,campo_pts_abril:0,pct_aprobados:78},{vir_count:3,vir_count_abril:2,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:95,actas:0,ice:0,campo_pts_marzo:10,campo_pts_abril:8,pct_aprobados:90},{vir_count:8,vir_count_abril:5,resolucion_pct:50,limpieza:2,uniforme:"<85%",asistencia:79,actas:2,ice:8,campo_pts_marzo:0,campo_pts_abril:0,pct_aprobados:65},{vir_count:3,vir_count_abril:2,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:96,actas:0,ice:0,campo_pts_marzo:8,campo_pts_abril:10,pct_aprobados:88},{vir_count:5,vir_count_abril:3,resolucion_pct:80,limpieza:4,uniforme:"85-95%",asistencia:89,actas:1,ice:4,campo_pts_marzo:4,campo_pts_abril:6,pct_aprobados:82},{vir_count:7,vir_count_abril:6,resolucion_pct:57,limpieza:2,uniforme:"<85%",asistencia:81,actas:2,ice:7,campo_pts_marzo:0,campo_pts_abril:0,pct_aprobados:70},{vir_count:2,vir_count_abril:1,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:98,actas:0,ice:0,campo_pts_marzo:10,campo_pts_abril:8,pct_aprobados:95},{vir_count:4,vir_count_abril:3,resolucion_pct:75,limpieza:3,uniforme:"85-95%",asistencia:87,actas:1,ice:5,campo_pts_marzo:6,campo_pts_abril:4,pct_aprobados:76},{vir_count:3,vir_count_abril:2,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:94,actas:0,ice:0,campo_pts_marzo:8,campo_pts_abril:6,pct_aprobados:87},{vir_count:6,vir_count_abril:4,resolucion_pct:67,limpieza:3,uniforme:"85-95%",asistencia:85,actas:2,ice:6,campo_pts_marzo:0,campo_pts_abril:4,pct_aprobados:73},{vir_count:2,vir_count_abril:1,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:97,actas:0,ice:0,campo_pts_marzo:10,campo_pts_abril:8,pct_aprobados:91},{vir_count:9,vir_count_abril:6,resolucion_pct:44,limpieza:1,uniforme:"<85%",asistencia:74,actas:3,ice:12,campo_pts_marzo:0,campo_pts_abril:0,pct_aprobados:58},{vir_count:4,vir_count_abril:3,resolucion_pct:75,limpieza:4,uniforme:"85-95%",asistencia:90,actas:1,ice:3,campo_pts_marzo:6,campo_pts_abril:8,pct_aprobados:83},{vir_count:3,vir_count_abril:2,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:95,actas:0,ice:0,campo_pts_marzo:8,campo_pts_abril:10,pct_aprobados:89},{vir_count:5,vir_count_abril:4,resolucion_pct:80,limpieza:3,uniforme:"85-95%",asistencia:88,actas:1,ice:5,campo_pts_marzo:4,campo_pts_abril:6,pct_aprobados:79},{vir_count:4,vir_count_abril:2,resolucion_pct:75,limpieza:4,uniforme:"85-95%",asistencia:91,actas:1,ice:4,campo_pts_marzo:6,campo_pts_abril:4,pct_aprobados:84},{vir_count:7,vir_count_abril:5,resolucion_pct:57,limpieza:2,uniforme:"<85%",asistencia:80,actas:2,ice:9,campo_pts_marzo:0,campo_pts_abril:0,pct_aprobados:67},{vir_count:2,vir_count_abril:1,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:96,actas:0,ice:0,campo_pts_marzo:8,campo_pts_abril:6,pct_aprobados:93},{vir_count:4,vir_count_abril:3,resolucion_pct:75,limpieza:4,uniforme:">95%",asistencia:92,actas:0,ice:2,campo_pts_marzo:6,campo_pts_abril:8,pct_aprobados:86},{vir_count:6,vir_count_abril:4,resolucion_pct:67,limpieza:3,uniforme:"85-95%",asistencia:84,actas:1,ice:6,campo_pts_marzo:4,campo_pts_abril:0,pct_aprobados:74},{vir_count:3,vir_count_abril:2,resolucion_pct:100,limpieza:5,uniforme:">95%",asistencia:95,actas:0,ice:0,campo_pts_marzo:10,campo_pts_abril:8,pct_aprobados:90}];function A(a){return a[Math.floor(Math.random()*a.length)]}async function N(){let a=await (0,n.AH)();if(!a)return s.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{let i=(await a`SELECT * FROM cursos ORDER BY anio, division`).rows;if(0===i.length)return s.NextResponse.json({ok:!1,error:"No hay cursos. Ejecut\xe1 Setup primero."},{status:400});await a`DELETE FROM var_registros    WHERE anio = ${2026} AND mes = ANY(${u})`,await a`DELETE FROM indicadores      WHERE anio = ${2026} AND mes = ANY(${u})`,await a`DELETE FROM campo_positivo   WHERE anio = ${2026} AND mes = ANY(${u})`;let e=0,o=0,r=0;for(let t=0;t<i.length;t++){let c=i[t],s=R[t]||R[0];for(let i of u){let n=4===i,p=n?s.vir_count_abril:s.vir_count,_=s.resolucion_pct/100;for(let o=0;o<p;o++){let r=l[o%l.length],t=o<Math.round(p*_),s=A(d),n=A(T),u=5+3*o%20;await a`
            INSERT INTO var_registros
              (curso_id, categoria_id, tipo_situacion, resuelto, tipo_reparacion, intervino, nombre_activador, mes, anio, created_at)
            VALUES (
              ${c.id}, ${r.categoria_id}, ${r.tipo},
              ${t}, ${t?r.reparacion:null},
              ${s}, ${n},
              ${i}, ${2026},
              ${new Date(2026,i-1,u).toISOString()}
            )
          `,e++}await a`
          INSERT INTO indicadores
            (curso_id, mes, anio, limpieza, uniforme, asistencia, actas, ice_puntos, interv_tempranas, situaciones_previas, updated_at)
          VALUES (
            ${c.id}, ${i}, ${2026},
            ${s.limpieza}, ${s.uniforme}, ${s.asistencia},
            ${s.actas}, ${s.ice}, 0, 0, NOW()
          )
          ON CONFLICT (curso_id, mes, anio) DO UPDATE SET
            limpieza = EXCLUDED.limpieza, uniforme = EXCLUDED.uniforme,
            asistencia = EXCLUDED.asistencia, actas = EXCLUDED.actas,
            ice_puntos = EXCLUDED.ice_puntos, updated_at = NOW()
        `,o++,await a`
          UPDATE indicadores SET pct_aprobados = ${s.pct_aprobados}
          WHERE curso_id = ${c.id} AND mes = ${i} AND anio = ${2026}
        `;let u=n?s.campo_pts_abril:s.campo_pts_marzo;if(u>0){let e=m[(t+i)%m.length],o=A(E),s=10+t%12;await a`
            INSERT INTO campo_positivo
              (curso_id, tipo_accion, descripcion, puntos, fecha, mes, anio, nombre_docente)
            VALUES (
              ${c.id}, ${e.tipo}, ${e.desc},
              ${u},
              ${new Date(2026,i-1,s).toISOString().split("T")[0]},
              ${i}, ${2026}, ${o}
            )
          `,r++}}}return s.NextResponse.json({ok:!0,message:`Demo cargado: ${e} VIR \xb7 ${o} indicadores \xb7 ${r} aportes (Marzo y Abril 2026)`})}catch(a){return console.error("Demo error:",a),s.NextResponse.json({ok:!1,error:a.message},{status:500})}}async function L(){let a=await (0,n.AH)();if(!a)return s.NextResponse.json({ok:!1,error:"Base de datos no configurada."},{status:503});try{return await a`DELETE FROM var_registros    WHERE anio = ${2026} AND mes = ANY(${u})`,await a`DELETE FROM indicadores      WHERE anio = ${2026} AND mes = ANY(${u})`,await a`DELETE FROM campo_positivo   WHERE anio = ${2026} AND mes = ANY(${u})`,s.NextResponse.json({ok:!0,message:"Datos demo eliminados correctamente."})}catch(a){return s.NextResponse.json({ok:!1,error:a.message},{status:500})}}let b=new r.AppRouteRouteModule({definition:{kind:t.x.APP_ROUTE,page:"/api/demo/route",pathname:"/api/demo",filename:"route",bundlePath:"app/api/demo/route"},resolvedPagePath:"C:\\Users\\Docente\\Desktop\\Proyectos\\videla\\Convivencia-Videla-push\\app\\api\\demo\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:v,staticGenerationAsyncStorage:O,serverHooks:I}=b,D="/api/demo/route";function f(){return(0,c.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:O})}},9487:(a,i,e)=>{async function o(){if(!process.env.POSTGRES_URL)return null;try{return(await e.e(462).then(e.bind(e,28462))).sql}catch{return null}}async function r(){if(!process.env.POSTGRES_URL)return null;try{return(await e.e(462).then(e.bind(e,28462))).db}catch{return null}}async function t(){let a=await o();if(!a)throw Error("POSTGRES_URL no configurada.");return await a`CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    division VARCHAR(5) NOT NULL,
    anio INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await a`INSERT INTO cursos (nombre, division, anio) VALUES
    ('1°1°', '1', 1), ('1°2°', '2', 1), ('1°3°', '3', 1), ('1°4°', '4', 1), ('1°5°', '5', 1),
    ('2°1°', '1', 2), ('2°2°', '2', 2), ('2°3°', '3', 2), ('2°4°', '4', 2), ('2°5°', '5', 2),
    ('3°1°', '1', 3), ('3°2°', '2', 3), ('3°3°', '3', 3), ('3°4°', '4', 3), ('3°5°', '5', 3),
    ('4°1°', '1', 4), ('4°2°', '2', 4), ('4°3°', '3', 4), ('4°4°', '4', 4),
    ('5°1°', '1', 5), ('5°2°', '2', 5), ('5°3°', '3', 5), ('5°4°', '4', 5)
    ON CONFLICT (nombre) DO NOTHING`,await a`CREATE TABLE IF NOT EXISTS var_registros (
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
  )`,await a`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS categoria_id VARCHAR(50)`,await a`ALTER TABLE var_registros ADD COLUMN IF NOT EXISTS nombre_activador VARCHAR(150)`,await a`CREATE TABLE IF NOT EXISTS indicadores (
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
  )`,await a`ALTER TABLE indicadores ADD COLUMN IF NOT EXISTS interv_tempranas INTEGER DEFAULT 0`,await a`ALTER TABLE indicadores ADD COLUMN IF NOT EXISTS situaciones_previas INTEGER DEFAULT 0`,await a`ALTER TABLE indicadores ADD COLUMN IF NOT EXISTS asistencia DECIMAL(5,2)`,await a`CREATE TABLE IF NOT EXISTS campo_positivo (
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
  )`,{ok:!0}}async function c(){let a=await o();if(!a)throw Error("POSTGRES_URL no configurada.");return await a`CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'operativo',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`,await a`INSERT INTO usuarios (nombre, usuario, password, rol)
    VALUES ('Administrador', 'Videla.4012', 'VirVidela4012', 'admin')
    ON CONFLICT (usuario) DO NOTHING`,{ok:!0}}e.d(i,{$C:()=>c,AH:()=>o,VK:()=>r,kF:()=>t})}};var i=require("../../../webpack-runtime.js");i.C(a);var e=a=>i(i.s=a),o=i.X(0,[948,972],()=>e(3169));module.exports=o})();