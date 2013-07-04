var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    app = express(),
    io,
    port = 3700; // pick your own

// stylus + nib
function stylusRender(str, path) {
    return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib());
}

// setup
app.set('views', __dirname + '/presentation/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/presentation/public'));
app.use(stylus.middleware({ src: __dirname + '/presentation/public', compile: stylusRender }));

// routes
app.get('/', function(req, res){
    res.render('index', { url: 'http://localhost:' + port });
});

// socket
io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: {
        heading: 'Simple Logger',
        info: 'Listening on port: ' + port,
        items: [
            { label: 'Starting session at: ' + new Date(), style: 'starter' }
        ]
    }});

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

console.log('Simple Logger: listening on port ' + port);