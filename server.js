// Server stuff goes here
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


// Store all players
var players = {};

// Socket.io
var io = require('socket.io')(server, {
    wsEngine: 'ws'
});

// Sockets logic goes here
io.on('connection', function (socket) {
    console.log('a user connected');

    // create a new player and add it to our players object
    players[socket.id] = {
        playerId: socket.id
    };

    socket.on('disconnect', function () {
        console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];

    });
   
});

var port = process.env.PORT || 1337;

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});