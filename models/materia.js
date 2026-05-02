const mongoose = require('mongoose');


const materiaSchema = new mongoose.Schema({

    codigo_materia: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    nombre_materia: { 
        type: String, 
        required: true,
        trim: true 
    },
    descripcion: { 
        type: String 
    },
    // Campos de organización académica 
    cod_carrera: { 
        type: String, 
        required: true 
    },
    cod_semestre: { 
        type: String, 
        required: true 
    },

    // Relación con el Profesor 
    profesor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profesor',
        required: true 
    },

    // El Horario (como objeto embebido para mayor velocidad)
    horario: [{
        dias_semana: { 
            type: String, 
            enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            required: true 
        },
        hora_inicio: { type: String, required: true }, // "07:00"
        hora_fin: { type: String, required: true },    // "09:15"
        seccion_grupo: { type: String, required: true }, // "I301"
        aula: { type: String, default: 'Por definir' }
    }],

    // Relación N:M con Estudiantes 
    estudiantes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Estudiante' 
    }],

    cupos_maximos: { 
        type: Number, 
        default: 30 
    }
}, { timestamps: true });

module.exports = mongoose.model('Materia', materiaSchema);