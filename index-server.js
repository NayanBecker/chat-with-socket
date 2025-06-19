import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    io.on('connection', (socket) => {
        socket.broadcast.emit('hi');
    });
});
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});