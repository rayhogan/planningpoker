// Server stuff goes here
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


// Store all user
var connections = {};

// Socket.io
var io = require('socket.io')(server, {
    wsEngine: 'ws'
});

// Sockets logic goes here
io.on('connection', function (socket) {
    console.log('a user connected');

    // create a new user and add it to our connections object
    connections[socket.id] = {
        name: "User",
        userId: socket.id
    };

    // update all other users of the new user
    socket.broadcast.emit('newUser', connections[socket.id]);

    // send the users object to the new user
    socket.emit('currentUsers', connections);

    socket.on('disconnect', function () {

        console.log('user disconnected');
        // remove this user from our connections object
        delete connections[socket.id];

        // emit a message to all users to remove this user
        io.emit('disconnect', socket.id);

    });

});

var port = process.env.PORT || 1337;

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});