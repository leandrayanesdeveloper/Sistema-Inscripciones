const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const estudianteSchema = new mongoose.Schema({
    // Usamos los campos de tu DER
    nombre: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    cedula: { 
        type: String, 
        required: true, 
        unique: true 
    }, 

    passwordHash: { 
        type: String, 
        required: true 
    },

    verified: { 
        type: Boolean, 
        default: true
    },
    
    // Aquí es donde se guardan sus materias
    inscripciones: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inscripcion' // <--- Cambiado de 'Todo' a 'Inscripcion'
        }]
});

estudianteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; 
    }
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;