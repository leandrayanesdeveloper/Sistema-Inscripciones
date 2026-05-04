const materiaRouter = require('express').Router();
const Materia = require('../models/materia');
const { userExtractor } = require('../middleware/auth');

// Aplicamos el middleware para todas las rutas de este archivo
materiaRouter.use(userExtractor);

// --- OBTENER MATERIAS ---
materiaRouter.get('/', async (request, response) => {
    const user = request.user;
    const rol = request.rol; // Extraemos el rol del token

    if (rol === 'profesor') {
        // El profesor ve solo las suyas
        const materias = await Materia.find({ profesor: request.user._id });
        return response.json(materias);
    } else {
        // El estudiante ve TODAS las materias disponibles para inscribirse
        // Usamos .populate para mostrar el nombre del profesor en lugar de solo su ID
        const materias = await Materia.find({}).populate('profesor', 'nombre'); 
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
        // si falta algún campo obligatorio
        console.error("Error al validar materia:", error.message);
        response.status(400).json({ error: error.message });
    }
});
 
// --- AÑADIR HORARIO A MATERIA EXISTENTE ---
materiaRouter.put('/:id/horario', async (request, response) => {
  const { id } = request.params; // El ID que viene en la URL
  const nuevoBloque = request.body; // Los datos del horario (dias_semana, horas, etc.)

  try {
    // Usamos $push para agregar el objeto al array 'horario' 
    const materiaActualizada = await Materia.findByIdAndUpdate(
      id,
      { $push: { horario: nuevoBloque } },
      { new: true, runValidators: true }
    );

    if (!materiaActualizada) {
      return response.status(404).json({ error: 'Materia no encontrada' });
    }

    response.json(materiaActualizada);
  } catch (error) {
    console.error("Error al actualizar horario:", error.message);
    response.status(400).json({ error: 'No se pudo añadir el horario' });
  }
});


module.exports = materiaRouter;