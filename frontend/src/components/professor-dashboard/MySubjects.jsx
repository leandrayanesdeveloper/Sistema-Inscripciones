import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const MySubjects = () => {
  const [materias, setMaterias] = useState([]); // Aquí guardarás lo que traigas del back
  const [materiaActual, setMateriaActual] = useState({
    nombre_materia: '',
    codigo_materia: '',
    cod_carrera: 'INFORMATICA', // Por defecto 
    cod_semestre: '',
    cupos_maximos: 30
  });

  const [bloqueActual, setBloqueActual] = useState({
    dias_semana: '',
    hora_inicio: '',
    hora_fin: '',
    seccion_grupo: '',
    aula: ''
  });

  const [idDesplegado, setIdDesplegado] = useState(null);
  
  const materiasDePrueba = [
    { id_temp: 1, nombre_materia: 'MATEMÁTICA I', codigo_materia: 'MAT101', cod_carrera: 'INFORMATICA', cod_semestre: '1', horario: [] },
    { id_temp: 2, nombre_materia: 'PROGRAMACIÓN I', codigo_materia: 'PRG101', cod_carrera: 'INFORMATICA', cod_semestre: '1', horario: [] }
  ];
  // --- LÓGICA DE DETECCIÓN DE CHOQUE ---
  const verificarChoque = (nuevoBloque) => {
    return materias.some(m => 
      m.horario.some(h => 
        h.dias_semana === nuevoBloque.dias_semana && 
        ((nuevoBloque.hora_inicio >= h.hora_inicio && nuevoBloque.hora_inicio < h.hora_fin) || 
         (nuevoBloque.hora_fin > h.hora_inicio && nuevoBloque.hora_fin <= h.hora_fin))
      )
    );
  };

  // Crear la materia en el estado (Contenedor)
  const handleCrearMateria = (e) => {
    e.preventDefault();
    const nueva = { ...materiaActual, id_temp: Date.now(), horario: [] };
    setMaterias([...materias, nueva]);
    setMateriaActual({ nombre_materia: '', codigo_materia: '', cod_carrera: 'INFORMATICA', cod_semestre: '', cupos_maximos: 30 });
    Swal.fire('Contenedor Creado', 'Ahora despliega la materia para añadir horarios', 'success');
    
  const guardarEnDB = async () => {
    try {
  
      // Enviamos la "nueva" materia que acabas de crear arriba
      await axios.post('/api/materias', nueva, config);
      console.log("Guardado en MongoDB con éxito");
    } catch (error) {
      console.error("No se pudo guardar en la base de datos", error);
    }
  };
  guardarEnDB();
  };

  // Añadir un bloque de horario a una materia específica
 const añadirHorario = async (idMateria) => {
  // 1. Validaciones previas (como ya las tienes)
  if (!bloqueActual.dias_semana || !bloqueActual.hora_inicio || !bloqueActual.hora_fin || !bloqueActual.seccion_grupo) {
    Swal.fire('Error', 'Faltan datos del bloque', 'error');
    return;
  };

  if (verificarChoque(bloqueActual)) {
    Swal.fire('¡Choque de Horario!', 'Ya tienes una clase en ese bloque', 'error');
    return;
  };

  try {
    // Petición al servidor para guardar el bloque en la materia específica
     await axios.put(`/api/materias/${idMateria}/horario`, bloqueActual); 

    // Si el servidor responde bien, actualizamos la vista local
   setMaterias(materias.map(m => {
    if (m._id === idMateria) {
      return { ...m, horario: [...m.horario, { ...bloqueActual }] }; 
    }
    return m;
  }));

   // Limpieza: Reseteamos el formulario del bloque
  setBloqueActual({ dias_semana: '', hora_inicio: '', hora_fin: '', seccion_grupo: '', aula: '' }); 

} catch (error) {
  Swal.fire('Error', 'No se pudo guardar el horario', 'error');
}
};

  return (
    <div className="space-y-6">
      {/* FORMULARIO PARA CREAR MATERIA */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-indigo-900">
        <h3 className="font-bold text-gray-800 mb-4">Registrar Nueva Materia (UNEXCA)</h3>
        <form onSubmit={handleCrearMateria} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input className="p-3 border rounded-xl bg-gray-50" placeholder="Nombre (Ej: Redes)" value={materiaActual.nombre_materia} onChange={e => setMateriaActual({...materiaActual, nombre_materia: e.target.value})} required />
          <input className="p-3 border rounded-xl bg-gray-50" placeholder="Código (Ej: INF-101)" value={materiaActual.codigo_materia} onChange={e => setMateriaActual({...materiaActual, codigo_materia: e.target.value})} required />
          <input className="p-3 border rounded-xl bg-gray-50" placeholder="Semestre (Ej: Trayecto I)" value={materiaActual.cod_semestre} onChange={e => setMateriaActual({...materiaActual, cod_semestre: e.target.value})} required />
          <button type="submit" className="bg-indigo-900 text-white font-bold rounded-xl hover:bg-black transition-all">CREAR MATERIA</button>
        </form>
      </div>

      {/* LISTADO DE MATERIAS CON DESPLEGABLE */}
      <div className="space-y-4">
        {materias.map(m => (
          <div key={m.id_temp} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div 
              className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => setIdDesplegado(idDesplegado === m.id_temp ? null : m.id_temp)}
            >
              <div>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mr-3">{m.codigo_materia}</span>
                <span className="font-bold text-xl text-gray-800">{m.nombre_materia}</span>
              </div>
              <span className="text-2xl">{idDesplegado === m.id_temp ? '▲' : '▼'}</span>
            </div>

            {idDesplegado === m.id_temp && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                {/* Formulario de Bloque */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  <select className="p-2 border rounded-lg bg-white" value={bloqueActual.dias_semana} onChange={e => setBloqueActual({...bloqueActual, dias_semana: e.target.value})}>
                    <option value="">Día...</option>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input type="time" className="p-2 border rounded-lg" value={bloqueActual.hora_inicio} onChange={e => setBloqueActual({...bloqueActual, hora_inicio: e.target.value})} />
                  <input type="time" className="p-2 border rounded-lg" value={bloqueActual.hora_fin} onChange={e => setBloqueActual({...bloqueActual, hora_fin: e.target.value})} />
                  <input placeholder="Sección (I301)" className="p-2 border rounded-lg" value={bloqueActual.seccion_grupo} onChange={e => setBloqueActual({...bloqueActual, seccion_grupo: e.target.value})} />
                  <button onClick={() => añadirHorario(m.id_temp)} className="bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Añadir Bloque</button>
                </div>

                {/* Tabla de Horarios del Profesor */}
                <div className="space-y-3">
                  {m.horario.map((h, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                      <div className="flex gap-8 items-center">
                        <span className="font-black text-indigo-900 w-24">{h.dias_semana}</span>
                        <span className="text-gray-600 font-medium">{h.hora_inicio} - {h.hora_fin}</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-500">Sección: {h.seccion_grupo}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setMaterias(materias.map(mat => mat.id_temp === m.id_temp ? {...mat, horario: mat.horario.filter((_, i) => i !== index)} : mat))
                        }}
                        className="text-red-400 hover:text-red-600 font-bold"
                      >
                        ELIMINAR
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {materias.length > 0 && (
  <button 
    onClick={() => window.print()}
    className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 print:hidden"
  >
    <span className="text-xl">🖨️</span> 
    Generar Comprobante de Carga Académica
  </button>
)}
    </div>
    
  );
};

export default MySubjects;