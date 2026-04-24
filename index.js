const app = require('./app');
const http = require('http');

const server = http.createServer(app);

const PORT = 3001;
console.log('Iniciando el servidor en el puerto', PORT);

server.listen(PORT, () => {
    console.log('El servidor esta corriendo');
});