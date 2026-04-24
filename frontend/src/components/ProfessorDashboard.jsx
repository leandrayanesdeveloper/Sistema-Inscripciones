import React, { useState } from 'react';
// Importaremos los sub-componentes que crearemos luego
import ProfessorProfile from './professor-dashboard/ProfessorProfile';
import MySubjects from './professor-dashboard/MySubjects';
import StudentList from './professor-dashboard/StudentList';
import Swal from 'sweetalert2';
import axios from 'axios';


const ProfessorDashboard = ({ usuario, alCerrarSesion }) => {
  // Estado para saber qué pantalla mostrar en el contenido principal

  // Por defecto, mostramos "Perfil"
  const [seccionActual, setSeccionActual] = useState('perfil');

  // Función para renderizar el contenido dinámicamente
  const renderContenido = () => {
    switch (seccionActual) {
      case 'perfil':
        return <ProfessorProfile usuario={usuario} />;
      case 'materias':
        return <MySubjects />;
      case 'estudiantes':
        return <StudentList />;
      default:
        return <ProfessorProfile usuario={usuario} />;
    }
  };

  // Clases comunes para los botones del menú
  const linkClass = (seccion) => `
    block py-3 px-6 rounded-lg font-medium transition-colors
    ${seccionActual === seccion 
      ? 'bg-indigo-700 text-white' 
      : 'text-gray-200 hover:bg-indigo-800'
    }
  `;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. MENÚ LATERAL */}
      <aside className="w-64 bg-indigo-900 text-white p-6 shadow-xl flex flex-col">
        <div className="mb-10 text-xl font-bold border-b border-gray-600 pb-4">Panel del Docente</div>
        
        <nav className="space-y-3 flex-grow">
          <button 
            onClick={() => setSeccionActual('perfil')} 
            className={linkClass('perfil')}
          >
            Mi Perfil
          </button>
          
          <button 
            onClick={() => setSeccionActual('materias')} 
            className={linkClass('materias')}
          >
            Mis Materias
          </button>
          
          <button 
            onClick={() => setSeccionActual('estudiantes')} 
            className={linkClass('estudiantes')}
          >
            Estudiantes
          </button>
        </nav>

      </aside>

      {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {seccionActual === 'perfil' && 'Mi Perfil'}
            {seccionActual === 'materias' && 'Mis Materias'}
            {seccionActual === 'estudiantes' && 'Estudiantes'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{usuario?.nombre || 'Profesor'}</p>
              <p className="text-sm text-gray-500">{usuario?.email || 'unexca.edu.ve'}</p>
            </div>
            {/* Círculo para la foto (como en tu wireframe) */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-md">
              {usuario?.nombre?.substring(0,2).toUpperCase() || 'P'}
            </div>
          </div>
        </header>

        {/* Aquí se carga el componente seleccionado de forma dinámica */}
        {renderContenido()}
      </main>
    </div>
  );
};

export default ProfessorDashboard;