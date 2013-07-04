var io = require('socket.io-client'),
    socket = io.connect('localhost', { port: 3700 }),
    args = process.argv;

socket.emit('send', { message: { heading: args[2], style: args[3] } });