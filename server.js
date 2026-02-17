const express = require('express');
const crypto = require('crypto');
const { error } = require('console');



const app = express();
const port = 3000;



app.use(express.json());



const sessions = {};

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}


console.log('Number Guessing Game API - Backend con Node.js y Express');
console.log('Endpoints disponibles:');
console.log('  POST /start    → Inicia partida');
console.log('  POST /guess    → Envía suposición');
console.log(`Escuchando en http://localhost:${port}`);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//Start - Inicio
app.post('/start', (req, res) => {

    console.log('Cuerpo crudo recibido:', req.body);     
    console.log('Tipo de req.body:', typeof req.body);

    const { difficulty } = req.body;

    const validDifficulties = ['easy', 'medium', 'hard'];

    if (!difficulty || !validDifficulties.includes(difficulty.toLowerCase())) {
        return res.status(400).json({
            error: 'El campo "difficulty" es requerido y debe ser "easy", "medium" o "hard".'
        });
    }

    let chances;
    switch (difficulty.toLowerCase()) {
        case 'easy': chances = 19; break;
        case 'medium': chances = 10; break;
        case 'hard': chances = 5; break;
    }

    const secretNumber = Math.floor(Math.random() * 100) + 1;
    const sessionId = generateSessionId();

    sessions[sessionId] = {
        secretNumber,
        chances,
        attempts: 0,
        difficulty: difficulty.toLowerCase(),
        gameOver: false,
        won: false
    };

    res.json({
        message: '¡Bienvenido al Juego de Adivinar el Número!',
        description: 'Estoy pensando en un número entre 1 y 100.',
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        chances,
        sessionId,
        instructions: 'Envíe sus intentos a POST /guess con este sessionId y el campo "guess" (número entre 1-100)'
    });



});


//Process - Proceso

app.post('/guess', (req, res) => {
    const { sessionId, guess } = req.body;

    if (!sessionId || !sessions[sessionId]) {
        return res.status(400).json({ error: 'sessionId inválido o inexistente. Inicie una partida primero.' });
    }

    const session = sessions[sessionId];

    if (session.gameOver) {
        return res.json({
            message: session.won
                ? `Partida ya ganada en ${session.attempts} intentos. Inicie una nueva.`
                : `Partida terminada. El número era ${session.secretNumber}. Inicie una nueva.`,
            gameOver: true
        });
    }

    const numGuess = Number(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
        return res.status(400).json({ error: 'La suposición debe ser un número entero entre 1 y 100' });
    }

    session.attempts += 1;

    let response = {
        attempts: session.attempts,
        remaining: session.chances - session.attempts
    };

    if (numGuess === session.secretNumber) {
        session.gameOver = true;
        session.won = true;
        response.message = `¡Felicitaciones! Adivinaste el número en ${session.attempts} intentos.`;
        response.gameOver = true;
        response.won = true;
    } else if (numGuess > session.secretNumber) {
        response.message = `Incorrecto. El número es menor que ${numGuess}.`;
    } else {
        response.message = `Incorrecto. El número es mayor que ${numGuess}.`;
    }

    if (session.attempts >= session.chances && !session.won) {
        session.gameOver = true;
        response.message += ` ¡Partida terminada! El número era ${session.secretNumber}.`;
        response.gameOver = true;
        response.won = false;
    }

    res.json(response);
});


app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});