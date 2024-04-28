let paso=1;const pasoInicial=1,pasoFinal=3,cita={id:"",nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaSiguiente(),paginaAnterior(),consultarAPI(),idCliente(),nombreCliente(),seleccionarFecha(),seleccionarHora(),mostrarResumen()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");const t="#paso-"+paso;document.querySelector(t).classList.add("mostrar");const o=document.querySelector(".actual");o&&o.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",(function(e){paso=parseInt(e.target.dataset.paso),mostrarSeccion(),botonesPaginador()}))})}function botonesPaginador(){const e=document.querySelector("#anterior"),t=document.querySelector("#siguiente");1===paso?(e.classList.add("ocultar"),t.classList.remove("ocultar")):3===paso?(e.classList.remove("ocultar"),t.classList.add("ocultar"),mostrarResumen()):(e.classList.remove("ocultar"),t.classList.remove("ocultar")),mostrarSeccion()}function paginaAnterior(){document.querySelector("#anterior").addEventListener("click",(function(){paso<=1||(paso--,botonesPaginador())}))}function paginaSiguiente(){document.querySelector("#siguiente").addEventListener("click",(function(){paso>=3||(paso++,botonesPaginador())}))}async function consultarAPI(){try{const e="${location.origin}/api/servicios",t=await fetch(e);mostrarServicios(await t.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach(e=>{const{id:t,nombre:o,precio:n}=e,a=document.createElement("P");a.classList.add("nombre-servicio"),a.textContent=o;const c=document.createElement("P");c.classList.add("precio-servicio"),c.textContent="$ "+n;const i=document.createElement("DIV");i.classList.add("servicio"),i.dataset.idServicio=t,i.onclick=function(){seleccionarServicio(e)},i.appendChild(a),i.appendChild(c),document.querySelector("#servicios").appendChild(i)})}function seleccionarServicio(e){const{id:t}=e,{servicios:o}=cita,n=document.querySelector(`[data-id-servicio="${t}"]`);o.some(e=>e.id===t)?(cita.servicio=o.filter(e=>e.id!=t),n.classList.remove("seleccionado")):(cita.servicios=[...o,e],n.classList.add("seleccionado"))}function idCliente(){cita.id=document.querySelector("#id").value}function nombreCliente(){const e=document.querySelector("#nombre").value;cita.nombre=e}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value).getUTCDay();[6,0].includes(t)?(e.target.value="",mostrarAlerta("Fines de Semana NO PERMITIDO","error",".formulario")):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){const t=e.target.value,o=t.split(":")[0];o<10||o>18?(e.target.vale="",mostrarAlerta("Hora no Valida","error",".formulario")):cita.hora=t}))}function mostrarAlerta(e,t,o,n=!0){const a=document.querySelector(".alerta");a&&a.remove;const c=document.createElement("DIV");c.textContent=e,c.classList.add("alerta"),c.classList.add(t);document.querySelector(o).appendChild(c),n&&setTimeout(()=>{c.remove()},3e3)}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Hora no Faltyan datos de servicios","error",".contenido-resumen",!1);const{id:t,nombre:o,fecha:n,hora:a,servicios:c}=cita;headingServicios=document.createElement("H3"),headingServicios.textContent="Resumen de Servicios",e.appendChild(headingServicios),c.forEach(t=>{const{id:o,precio:n,nombre:a}=t,c=document.createElement("DIV");c.classList.add("contenedor-servicio");const i=document.createElement("P");i.textContent=a;const r=document.createElement("P");r.innerHTML="<span>Precio:</span> $"+n,c.appendChild(i),c.appendChild(r),e.appendChild(c)}),headingCita=document.createElement("H3"),headingCita.textContent="Resumen de Cita",e.appendChild(headingCita);const i=document.createElement("P");i.innerHTML="<span>Nombre:</span> "+o;const r=new Date(n),s=r.getMonth(),d=r.getDate()+2,l=r.getFullYear(),u=new Date(Date.UTC(l,s,d)).toLocaleDateString("es-CO",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),m=document.createElement("P");m.innerHTML="<span>Fecha:</span> "+u;const p=document.createElement("P");p.innerHTML="<span>Hora:</span> "+a;const v=document.createElement("BUTTON");v.classList.add("boton"),v.textContent="Reservar Cita",v.onclick=reservarCita,e.appendChild(i),e.appendChild(m),e.appendChild(p),e.appendChild(v)}async function reservarCita(){const{nombre:e,fecha:t,hora:o,servicios:n,id:a}=cita,c=n.map(e=>e.id);console.log(c);const i=new FormData;i.append("fecha",t),i.append("hora",o),i.append("usuarioId",a),i.append("servicios",c),console.log([...i]);try{const e="${location.origin}/api/citas",t=await fetch(e,{method:"POST",body:i});(await t.json()).resultado&&Swal.fire({icon:"success",title:"Cita Creada",text:"Su cita fué creada con éxito",button:"OK"}).then(()=>{setTimeout(()=>{window.location.reload()},3e3)})}catch(e){Swal.fire({icon:"error",title:"Error",text:"Hubo un Error al guardar la cita"})}}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));