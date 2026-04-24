import React from 'react';

const ProfessorProfile = ({ usuario }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mi Información Personal</h2>
          <p className="text-gray-500">Gestiona tus datos de contacto y académicos</p>
        </div>
        <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition">
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
          <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">{usuario?.nombre || 'Profesor UNEXCA'}</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Cédula</label>
          <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">{usuario?.cedula || 'V-00000000'}</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Correo Institucional</label>
          <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">{usuario?.email}</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Título Académico</label>
          <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">Ingeniero en Informática</p>
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Teléfono de Contacto</label>
          <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">+58 412-0000000</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfile;