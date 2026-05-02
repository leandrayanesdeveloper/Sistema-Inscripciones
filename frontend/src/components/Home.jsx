import React from 'react';
import Login from './Login';
import SignUp from './SignUpStudent';
import SignUpProfessor from './SignUpProfessor';
import StudentDashboard from './StudentDashboard';
import ProfessorDashboard from './ProfessorDashboard';


// Añadimos abrirLogin a las props
const Home = ({ abrirLogin, irARegistro }) => { 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 tracking-tighter">Bienvenido</h1>
        <p className="text-xl text-gray-600 italic">Sistema de Control de Estudios</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Opción Estudiantes */}
        <div className="border-2 border-blue-100 p-8 rounded-2xl hover:border-blue-500 transition shadow-lg text-center bg-gray-50">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Estudiantes</h2>
          <p className="text-gray-500 mb-6">Inscribe tus materias y gestiona tu expediente.</p>
          <button 
            onClick={() => abrirLogin('estudiante')} 
            className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition"
          >
            ENTRAR COMO ESTUDIANTE
          </button>
        </div>

        {/* Opción Profesores */}
        <div className="border-2 border-indigo-100 p-8 rounded-2xl hover:border-indigo-500 transition shadow-lg text-center bg-gray-50">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Profesores</h2>
          <p className="text-gray-500 mb-6">Gestiona tus secciones y carga de notas.</p>
          <button 
            onClick={() => abrirLogin('profesor')} 
            className="w-full bg-indigo-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
          >
            ENTRAR COMO PROFESOR
          </button>
        </div>
      </div>
    </div>
  );
};


export default Home;