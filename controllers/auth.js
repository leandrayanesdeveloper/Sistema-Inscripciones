const loginRouter = require('express').Router();
const Estudiante = require("../models/estudiante");
const Profesor = require("../models/profesor"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (request, response) => {
console.log('Intentando iniciar sesión con:', request.body); // <--- Log para depuración    
    const { email, cedula, password, rol } = request.body; // <--- Recibes el rol

    // 1. Seleccionamos el modelo según lo que mandó el frontend
    const Modelo = { profesor: Profesor, 
        estudiante: Estudiante }[rol];

    if (!Modelo) {
        return response.status(400).json({ error: 'Rol no válido' });
    };

   const query = rol === 'estudiante' ? { cedula } : { email };
console.log("Buscando usuario con esta query:", query);

const userExist = await Modelo.findOne(query);
console.log("Usuario encontrado en DB:", userExist);

  if (!userExist) {
    return response.status(400).json({ 
      error: `${rol === 'estudiante' ? 'Cédula' : 'Email'} o contraseña inválidos` 
    });
  }

    //  Verificación 
    if (!userExist.verified) {
        return response.status(400).json({ error: 'Tu cuenta no ha sido verificada aún' });
    }

    //  Comparar contraseñas
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
    if (!isCorrect) {
        return response.status(400).json({ error: `${rol === 'estudiante' ? 'Cédula' : 'Email'} o contraseña inválidos` });
    }

    //  Generar el Token (JWT)
    const userForToken = {
        id: userExist._id,
        email: userExist.email,
        rol: rol 
    }

    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: '1d' 
    });

    //  Enviar la Cookie
    response.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // Esto protege el token de ataques XSS (no accesible por JS)
    });

    return response.status(200).json({ nombre: userExist.nombre }); 
});

module.exports = loginRouter;
