// Socket stuff
this.socket = io();

var connectedUsers = {};
var roomID = 0;

// Draw all players upon first joining
this.socket.on('currentUsers', function (users) {
    Object.keys(users).forEach(function (id) {
        connectedUsers[users[id].userId] = users[id];
    });
    RenderUsers();
});

// Draw new players that join
this.socket.on('newUser', function (user) {
    connectedUsers[user.userId] = user;
    RenderUsers();
});

// Remove any players who disconnect
this.socket.on('disconnect', function (userId) {
    delete connectedUsers[userId];
    RenderUsers();
});

// Add the users to the webpage
function RenderUsers() {
    var userMarkup = '';
    Object.keys(connectedUsers).forEach(function (id) {
        userMarkup += '<div>' + connectedUsers[id].name + ' ' + connectedUsers[id].score + ' </div > ';
    });

    document.getElementById('UserList').innerHTML = userMarkup;
}

// Apply update if a connected user updates the story title
this.socket.on('updateStory', function (storyInfo) {
    document.getElementById('storyDisplay').innerText = storyInfo;
});

// Show the team consensus
this.socket.on('showScore', function (score) {
    console.log("Score: " + score);
    document.getElementById('scorePanel').innerText = score;
});

// Receive the list of stories in the session from the server and add them to our list.
this.socket.on('storiesList', function (stories) {
    console.log("Received active stories from server: " + stories);
    //Replace all items in the lit with what has come from the server.
    //Host should be able to add, remove, reorder, which should be reflected in the client.
    document.getElementById('pendingStories').innerHTML = ''
    stories.forEach(function (story) {
        if (story !== undefined) {
            updateStoriesList(story);
        }
    });
});

function editFinished() {
    document.getElementById('storyDisplay').innerText = document.getElementById('storyTitle').value;
    document.getElementById('storyTitle').style.display = "none";
    document.getElementById('storyDisplay').style.display = "block";

    // Push update back to server
    this.socket.emit('storyUpdatedByUser', document.getElementById('storyTitle').value, roomID);
}

document.getElementById('storyDisplay')
    .addEventListener('click', function (event) {
        document.getElementById('storyTitle').value = document.getElementById('storyDisplay').innerText;
        document.getElementById('storyDisplay').style.display = "none";
        document.getElementById('storyTitle').style.display = "block";
        document.getElementById('storyTitle').focus();
    });


function UpdateName() {
    console.log(document.getElementById('username').value);
    // Push update back to server
    this.socket.emit('nameUpdatedByUser', document.getElementById('username').value, roomID);

}

function SubmitScore(element) {
    this.socket.emit('submitScore', parseInt(element.getAttribute("value")), roomID);
}

function ShowScore() {
    this.socket.emit('getScore', roomID);
}

// Add a new story from the user input.
function addStory() {
    let newStory = document.getElementById("newStoryTitle");
    let storyText = newStory.value;
    this.socket.emit('newStoryByUser', storyText, roomID);
    newStory.value = '';
}

// Update our stories list to include the given story.
function updateStoriesList(newStory) {
    let newStoryDiv = document.createElement("div");
    newStoryDiv.className = "Story";
    newStoryDiv.innerText = newStory;

    document.getElementById('pendingStories').appendChild(newStoryDiv);
}

//Allow a user to submit a new story by pressing 'Return'
document.getElementById('newStoryTitle').addEventListener("keydown", function (e) {
    if (!e) { var e = window.event; }
    if (e.keyCode == 13) {
        e.preventDefault();
        addStory();
    }
}, false);

//Create room
function createRoom() {
    let username = document.getElementById('createRoomName').value;
    if (username != null) {
        this.socket.emit('joinRoom', username, null);
    }
}
//join room
function joinRoom() {
    let username = document.getElementById('joinRoomName').value;
    let room = document.getElementById('joinRoomID').value;
    if (username != null && room != null) {
        this.socket.emit('joinRoom', username, room);
    }
}

// Show the poker UI
this.socket.on('startSession', function (room, roomDetails) {

    // Set Room ID
    roomID = room;

    document.getElementById('roomID').value = roomID;

    // Render pending the stories
    document.getElementById('pendingStories').innerHTML = '';
    roomDetails.stories.forEach(function (story) {
        if (story !== undefined) {
            updateStoriesList(story);
        }
    });

    // Set the current story
    document.getElementById('storyDisplay').innerText = roomDetails.stories[roomDetails.activeStory];

    // Hide joining options and show poker UI
    document.getElementById('joinOptions').style.display = 'none';
    document.getElementById('Poker').style.display = 'block';

    // Set click handlers for tabs
    document.getElementById('usersButton')
    .addEventListener('click', function (event) {
        document.getElementById('usersButton').className = 'selected';
        document.getElementById('backlogButton').className = '';
        document.getElementById('StoriesPanel').style.display = "none";
        document.getElementById('UsersPanel').style.display = "block";
    });

    document.getElementById('backlogButton')
    .addEventListener('click', function (event) {
        document.getElementById('backlogButton').className = 'selected';
        document.getElementById('usersButton').className = '';
        document.getElementById('UsersPanel').style.display = "none";
        document.getElementById('StoriesPanel').style.display = "block";        
    });

});
