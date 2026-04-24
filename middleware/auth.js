const jwt = require('jsonwebtoken');
const Estudiante = require('../models/estudiante');
const Profesor = require('../models/profesor');

const userExtractor = async (request, response, next) => {
    try {
        // 1. Extraer el token de las cookies
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(401).json({ error: 'Token faltante' });
        }

        // 2. Verificar el token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded.id) {
            return response.status(401).json({ error: 'Token inválido' });
        }

       const roles = { profesor: Profesor, estudiante: Estudiante };
       const Modelo = roles[decoded.rol];

       if (!Modelo) {
         return response.status(401).json({ error: 'Rol de token inválido' });
        };
        
        // 4. Buscar el usuario en la base de datos
        const user = await Modelo.findById(decoded.id);

        if (!user) {
            return response.status(401).json({ error: 'Usuario no encontrado' });
        }

        // 5. Guardar el usuario y su rol en el objeto request
        request.user = user;
        request.rol = decoded.rol; 

        next(); 
    } catch (error) {
        console.error("Error en userExtractor:", error.message);
        return response.sendStatus(403); // Prohibido
    }
};

module.exports = { userExtractor };