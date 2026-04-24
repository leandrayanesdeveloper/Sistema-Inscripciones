import React from 'react';

const StudentList = () => {
  const estudiante = [
    { id: 1, nombre: 'Juan Pérez', cedula: '28.123.456', seccion: '302' },
    { id: 2, nombre: 'Maria Silva', cedula: '29.987.654', seccion: '302' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-bold text-gray-600">Nombre</th>
            <th className="p-4 font-bold text-gray-600">Cédula</th>
            <th className="p-4 font-bold text-gray-600">Sección</th>
            <th className="p-4 font-bold text-gray-600">Acción</th>
          </tr>
        </thead>
        <tbody>
          {estudiante.map(e => (
            <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="p-4">{e.nombre}</td>
              <td className="p-4">{e.cedula}</td>
              <td className="p-4">{e.seccion}</td>
              <td className="p-4">
                <button className="text-indigo-600 font-bold hover:underline">Ver Notas</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;