const materiaRouter = require("express").Router();
const Materia = require("../models/materia");
const { userExtractor } = require("../middleware/auth");

// Aplicamos el middleware para todas las rutas de este archivo
materiaRouter.use(userExtractor);

// --- OBTENER MATERIAS ---
materiaRouter.get("/", async (request, response) => {
  const user = request.user;
  const rol = request.rol; // Extraemos el rol del token

  if (rol === "profesor") {
    // El profesor ve solo las suyas
    const materias = await Materia.find({ profesor: request.user._id });
    return response.json(materias);
  } else {
    // El estudiante ve TODAS las materias disponibles para inscribirse
    // Usamos .populate para mostrar el nombre del profesor en lugar de solo su ID
    const materias = await Materia.find({}).populate("profesor", "nombre");
    return response.json(materias);
  }
});

// --- CREAR MATERIA (¡SOLO PROFESORES!) ---
materiaRouter.post("/", async (request, response) => {
  const user = request.user;
  const rol = request.rol;
  const body = request.body;

  // 1. Verificación de Rol
  if (rol !== "profesor") {
    return response
      .status(403)
      .json({ error: "Acceso denegado. Solo profesores crean materias." });
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
    cupos_maximos: body.cupos_maximos || 30,
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
materiaRouter.put("/:id/horario", async (request, response) => {
  const { id } = request.params; // El ID que viene en la URL
  const nuevoBloque = request.body; // Los datos del horario (dias_semana, horas, etc.)
  const materia = await Materia.findByIdAndUpdate(
    id,
    { $push: { horario: nuevoBloque } },
    { new: true },
  );
  response.json(materia);
});

// --- ELIMINAR MATERIA ---
materiaRouter.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Verificamos que el ID sea válido y eliminamos
    const materiaEliminada = await Materia.findByIdAndDelete(id);

    if (!materiaEliminada) {
      return response.status(404).json({ error: "La materia no existe" });
    }

    // Respondemos con un 204 (No Content) si todo salió bien
    response.status(204).end();
  } catch (error) {
    console.error("Error al eliminar materia:", error.message);
    response.status(400).json({ error: "ID de materia no válido" });
  }
});

// --- ELIMINAR UN BLOQUE DE HORARIO ESPECÍFICO ---
materiaRouter.delete("/:id/horario/:index", async (request, response) => {

  try {
    const { id, index } = request.params;
    const materia = await Materia.findById(id);

    if (!materia) {
      return response.status(404).json({ error: "Materia no encontrada" });
    }

    //  Eliminamos el elemento del array 'horario' usando el índice
    // .splice(posicion, cantidad_a_eliminar)
    materia.horario.splice(index, 1);

    // 3. Guardamos los cambios en MongoDB
    await materia.save();

    // 4. Respondemos con éxito (No Content)
    response.status(204).end();
  } catch (error) {
    console.error("Error al eliminar bloque:", error.message);
    response
      .status(400)
      .json({ error: "No se pudo eliminar el bloque de horario" });
  }
});

module.exports = materiaRouter;
