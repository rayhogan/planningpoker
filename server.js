// Server stuff goes here
var express = require('express');
var app = express();
var server = require('http').Server(app);

// Store all user
var connections = {};
var storyName = "As a User, I would like X, so that Y";

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
        userId: socket.id,
        score: 0
    };

    // update all other users of the new user
    socket.broadcast.emit('newUser', connections[socket.id]);

    // send the users object to the new user
    socket.emit('currentUsers', connections);

    // send connected user the current story
    socket.emit('updateStory', storyName);

    socket.on('disconnect', function () {

        console.log('user disconnected');
        // remove this user from our connections object
        delete connections[socket.id];

        // emit a message to all users to remove this user
        io.emit('disconnect', socket.id);

    });

    // When a user updates the story details
    socket.on('storyUpdatedByUser', function (storyText) {
        // Emit a message to all users with the update story title.
        storyName = storyText;
        socket.broadcast.emit('updateStory', storyName);
    });
    
    // When a user updates their display name
    socket.on('nameUpdatedByUser', function (username) {
        connections[socket.id].name = username;
        // Emit name change to users
        io.emit('currentUsers', connections);
    });

    // When a user casts a vote
    socket.on('submitScore', function (score) {
        connections[socket.id].score = score;
        // Emit score to all users
        io.emit('currentUsers', connections);
    });

    // When a user casts a vote
    socket.on('getScore', function () {  
        // calculate score      
        var score = 0;        
        Object.keys(connections).forEach(function (id) {
            score += connections[id].score;
        });
        score = score / Object.keys(connections).length;

        // Emit score to all users
        io.emit('showScore', score);
    });

});

var port = process.env.PORT || 1337;

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});