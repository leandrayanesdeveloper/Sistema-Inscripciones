const signupRouter = require("express").Router();
const Estudiante = require("../models/estudiante");
const Profesor = require("../models/profesor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

signupRouter.post("/", async (request, response) => { 
    // 1. Extraemos los datos.
    const { nombre, cedula, email, password, rol } = request.body;

    // Validación básica
    if (!nombre || !cedula || !email || !password) {
        return response.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // 2. Elegimos el modelo según el rol que venga del frontend
    // 1. Creas el objeto afuera o arriba de la ruta
    const roles = {
    profesor: Profesor,
    estudiante: Estudiante,
 };
// 2. En tu ruta, lo usas así:
    const Modelo = roles[rol];

// 3. Validación de seguridad (por si mandan un rol que no existe)
    if (!Modelo) {
    return response.status(400).json({ error: "Rol no válido" });
}

    try {
        // 3. Verificar si la cédula o el email ya existen en ese modelo
        const userExist = await Modelo.findOne({ $or: [{ email }, { cedula }] });
        if (userExist) {
            return response.status(400).json({ error: "La cédula o el email ya están registrados" });
        }

        // --- VALIDACIÓN CON API ---
        // const API_KEY = process.env.EMAIL_API_KEY; 
        // const url = `https://apps.emaillistverify.com/api/verifyEmail?secret=${API_KEY}&email=${email}`;
        // const { data } = await axios.get(url);
        
        // const esValido = data === "ok" || data === "ok_for_all";
        // if (!esValido) {
        //     return response.status(400).json({ error: "El correo no es válido. Prueba con uno real." });
        // }

        // 4. Encriptación
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Creación del nuevo usuario (Estudiante o Profesor)
        const newUser = new Modelo({
            nombre,
            cedula,
            email,
            passwordHash,
            verified: true, // Lo dejamos en true por la validación de la API
        });

        // 6. Guardar en MongoDB
        const savedUser = await newUser.save();
        
        return response.status(201).json(`Cuenta de ${rol} creada con éxito.`);
       
    } catch (error) {
        console.error("Error en registro:", error.message);
        return response.status(500).json({ error: "Error en el servidor." });
    }
});

module.exports = signupRouter;