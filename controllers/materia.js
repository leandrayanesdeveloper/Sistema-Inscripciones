const materiaRouter = require('express').Router();
const Materia = require('../models/materia');
const { userExtractor } = require('../middleware/auth');

// Aplicamos el middleware para todas las rutas de este archivo
materiaRouter.use(userExtractor);

// --- OBTENER MATERIAS ---
materiaRouter.get('/', async (request, response) => {
    const user = request.user;
    const rol = request.rol; // Asumiendo que tu middleware extrae el rol

    if (rol === 'profesor') {
        const materias = await Materia.find({ profesor: user._id });
        return response.json(materias);
    } else {
        const materias = await Materia.find({ estudiantes: user._id });
        return response.json(materias);
    }
});

// --- CREAR MATERIA (¡SOLO PROFESORES!) ---
materiaRouter.post('/', async (request, response) => {
    const user = request.user;
    const rol = request.rol; 
    const body = request.body;

    // 1. Verificación de Rol
    if (rol !== 'profesor') {
        return response.status(403).json({ error: 'Acceso denegado. Solo profesores crean materias.' });
    }

    // 2. Creamos la instancia usando los nombres exactos de tu Modelo
    const nuevaMateria = new Materia({
        codigo_materia: body.codigo_materia,
        nombre_materia: body.nombre_materia,
        descripcion: body.descripcion,
        cod_carrera: body.cod_carrera,
        cod_semestre: body.cod_semestre,
        profesor: user._id, // ID extraído del token
        horario: body.horario, // El array de objetos [{dias_semana, hora_inicio, ...}]
        cupos_maximos: body.cupos_maximos || 30
    });

    try {
        // 3. Guardar en MongoDB
        const materiaGuardada = await nuevaMateria.save();
        response.status(201).json(materiaGuardada);
    } catch (error) {
        // Aquí verás si falta algún campo obligatorio
        console.error("Error al validar materia:", error.message);
        response.status(400).json({ error: error.message });
    }
});

module.exports = materiaRouter;