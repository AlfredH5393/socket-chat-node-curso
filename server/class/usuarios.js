class Usuarios {

    constructor(){
        this.personas = [];
    }

    addPersona(id, nombre,sala) {
        let personas = { id, nombre, sala };
        this.personas.push(personas);
        return this.personas;
    }

    getPersona( id ){
        let persona = this.personas.filter( p => p.id === id );
        return persona[0];
    }

    getPersonas () {
        return this.personas
    }

    getPersonasSalas( sala ){
       return this.personas.filter(p => p.sala === sala)
    }

    deletePersonas(id){
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter( p =>  p.id != id )
        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}