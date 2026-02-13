const express = require('express');
const crypto = require('crypto');



const app = express();
const port = 3000;



app.use(express.json());



const sessions = {};



console.log('Number Guessing Game API - Backend con Node.js y Express');
console.log('Endpoints disponibles:');
console.log('  POST /start    → Inicia partida');
console.log('  POST /guess    → Envía suposición');
console.log(`Escuchando en http://localhost:${port}`);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//Start - Inicio
app.post('/start', (req, res) => {});


//Process - Proceso

app.post('guess', (req, res) => {});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});