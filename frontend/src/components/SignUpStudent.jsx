import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


const SignUpStudent = ({ alFinalizar, irALogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        email: '',
        password: '',
        match: ''
    });

    const VALIDATIONS = {
        CEDULA: /^[0-9]{7,9}$/,
        NAME: /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/,
        EMAIL: /^[A-Z\u00d1\u00f1a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
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
                password: formData.password, // Asegúrate de que tu backend use este nombre
                rol: 'estudiante'
            };

            await axios.post('/api/signup', newUser);
            Swal.fire('¡Éxito!', 'Te has registrado correctamente. Ahora puedes iniciar sesión.', 'success');
            
            setTimeout(() => {
                irALogin(); // Te manda al login automáticamente al terminar
            }, 2000);

        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Error en el registro', 'error');
        }
    };

    const getInputClass = (isValid, value) => {
        const baseClass = "w-full mb-2 p-2 border rounded outline-none transition-all ";
        if (value === "") return baseClass + "focus:border-indigo-700";
        return baseClass + (isValid ? "border-green-600 ring-2 ring-green-100" : "border-red-600 ring-2 ring-red-100");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-white shadow-2xl rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 text-indigo-900 text-center">Registro UNEXCA</h2>
                
                <input 
                    name="nombre" placeholder="Nombre completo" 
                    className={getInputClass(isNameValid, formData.nombre)}
                    onChange={handleChange} value={formData.nombre}
                />
                <input 
                    name="cedula" placeholder="Cédula" 
                    className={getInputClass(isCedulaValid, formData.cedula)}
                    onChange={handleChange} value={formData.cedula}
                />
                <input 
                    name="email" placeholder="Correo institucional" 
                    className={getInputClass(isEmailValid, formData.email)}
                    onChange={handleChange} value={formData.email}
                />
                <input 
                    type="password" name="password" placeholder="Contraseña" 
                    className={getInputClass(isPasswordValid, formData.password)}
                    onChange={handleChange} value={formData.password}
                />
                <input 
                    type="password" name="match" placeholder="Confirmar contraseña" 
                    className={getInputClass(isMatchValid, formData.match)}
                    onChange={handleChange} value={formData.match}
                />

                <button 
                    type="submit" disabled={!isFormValid} 
                    className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold mt-4 disabled:bg-gray-300 hover:bg-indigo-700 transition shadow-md"
                >
                    Registrar Estudiante
                </button>

                <button type="button" onClick={irALogin} className="w-full mt-4 text-sm text-indigo-600 hover:underline">
                    ¿Ya tienes cuenta? Inicia sesión
                </button>
            </form>
        </div>
    );
};

export default SignUpStudent;