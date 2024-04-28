let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id :'',
    nombre : '',
    fecha : '',
    hora : '',
    servicios: []
}


document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion();
    tabs(); //cambia de seccion cuando se presione lo tabs
    botonesPaginador(); //agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();
    
    consultarAPI(); //consulta la Api en el backend dee PHP 
    idCliente();
    nombreCliente();//añade le nombre del cliente al objeto de cita
    seleccionarFecha(); //añade la fecha al objeto de cita
    seleccionarHora(); //añade la hora al objeto de cita
    mostrarResumen(); //muestra resumen d ela cita


    
}

function mostrarSeccion(){
    //ocultyar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }    

    //seleccionar la seccion segun el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //quitar la clase actual a anterior
    const tabAnterior = document.querySelector(".actual");
    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }    


    //resalta el tab actuak
    const tab=document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add("actual");
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    }
    )
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");
    
    if (paso === 1){
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }else{
        if (paso === 3){
            paginaAnterior.classList.remove("ocultar");
            paginaSiguiente.classList.add("ocultar");
            mostrarResumen();
        }else{
            paginaAnterior.classList.remove("ocultar");
            paginaSiguiente.classList.remove("ocultar");

        }
    }
    mostrarSeccion();
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if (paso <= pasoInicial){
            return;
        }
        paso--;
        botonesPaginador();
    });
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if (paso >= pasoFinal){
            return;
        }
        paso++;
        botonesPaginador();
    });
}

async function consultarAPI(){
        try {
            const url = '${location.origin}/api/servicios';
            const resultado = await fetch(url);
            const servicios = await resultado.json();
            mostrarServicios(servicios);

        } catch (error) {
            console.log(error);
        }

}

function mostrarServicios(servicios ){
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent= nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent= `$ ${precio}`;

        const servicioDiv =document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

        
    }); 

}


function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios } = cita;

    //identificar el elemento que le da clik
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // comprobar si un servicio fue agregado o quitarlo

    if (servicios.some(agregado => agregado.id === id) ){
        // eliminarlo
        cita.servicio = servicios.filter(agregado => agregado.id != id);
        divServicio.classList.remove('seleccionado');    
    }else{
        //agregarlo
        cita.servicios= [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }

}


function idCliente(){
    cita.id =document.querySelector('#id').value;
}


function nombreCliente(){
    const nombre=document.querySelector('#nombre').value;
    cita.nombre = nombre;
    
}

function seleccionarFecha(){
    const inputFecha=document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e ){
        const dia = new Date(e.target.value).getUTCDay();
        if([6,0].includes(dia)){
            e.target.value = "";
            mostrarAlerta('Fines de Semana NO PERMITIDO', 'error', '.formulario');
            
        }else{
            cita.fecha = e.target.value;
        }
    
    })
}
function seleccionarHora(){
    const inputHora=document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if (hora < 10 || hora > 18){
            e.target.vale = "";
            mostrarAlerta("Hora no Valida", 'error', '.formulario');
        }else{
            cita.hora = horaCita;
            //mostrarAlerta(horaCita,'error', '.formulario');
        }
    })

}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);
    if (desaparece){
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}


function mostrarResumen(){

    const resumen = document.querySelector('.contenido-resumen');

    //limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }
    
    if (Object.values(cita).includes('') || cita.servicios.length === 0 ){
        mostrarAlerta("Hora no Faltyan datos de servicios", 'error', '.contenido-resumen', false);
        return;
    }

    //formatear el div del resumen
    const {id, nombre, fecha, hora, servicios} = cita;

    //headiung para servicios ene resumenr
    headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);
    

    //iterando y mostrando los servicios
    servicios.forEach(servicio=>{
        const {id, precio, nombre } = servicio; 

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent= nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;
        
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        resumen.appendChild(contenedorServicio);
    });

    //headiung para servicios ene resumenr
    headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;


    //formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = {weekday: 'long', year:'numeric', month:'long', day:'numeric' }
    const fechaformateada = fechaUTC.toLocaleDateString('es-CO', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaformateada}`;


    const   horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    //boton para crar uhna cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);

}

async function reservarCita(){
    /*
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '1111'
    })
    */
    
    const {nombre, fecha, hora, servicios, id}=cita;
    const idServicios = servicios.map(servicio => servicio.id);
    console.log(idServicios);

    const datos = new FormData();

    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
   
    console.log([...datos]);
    try {
    //peticion hacia la api
    const url = '${location.origin}/api/citas';    
        const respuesta = await fetch(url, {
        method : 'POST',
        body : datos
        });

  
        const resultado = await respuesta.json();
  /*
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '1111'
        })
*/


        if (resultado.resultado){
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Su cita fué creada con éxito',
                button: 'OK'
        
                }).then( () =>{
                    setTimeout(() => {
                        window.location.reload();    
                    }, 3000);
                    
            } )
        }
    
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un Error al guardar la cita'
        })        
    }
}
