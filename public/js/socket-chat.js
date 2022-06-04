var socket = io();

var params = new URLSearchParams( window.location.search )
if(!params.has('nombre') || !params.has('sala')){
    window.location = "index.html";
    throw new Error('El nombre y sala son necesarios')
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get("sala")
}

socket.on('connect', function() {
    socket.emit('entrarChat', usuario, (resp) => {
        console.log(resp)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(data) {

    console.log('Servidor:', data);

});

//Escuhcar cambios de usuarios
socket.on('listaPersonasConectadas', function(data) {
    console.log('Personas conectadas actualmente', data);
})

//Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado', mensaje)
})