const perfilRouter = require('express').Router();
const Estudiante = require('../models/estudiante');
const Profesor = require('../models/profesor');
const { userExtractor } = require('../middleware/auth');


// Esta ruta sirve para que el frontend obtenga los datos del usuario actual
perfilRouter.get('/me', userExtractor, async (request, response) => {
  try {
    const userId = request.user.id;
    const rol = request.rol;

  if (rol === 'estudiante') { 
    const estudiante = await Estudiante.findById(userId).populate({
      path: 'inscripciones', // [1] Nombre correcto del campo en el modelo Estudiante
      populate: {
        path: 'materia',     // [2] Nombre del campo dentro del modelo Inscripcion
        select: 'nombre_materia horario cod_semestre',
      }
    })

  if (!estudiante) {
    return response.status(404).json({ error: 'Estudiante no encontrado' });
  }
  return response.json(estudiante);
}

    if (rol === 'profesor') {
      const profesor = await Profesor.findById(userId).populate({
        path: 'materias',
        select: 'nombre_materia horario seccion_grupo cupos_maximos'
      });

      if (!profesor) {
        return response.status(404).json({ error: 'Profesor no encontrado' });
      }

      return response.json(profesor);
    }

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Error al obtener los datos del perfil' });
  }
});

module.exports = perfilRouter;