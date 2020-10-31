// Server stuff goes here
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Session Memory
var connections = {};
var rooms = {};

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
        score: 0,
        roomID: 0
    };

    socket.on('disconnect', function () {

        console.log('user disconnected');
        // remove this user from our connections object
        let userRoom = connections[socket.id].roomID;

        // If user is connected to a room
        if (userRoom != 0) {

            delete rooms[userRoom].users[socket.id];
            // If room is empty, then remove it from memory
            if (Object.keys(rooms[userRoom].users).length === 0) {
                delete rooms[userRoom];
                console.log(userRoom + " is empty, has now been deleted");
            }

            // emit to other room members that this user has left
            io.to(userRoom).emit('disconnect', socket.id);
        }

        delete connections[socket.id];

    });

    // When a user joins or starts a session
    socket.on('joinRoom', function (username, room) {

        // Change the user's name
        connections[socket.id].name = username;

        if (room != null) {
            if (rooms[room] != null) {
                // Join a room
                socket.join(room);
                // Add user to room's user list
                rooms[room].users[socket.id] = connections[socket.id];
                // Update the connected user's room ID so we know what room they belong to
                // when they disconnect.
                connections[socket.id].roomID = room;
                // Send user current userlist
                io.to(room).emit('currentUsers', rooms[room].users);
                // Start the session
                socket.emit('startSession', room, rooms[room]);

            }
            else {
                // TODO: Notify user that room doesn't exist
            }
        }
        else {
            // Create & Join the room
            socket.join(socket.id);
            // Update the connected user's room ID so we know what room they belong to
            // when they disconnect.
            connections[socket.id].roomID = socket.id;
            rooms[socket.id] = {
                users: {},
                stories: ["As a User, I would like X, so that Y", "As a User, I want Z"],
                activeStory: 0
            };

            // Add user to the room's user list
            rooms[socket.id].users[socket.id] = connections[socket.id];

            // Send the creator the list of users (themselves only at this point)
            socket.emit('currentUsers', rooms[socket.id].users);

            // Start the session
            socket.emit('startSession', socket.id, rooms[socket.id]);

        }
    });

    // When a user updates the story details
    socket.on('storyUpdatedByUser', function (storyText, room) {
        // Update active story title and emit to all users in the room
        rooms[room].stories[rooms[room].activeStory] = storyText;
        io.to(room).emit('updateStory', storyText);
    });

    // When a user submits a new story
    socket.on('newStoryByUser', function (newStoryTitle, room) {
        console.log("New story created: " + newStoryTitle);
        rooms[room].stories.push(newStoryTitle);

        //Send to everyone to stay in sync.
        io.to(room).emit('storiesList', rooms[room].stories)
    });

    // When a user deletes a story
    socket.on('deleteStoryByUser', function (story, room) {
        console.log("Received request to remove " + story + " from room " + room);

        let storyIndex = rooms[room].stories.indexOf(story)
        if (storyIndex > -1) {
            rooms[room].stories.splice(storyIndex, 1);
            io.to(room).emit('storiesList', rooms[room].stories)
        }
    });

    // When a user updates their display name
    socket.on('nameUpdatedByUser', function (username, room) {
        connections[socket.id].name = username;
        rooms[room].users[socket.id].name = username;
        // Emit name change to users
        io.to(room).emit('currentUsers', rooms[room].users);
    });

    // When a user casts a vote
    socket.on('submitScore', function (score, room) {
        if (connections[socket.id].roomID != 0) {
            connections[socket.id].score = score;
            rooms[room].users[socket.id].score = score;
            // Emit score to all users
            io.to(room).emit('currentUsers', rooms[room].users);
        }
    });

    // When a user requests score
    socket.on('getScore', function (room) {
        if (connections[socket.id].roomID != 0) {
            // calculate score      
            let score = 0;
            let participants = 0;
            Object.keys(rooms[room].users).forEach(function (id) {
                if (connections[id].score != 0) {

                    score += connections[id].score;
                    participants++;
                }
            });

            if (participants > 0) {
                score = score / participants;
            }

            // Emit score to all users
            io.to(room).emit('showScore', score);
        }
    });

});

var port = process.env.PORT || 1337;

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});