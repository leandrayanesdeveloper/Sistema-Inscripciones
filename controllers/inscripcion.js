const inscripcionRouter = require("express").Router();
const Estudiante = require("../models/estudiante");
const Materia = require("../models/materia");
const Inscripcion = require("../models/inscripcion");
const { userExtractor } = require("../middleware/auth");

inscripcionRouter.use(userExtractor);

inscripcionRouter.post("/", async (request, response) => {
  const user = request.user;
  const materiaId =
    request.body.materiaId || request.body.id || request.body._id;
  if (request.rol !== "estudiante") {
    return response
      .status(403)
      .json({ error: "Solo los estudiantes pueden inscribir" });
  }

  try {
    const materia = await Materia.findById(materiaId);
    if (!materiaId) {
      return response
        .status(400)
        .json({ error: "No se proporcionó un ID de materia" });
    }

    // Verificar que la materia exista
    if (user.inscripciones?.some((id) => id.toString() === materiaId)) {
      return response
        .status(400)
        .json({ error: "Ya estás inscrito en esta materia" });
    }
    const nuevaInscripcion = new Inscripcion({
      estudiante: user._id,
      materia: materiaId,
    });
    const inscripcionGuardada = await nuevaInscripcion.save();

    await inscripcionGuardada.populate("materia");

    // Guardamos el ID de la INSCRIPCIÓN en el usuario
    user.inscripciones.push(inscripcionGuardada._id);
    await user.save();

    return response.status(201).json({
      mensaje: "Inscripción exitosa",
      materia: inscripcionGuardada.materia.nombre_materia,
      detalles: inscripcionGuardada.materia,
    });
  } catch (error) {
    return response
      .status(400)
      .json({ error: "ID de materia no válido o error de servidor" });
  }
});
module.exports = inscripcionRouter;
