require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { userExtractor } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { MONGO_URI } = require('./config');

// Modelos
const Materia = require('./models/materia');
const Profesor = require('./models/profesor');
const Estudiante = require('./models/estudiante');
const Inscripcion = require('./models/inscripcion');

// Controladores
const loginRouter = require('./controllers/auth');
const inscripcionRouter = require('./controllers/inscripcion');
const materiaRouter = require('./controllers/materia');
const logoutRouter = require('./controllers/logout');
const signupRouter = require('./controllers/signup'); 
const perfilRouter = require('./controllers/perfil');
const { error } = require('console');

const app = express();



    mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB con éxito');
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error.message);
  });


// Middlewares{.}
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));


app.use(cors({
  origin: 'http://localhost:5173', // <--- URL exacta de tu frontend (sin la barra / al final)
  credentials: true,                // <--- Permite que pasen las cookies/headers de sesión
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Rutas backend (API)
app.use('/api/signup', signupRouter); // Para crear cuentas
app.use('/api/login', loginRouter);    // Para iniciar sesión
app.use('/api/logout', logoutRouter);  // Para cerrar sesión

// Rutas protegidas (Usan userExtractor)
app.use('/api/inscripcion', userExtractor, inscripcionRouter);
app.use('/api/materias', userExtractor, materiaRouter);
app.use('/api/perfil', userExtractor, perfilRouter);


module.exports = app;