import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

axios.defaults.withCredentials = true;

const StudentDashboard = ({ usuario, alCerrarSesion }) => {
  const [seccionActual, setSeccionActual] = useState("perfil");
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [materiaExpandida, setMateriaExpandida] = useState(null);
  const [inscripcionConfirmada, setInscripcionConfirmada] = useState([]);

  const [perfilCompleto, setPerfilCompleto] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const tokenJSON = window.localStorage.getItem("loggedAppUser");
        if (!tokenJSON) return;
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(tokenJSON).token}` },
        };
        // Llamamos a la ruta /me que ya tiene el .populate() [3]
        const { data } = await axios.get("/api/perfil/me", config);
        setPerfilCompleto(data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };
    cargarPerfil();
  }, []);

  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const tokenJSON = window.localStorage.getItem("loggedAppUser");
        if (!tokenJSON) return;
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(tokenJSON).token}` },
        };

        const respuesta = await axios.get("/api/materias", config);
        setMateriasDisponibles(respuesta.data);
      } catch (error) {
        console.error("Error cargando materias:", error);
      }
    };
    cargarMaterias();
  }, []);

  const materiasAgrupadas = Object.values(
    materiasDisponibles.reduce((acc, materia) => {
      const clave = `${materia.codigo_materia}-${materia.nombre_materia}`;
      if (!acc[clave]) {
        acc[clave] = {
          codigo_materia: materia.codigo_materia,
          nombre_materia: materia.nombre_materia,
          cod_semestre: materia.cod_semestre,
          opciones: [],
        };
      }

      const opciones = (materia.horario || []).map((h, index) => ({
        ...h,
        materiaId: materia._id,
        nombreProfesor: materia.profesor?.nombre || "No asignado",
        opcionId: `${materia._id}-${h.seccion_grupo}-${h.dias_semana}-${h.hora_inicio}-${index}-${h.aula}`,
      }));

      acc[clave].opciones.push(...opciones);
      return acc;
    }, {}),
  );

  const intentarInscribir = (materiaAgrupada, opcion) => {
    if (
      materiasSeleccionadas.find(
        (m) => m.codigo_materia === materiaAgrupada.codigo_materia,
      )
    ) {
      Swal.fire("Atención", "Ya seleccionaste esta materia.", "info");
      return;
    }

    const choque = materiasSeleccionadas.find(
      (m) =>
        m.seleccion.dias_semana === opcion.dias_semana &&
        m.seleccion.hora_inicio < opcion.hora_fin &&
        m.seleccion.hora_fin > opcion.hora_inicio,
    );

    if (choque) {
      Swal.fire(
        "Choque de Horario",
        `Coincide con: ${choque.nombre_materia}`,
        "warning",
      );
      return;
    }

    setMateriasSeleccionadas([
      ...materiasSeleccionadas,
      {
        ...materiaAgrupada,
        _id: opcion.materiaId,
        seleccion: opcion,
      },
    ]);
  };

  const eliminarMateria = (codigo_materia) => {
    setMateriasSeleccionadas(
      materiasSeleccionadas.filter((m) => m.codigo_materia !== codigo_materia),
    );
  };

  const manejarConfirmacion = async () => {
    if (materiasSeleccionadas.length === 0) {
      Swal.fire("Error", "Selecciona al menos una materia.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar Inscripción?",
      text: "Se guardará tu registro permanente en el sistema.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, inscribirme",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await manejarConfirmacionFinal();
    }
  };

  const manejarConfirmacionFinal = async () => {
    try {
      for (const mat of materiasSeleccionadas) {
        const datos = {
          materiaId: mat._id,
          estudianteId: usuario?.id,
        };
        await axios.post("/api/inscripcion", datos);
      }

      setInscripcionConfirmada(materiasSeleccionadas);
      setMateriasSeleccionadas([]);
      setSeccionActual("comprobante");
      Swal.fire("¡Inscrito!", "Tu inscripción fue exitosa", "success");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema con la inscripción", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-700 text-white p-6 shadow-lg">
        <div className="mb-10 text-xl font-bold border-b border-gray-600 pb-4">
          Estudiante
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => setSeccionActual("perfil")}
            className={`block w-full text-left transition ${seccionActual === "perfil" ? "text-indigo-300 font-bold" : "hover:text-indigo-300"}`}
          >
            Mi Perfil
          </button>
          <button
            onClick={() => setSeccionActual("inscripcion")}
            className={`block w-full text-left transition ${seccionActual === "inscripcion" ? "text-indigo-300 font-bold" : "hover:text-indigo-300"}`}
          >
            Inscripción
          </button>
          <button
            onClick={() => setSeccionActual("comprobante")}
            className={`block w-full text-left transition ${seccionActual === "comprobante" ? "text-indigo-300 font-bold" : "hover:text-indigo-300"}`}
          >
            Comprobante
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {seccionActual === "perfil" && (
          <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Datos del Estudiante
            </h2>
            <div className="space-y-3 mb-8">
              <p className="bg-gray-50 p-3 rounded border">
                <strong>Nombre:</strong> {perfilCompleto?.nombre}
              </p>
              <p className="bg-gray-50 p-3 rounded border">
                <strong>Cédula:</strong> {perfilCompleto?.cedula}
              </p>
              <p className="bg-gray-50 p-3 rounded border">
                <strong>Correo:</strong> {perfilCompleto?.email}
              </p>
            </div>

            {/* SECCIÓN DE MATERIAS INSCRITAS */}
            <div className="mt-8">
              {usuario?.inscripciones?.length > 0 ? (
                usuario.inscripciones.map((ins, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 border rounded-lg mb-2 flex justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {ins.materia?.nombre_materia}
                      </p>
                      <p className="text-xs text-gray-500">
                        Periodo: {ins.periodoAcademico || "2026-1"}
                      </p>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                      CONFIRMADA
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-white-400 italic text-sm"></p>
              )}
            </div>
          </div>
        )}

        {seccionActual === "inscripcion" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Proceso de Inscripción
            </h2>

            <div className="grid gap-4">
              {materiasAgrupadas.map((materia) => (
                <div
                  key={`${materia.codigo_materia}-${materia.nombre_materia}`}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <button
                    onClick={() =>
                      setMateriaExpandida(
                        materiaExpandida === materia.codigo_materia
                          ? null
                          : materia.codigo_materia,
                      )
                    }
                    className="w-full p-4 text-left font-bold flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span>
                      ({materia.nombre_materia})
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        ({materia.cod_semestre})
                      </span>
                    </span>
                    <span className="text-indigo-600">
                      {materiaExpandida === materia.codigo_materia ? "▲" : "▼"}
                    </span>
                  </button>

                  {materiaExpandida === materia.codigo_materia && (
                    <div className="p-4 bg-white divide-y">
                      {materia.opciones.length > 0 ? (
                        materia.opciones.map((opcion) => (
                          <div
                            key={opcion.opcionId}
                            className="py-3 flex justify-between items-center hover:bg-indigo-50 px-2 transition rounded"
                          >
                            <div>
                              <p className="text-xs text-gray-500">
                                {" "}
                                Prof. {opcion.nombreProfesor} - Sec:{" "}
                                {opcion.seccion_grupo}{" "}
                              </p>
                              <p className="text-xs text-gray-500">
                                {opcion.dias_semana} | {opcion.hora_inicio} -{" "}
                                {opcion.hora_fin} | Aula: {opcion.aula}
                              </p>
                            </div>
                            <button
                              onClick={() => intentarInscribir(materia, opcion)}
                              className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700 shadow"
                            >
                              SELECCIONAR
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-red-500 text-sm italic p-2 text-center">
                          No hay horarios disponibles.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-md">
              <h3 className="font-bold mb-4 text-indigo-900 border-b pb-2">
                MATERIAS SELECCIONADAS
              </h3>
              {materiasSeleccionadas.length === 0 ? (
                <p className="text-gray-400 italic text-center py-4">
                  Haz clic en una materia para ver horarios y seleccionar.
                </p>
              ) : (
                <div className="space-y-4">
                  {materiasSeleccionadas.map((m) => (
                    <div
                      key={`${m.codigo_materia}-${m.seleccion.opcionId}`}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded border"
                    >
                      <div>
                        <p className="font-bold text-indigo-800">
                          {m.nombre_materia}
                        </p>
                        <p className="text-xs text-gray-600">
                          {m.seleccion.dias_semana} {m.seleccion.hora_inicio}-
                          {m.seleccion.hora_fin} - Prof.
                          {m.seleccion.nombreProfesor} | Sección:{" "}
                          {m.seleccion.seccion_grupo} | Aula:
                          {m.seleccion.aula}
                        </p>
                      </div>
                      <button
                        onClick={() => eliminarMateria(m.codigo_materia)}
                        className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                    <button
                      onClick={manejarConfirmacion}
                      className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-green-700 transition"
                    >
                      [ CONFIRMAR INSCRIPCIÓN ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {seccionActual === "comprobante" && (
          <div className="bg-white p-10 rounded shadow-2xl max-w-3xl mx-auto border-t-8 border-indigo-900">
            <div className="text-center mb-8">
              <h2 className="font-bold text-2xl uppercase tracking-tighter">
                Comprobante de Inscripción
              </h2>
              <p className="text-gray-400 text-xs">Universidad de Caracas</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 text-sm bg-gray-50 p-4 rounded">
              <p>
                <strong>Estudiante:</strong>{" "}
                {perfilCompleto?.nombre || "Leandra Yanes"}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Cédula:</strong> {perfilCompleto?.cedula}
              </p>
              <p>
                <strong>Carrera:</strong> Informática
              </p>
              <p>
                <strong>Periodo:</strong> 2026-I
              </p>
            </div>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 border">Materia</th>
                  <th className="p-3 border text-left">Profesor</th>
                  <th className="p-3 border">Sección</th>
                  <th className="p-3 border">Horario</th>
                  <th className="p-3 border">Aula</th>
                </tr>
              </thead>
              <tbody>
                {inscripcionConfirmada.map((m) => (
                  <tr key={`${m.codigo_materia}-${m.seleccion.opcionId}`}>
                    <td className="p-3 border">{m.nombre_materia}</td>
                    <td className="p-3 border">{m.seleccion.nombreProfesor}</td>
                    <td className="p-3 border text-center">
                      {m.seleccion.seccion_grupo}
                    </td>
                    <td className="p-3 border">
                      {m.seleccion.dias_semana} ({m.seleccion.hora_inicio} -{" "}
                      {m.seleccion.hora_fin})
                    </td>
                    <td className="p-3 border">{m.seleccion.aula}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => window.print()}
              className="mt-8 w-full bg-gray-800 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-black transition shadow-lg"
            >
              🖨️ Imprimir Comprobante (PDF)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
