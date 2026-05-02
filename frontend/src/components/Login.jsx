import React, { useState } from 'react';
import Swal from 'sweetalert2';



const Login = ({ onLogin, irAHome, irARegistro, rolPredefinido = 'estudiante' }) => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Creamos el objeto con los datos exactos que espera tu loginRouter
  const datosLogin = {
    password: password,
    rol: rolPredefinido,
    // Usamos lógica simple para no enviar campos undefined
    [rolPredefinido === 'estudiante' ? 'cedula' : 'email']: identificador
  };

  console.log("Enviando a la API:", datosLogin); // Para que veas en consola qué sale

  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify(datosLogin)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en el servidor');
    }

    // Si llegamos aquí, el login fue exitoso
    onLogin({ ...data, rol: rolPredefinido });
    
    Swal.fire({
      icon: 'success',
      title: '¡Sesión Iniciada!',
      timer: 1500,
      showConfirmButton: false
    });

  } catch (error) {
    console.error("Error capturado:", error);
    Swal.fire('Error', error.message, 'error');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Botón Volver */}
      <button 
        onClick={irAHome} 
        className="absolute top-8 left-8 text-indigo-600 hover:underline font-bold flex items-center gap-2 transition-all hover:scale-105"
      >
        <span>←</span> Volver al Inicio
      </button>
      
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-indigo-900">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {rolPredefinido === 'estudiante' ? 'Portal Estudiantil' : 'Portal Docente'}
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Introduce tus datos para acceder</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {rolPredefinido === 'estudiante' ? 'Cédula de Identidad' : 'Correo Institucional'}
            </label>
            <input 
              type="text"
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder={rolPredefinido === 'estudiante' ? 'Ej: 30549520' : 'profesor@unexca.edu.ve'}
              onChange={(e) => setIdentificador(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contraseña</label>
            <input 
              type="password"
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg transform active:scale-95"
          >
            ENTRAR AL SISTEMA
          </button>

          {/* Sección de Registro para ambos roles */}
          <div className="mt-6 text-center border-t pt-6 border-gray-100">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes cuenta? <button 
              type="button" 
              onClick={irARegistro} 
              className="text-indigo-600 ml-2 font-bold hover:underline transition-colors"
              >
      Regístrate aquí
      </button>
  </p>
  </div> 
        </form>
      </div>
    </div>
  );
};

export default Login;