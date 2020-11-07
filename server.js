const { Console } = require('console');
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
            delete rooms[userRoom].hiddenScores[socket.id];
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
                rooms[room].hiddenScores[socket.id] = {
                    name: connections[socket.id].name,
                    score: 0
                };
                // Update the connected user's room ID so we know what room they belong to
                // when they disconnect.
                connections[socket.id].roomID = room;

                // Send user current userlist (but check if we are currently showing results)
                if (rooms[room].showResults) {
                    io.to(room).emit('currentUsers', rooms[room].users);
                }
                else {
                    io.to(room).emit('currentUsers', rooms[room].hiddenScores);
                }

                // Start the session
                socket.emit('startSession', room, rooms[room], socket.id);

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
                stories: {},
                activeStory: undefined,
                showResults: false,
                hiddenScores: {}
            };

            // Add user to the room's user list
            rooms[socket.id].users[socket.id] = connections[socket.id];
            rooms[socket.id].hiddenScores[socket.id] = {
                name: connections[socket.id].name,
                score: 0
            };

            // Send the creator the list of users (themselves only at this point)
            socket.emit('currentUsers', rooms[socket.id].users);

            // Start the session
            socket.emit('startSession', socket.id, rooms[socket.id], socket.id);

        }
    });

    // When a user updates the story details
    socket.on('storyUpdatedByUser', function (storyText, room, key) {
        console.log("Update story with key " + key + " with text : " + storyText);
        // Update active story title and emit to all users in the room
        rooms[room].stories[rooms[room].activeStory] = storyText;
        io.to(room).emit('updateStory', storyText);
        io.to(room).emit('storiesList', rooms[room].stories)
    });

    socket.on('selectStoryByUser', function (room, key) {
        console.log("Received request to select new story with key: " + key);
        rooms[room].activeStory = key;
        io.to(room).emit('selectStoryAsActive', key);
    });

    // When a user submits a new story
    socket.on('newStoryByUser', function (newStoryTitle, room) {
        console.log("New story created: " + newStoryTitle);
        let id = generateNewRandomId();
        rooms[room].stories[id] = newStoryTitle;
        console.log(rooms[room].activeStory)

        // rooms[room].stories.push(newStoryTitle);

        //Send to everyone to stay in sync.
        io.to(room).emit('storiesList', rooms[room].stories)
        if (rooms[room].activeStory === undefined) {
            console.log("Setting the active story to :" + id)
            rooms[room].activeStory = id;
            io.to(room).emit('selectStoryAsActive', id);
        }
    });

    function generateNewRandomId() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    }

    // When a user deletes a story
    socket.on('deleteStoryByUser', function (key, room) {
        console.log("Received request to remove " + key + " from room " + room);
        console.log(rooms[room].stories)
        delete rooms[room].stories[key];
        console.log(rooms[room].stories)
        console.log(rooms[room].activeStory)
        if (rooms[room].activeStory === key) {
            console.log("Trying to delete the active story better pick a new one!")
            if (Object.keys(rooms[room].stories).length == 0) {
                rooms[room].activeStory = undefined;
                console.log("Telling connected users there is no selected story")
                io.to(room).emit('selectStoryAsActive', undefined);
            } else {
                console.log(rooms[room].stories)
                let newActiveItem = Object.keys(rooms[room].stories)[0]
                rooms[room].activeStory = newActiveItem;
                console.log("New active story after removing " + key + ": " + newActiveItem)
                io.to(room).emit("selectStoryAsActive", newActiveItem)
            }
        }
        //TODO: Select a new active story
        io.to(room).emit('storiesList', rooms[room].stories)
    });

    // When a user updates their display name
    socket.on('nameUpdatedByUser', function (username, room) {
        connections[socket.id].name = username;
        rooms[room].users[socket.id].name = username;
        // Emit name change to users
        io.to(room).emit('currentUsers', rooms[room].users);
    });

    // When a user casts a vote
    socket.on('submitScore', function (score) {
        if (connections[socket.id].roomID != 0) {
            let room = connections[socket.id].roomID;
            if (!rooms[room].showResults) {
                rooms[room].users[socket.id].score = score;
                rooms[room].hiddenScores[socket.id].score = "Voted!";
                // Emit score to all users
                io.to(room).emit('userVoted', rooms[room].hiddenScores);
            }
        }
    });

    // When a user casts a vote
    socket.on('clearScore', function (score) {
        if (connections[socket.id].roomID != 0) {
            let room = connections[socket.id].roomID;
            if (rooms[room].showResults) {
                // Reset the hidden score object
                Object.keys(rooms[room].users).forEach(function (id) {
                    rooms[room].users[id].score = 0;
                    rooms[room].hiddenScores[id].score = 0;
                });
                // Send update users object with the actual scores 
                io.to(room).emit('showScore', 0);
                io.to(room).emit('currentUsers', rooms[room].hiddenScores);
                rooms[room].showResults = false;
            }
        }
    });

    // When a user requests score
    socket.on('getScore', function (room) {
        if (connections[socket.id].roomID != 0) {
            // calculate score      
            let score = 0;
            let participants = 0;
            let room = connections[socket.id].roomID;
            Object.keys(rooms[room].users).forEach(function (id) {
                if (rooms[room].users[id].score != 0) {

                    console.log(rooms[room].users[id].score);
                    score += rooms[room].users[id].score;
                    participants++;
                }
            });

            if (participants > 0) {
                score = score / participants;
            }

            // Emit score to all users
            io.to(room).emit('showScore', score);
            rooms[room].showResults = true;
            // Send update users object with the actual scores 
            io.to(room).emit('currentUsers', rooms[room].users);
        }
    });

});

var port = process.env.PORT || 1337;

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});