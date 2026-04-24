import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.withCredentials = true;

const SignUpProfessor = ({ alFinalizar, irALogin, irAHome }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        titulo: '',
        email: '',
        carrera: 'Informática', // Valor inicial
        password: '',
        match: ''
    });

    const VALIDATIONS = {
        CEDULA: /^[0-9]{7,9}$/,
        NAME: /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/,
        EMAIL: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/
    };

    const isNameValid = VALIDATIONS.NAME.test(formData.nombre);
    const isCedulaValid = VALIDATIONS.CEDULA.test(formData.cedula);
    const isEmailValid = VALIDATIONS.EMAIL.test(formData.email);
    const isPasswordValid = VALIDATIONS.PASSWORD.test(formData.password);
    const isMatchValid = formData.password === formData.match && formData.match !== '';
    const isFormValid = isNameValid && isCedulaValid && isEmailValid && isPasswordValid && isMatchValid;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = {
                nombre: formData.nombre,
                cedula: formData.cedula,
                email: formData.email,
                titulo_profesional: formData.titulo,
                carrera: formData.carrera,
                password: formData.password,
                rol: 'profesor'
            };

            await axios.post('/api/signup', newUser);
            Swal.fire('¡Éxito!', 'Profesor registrado correctamente', 'success');

            setTimeout(() => {
                irALogin(); 
            }, 2000);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Error al registrar', 'error');
        }
    };

    const getInputClass = (isValid, value) => {
        const baseClass = "w-full mb-3 p-3 border rounded-xl outline-none transition-all ";
        if (value === "") return baseClass + "focus:border-indigo-700 bg-gray-50";
        return baseClass + (isValid ? "border-green-500 ring-2 ring-green-100" : "border-red-500 ring-2 ring-red-100");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <button 
                onClick={irAHome} 
                className="absolute top-5 left-5 text-gray-500 hover:text-indigo-600 flex items-center gap-2 font-bold"
            >
                <span>←</span> Volver al Inicio
            </button>

            <form onSubmit={handleSubmit} className="max-w-lg w-full p-8 bg-white shadow-2xl rounded-2xl border-t-8 border-indigo-600">
                <h2 className="text-2xl font-bold mb-6 text-indigo-900 text-center uppercase tracking-tight">Registro de Docente</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input 
                        name="nombre" placeholder="Nombre y Apellido" 
                        className={getInputClass(isNameValid, formData.nombre)}
                        onChange={handleChange} value={formData.nombre}
                    />
                    <input 
                        name="cedula" placeholder="Cédula" 
                        className={getInputClass(isCedulaValid, formData.cedula)}
                        onChange={handleChange} value={formData.cedula}
                    />
                </div>

                <input 
                    name="titulo" placeholder="Título Académico (Ej: Ing. en Informática)" 
                    className="w-full mb-3 p-3 border rounded-xl outline-none bg-gray-50 focus:border-indigo-700"
                    onChange={handleChange} value={formData.titulo}
                />

                <select 
                    name="carrera" 
                    className="w-full mb-3 p-3 border rounded-xl outline-none bg-gray-50"
                    onChange={handleChange} value={formData.carrera}
                >
                    <option value="Informática">Informática</option>
                    <option value="Administración">Administración</option>
                    <option value="Contaduría">Contaduría</option>
                </select>

                <input 
                    name="email" placeholder="Correo Institucional" 
                    className={getInputClass(isEmailValid, formData.email)}
                    onChange={handleChange} value={formData.email}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input 
                        type="password" name="password" placeholder="Contraseña" 
                        className={getInputClass(isPasswordValid, formData.password)}
                        onChange={handleChange} value={formData.password}
                    />
                    <input 
                        type="password" name="match" placeholder="Repetir Contraseña" 
                        className={getInputClass(isMatchValid, formData.match)}
                        onChange={handleChange} value={formData.match}
                    />
                </div>

                <button 
                    type="submit" disabled={!isFormValid} 
                    className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold mt-4 disabled:bg-gray-300 hover:bg-indigo-700 transition-all shadow-lg"
                >
                    REGISTRAR PROFESOR
                </button>

                <button type="button" onClick={irALogin} className="w-full mt-4 text-sm text-indigo-600 hover:underline">
                    ¿Ya tienes cuenta? Inicia sesión aquí
                </button>
            </form>
        </div>
    );
};

export default SignUpProfessor;