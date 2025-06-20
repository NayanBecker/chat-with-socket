import express from 'express';
import { createServer, get } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server);

const data = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
const help = 'Comandos disponíveis: <br/>/data - Mostra a data atual <br/>/help - Mostra esta mensagem de ajuda <br/>/RH - Informações sobre Recursos Humanos<br/>/TI - Informações sobre Tecnologia da Informação<br/>/ENG - Informações sobre Engenharia<br/>/Sair - Encerra a sessão';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.broadcast.emit('hi');



    socket.on('chat_init', (msg) => {
        console.log('message: ' + msg);

        if (msg.toLowerCase() === '/data') {
            socket.emit('chat_init', data);

        } else if (msg.toLowerCase() === '/rh') {
            socket.join('rh');
            io.to('rh').emit('chat_rh', 'Recursos Humanos: Ola, como posso ajudar?');
            socket.on('chat_rh', (msg) => {
                socket.emit('chat_rh', 'Recursos Humanos: Ola, como posso ajudar?');
            });
        }

        else if (msg.toLowerCase() === '/ti') {
            socket.join('ti');
            socket.on('chat_ti', (msg) => {
                socket.emit('chat_ti', 'Tecnologia da Informação: Ola, como posso ajudar?');
            });
        }
        else if (msg.toLowerCase() === '/eng') {
            socket.join('eng');
            socket.on('chat_eng', (msg) => {
                socket.emit('chat_eng', 'Engenharia: Ola, como posso ajudar?');
            });
        }
        else if (msg.toLowerCase() === '/sair') {
            socket.leave('rh');
            socket.leave('eng');
            socket.emit('chat_init', 'Sessão encerrada. Até logo!');
        }
        else if (msg.toLowerCase() === '/help') {
            socket.emit('chat_init', help);
        }
        else {
            const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
            if (rooms.length > 0) {
                const room = rooms[0];
                io.to(room).emit('chat_message', `[${room}] ${msg}`);
            } else {
                socket.emit('chat_message', '[TODOS]' + msg);
                socket.broadcast.emit('chat_message', '[TODOS] ' + msg);

            }
        }


    });


    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});



server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});