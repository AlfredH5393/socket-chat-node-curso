let divUsuarios = $("#divUsuarios");
let formEnviar = $("#formEnviar");
let txtMensaje = $("#txtMensaje");
let divChatbox = $("#divChatbox");

let parameterUrl = new URLSearchParams(window.location.search);
let nombre = parameterUrl.get("nombre")
let sala = parameterUrl.get("sala")

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function buidlUserList(personas) {
    // console.log(personas);
    let html = ""
    html += `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${parameterUrl.get("sala")} </span></a>
            </li>`

    for (let persona of personas.data) {
        html += `<li>
                    <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>
                </li>`
    }

    divUsuarios.html(html)
}

//Listerners
divUsuarios.on('click', 'a', function () {
    var id = $(this).data(id)
    if (Object.entries(id).length > 0) {
        console.log(id.id);
    }
})

function buildMensajes(mensaje,yo) {
    let html = "";
    let fecha = new Date(mensaje.fecha);
    let hora = `${fecha.getHours()}:${fecha.getMinutes()}`;
    var adminClass = 'info'
    if(mensaje.nombre === "Administrador")
        adminClass = "danger"

    if(yo){
        html += `<li class="reverse">
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                    <div class="chat-time">${hora}</div>
                </li>`
    }else{
        html += `<li class="animated fadIn">
                   ${mensaje.nombre === "Administrador" ? "": `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`}  
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-time">${hora}</div>
                </li>`
    }
    
    
    divChatbox.append(html);
}

formEnviar.on('submit', function (e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    console.log(txtMensaje.val())
    socket.emit('crearMensaje', {
        nombre,
        sala,
        mensaje: txtMensaje.val().trim()
    }, function (mensaje) {
        console.log('respuesta server: ', mensaje);
        txtMensaje.val("").focus();
        buildMensajes(mensaje,true)
        scrollBottom()
    });
})

