const mongoose = require("mongoose");

const inscripcionSchema = new mongoose.Schema({
  estudiante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Estudiante",
    required: true,
  },
  materia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Materia",
    required: true,
  },
  fechaInscripcion: {
    type: Date,
    default: Date.now, // Esto genera automáticamente la marca de tiempo
  },
  periodoAcademico: {
    type: String,
    default: "2026-1", // Útil para filtros históricos
  },
});

module.exports = mongoose.model("Inscripcion", inscripcionSchema);
