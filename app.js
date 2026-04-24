require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { userExtractor } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { MONGO_URI } = require('./config');
const Materia = require('./models/materia');

// Controladores
const authRouter = require('./controllers/auth');
const inscripcionRouter = require('./controllers/inscripcion');
const materiaRouter = require('./controllers/materia');
const logoutRouter = require('./controllers/logout');
const signupRouter = require('./controllers/signup'); 
const perfilRouter = require('./controllers/perfil');
const { error } = require('console');

const app = express();

    mongoose.connect(process.env.MONGO_URI_TEST)
  .then(() => {
    console.log('✅ Conectado a MongoDB con éxito');
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error.message);
  });


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));



// Rutas backend (API)
app.use('/api/signup', signupRouter); // Para crear cuentas
app.use('/api/login', authRouter);    // Para iniciar sesión
app.use('/api/logout', logoutRouter);  // Para cerrar sesión

// Rutas protegidas (Usan userExtractor)
app.use('/api/inscripcion', userExtractor, inscripcionRouter);
app.use('/api/materias', userExtractor, materiaRouter);
app.use('/api/perfil', userExtractor, perfilRouter);


module.exports = app;