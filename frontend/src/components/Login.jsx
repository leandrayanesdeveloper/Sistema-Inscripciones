import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.withCredentials = true;

// Añadimos irARegistro a las props que recibe el componente
const Login = ({ onLogin, irAHome, irARegistro, rolPredefinido = 'estudiante' }) => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const campo = rolPredefinido === 'estudiante' ? 'cedula' : 'email';
      
      const { data } = await axios.post('/api/login', {
        [campo]: identificador,
        password,
        rol: rolPredefinido
      });

      onLogin({ ...data, rol: rolPredefinido });
      
      Swal.fire({
        icon: 'success',
        title: '¡Sesión Iniciada!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Credenciales incorrectas', 'error');
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