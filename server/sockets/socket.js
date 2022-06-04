const { io } = require('../server');
const { Usuarios } = require('../class/usuarios');
const { crearMensaje } = require('../utils/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        
        console.log(data);
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                code: 4,
                msj: "el nombre/sala es necesario",
                data: []
            })
        }

        client.join(data.sala);

        let personas = usuarios.addPersona(client.id, data.nombre,data.sala);

        client.to(data.sala).emit('listaPersonasConectadas', usuarios.getPersonasSalas(data.sala));
        callback({
            error: false,
            msj: "Personas agregada correntamente",
            data: usuarios.getPersonasSalas(data.sala),
            code: 1
        });
    })

    client.on('crearMensaje',(data, callback) => {
        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.to(persona.sala).emit('crearMensaje', mensaje)
    })

    client.on('disconnect', () => {
        console.log('Id de cliente quien detono accion de deconexion: ', client.id)
        let personaBorrada = usuarios.deletePersonas(client.id);
        console.log('Persona borrada y Desconectada',personaBorrada);

        client.to(personaBorrada.sala).emit('crearMensaje', crearMensaje("Administrador", `${personaBorrada.nombre} salio ...`));
        client.to(personaBorrada.sala).emit('listaPersonasConectadas', usuarios.getPersonasSalas(personaBorrada.sala));
    })

    client.on('mensajePrivado', function(data) {
        let persona  = usuarios.getPersona(client.id)

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    })

});
