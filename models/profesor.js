// Importar las dependencias necesarias
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const profesorSchema = new mongoose.Schema({
    // Campos básicos de acceso (lo que usamos en el login)
    email: { 
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

    rol: { 
        type: String, 
        default: 'profesor' 
    },

    // Atributos específicos de tu DER
    nombre: { 
        type: String, 
        required: true 
    },
    cedula: { 
        type: String, 
        required: true, 
        unique: true 
    },
    num_telefono: { 
        type: String 
    },
    titulo_profesional: { 
        type: String, 
        required: false 
    }, // Ej: "Ingeniero de Sistemas"
    
    // Cupos máximos de gestión que definiste
    cupos_maximos: { 
        type: Number, 
        default: 30 
    },

    // Relación con las materias que dicta
    materias: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Materia' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Profesor', profesorSchema);