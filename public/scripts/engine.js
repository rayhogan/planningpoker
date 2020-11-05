// Socket stuff
this.socket = io();

var connectedUsers = {};
var roomID = 0;
var myID = 0;
var myScore = 0;

// Draw all players upon first joining
this.socket.on('currentUsers', function (users) {
    connectedUsers = users;
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
    var userMarkup = '<div><b>Name</b></div><div><b>Score</b></div>';
    Object.keys(connectedUsers).forEach(function (id) {
        if (id == myID && connectedUsers[id].score != 0) {
            userMarkup += '<div>' + connectedUsers[id].name + '</div><div>' + myScore + ' </div > ';
        }
        else {
            userMarkup += '<div>' + connectedUsers[id].name + '</div><div>' + connectedUsers[id].score + ' </div > ';
        }

    });

    document.getElementById('UserList').innerHTML = userMarkup;
}

this.socket.on('userVoted', function (scores) {
    connectedUsers = scores;
    RenderUsers();
});

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
    myScore = parseInt(element.getAttribute("value"));
    this.socket.emit('submitScore', parseInt(element.getAttribute("value")), roomID);
}

function ShowScore() {
    this.socket.emit('getScore');
}

function ResetScore() {
    this.socket.emit('clearScore');
}

// Add a new story from the user input.
function addStory() {
    let newStory = document.getElementById("newStoryTitle");
    let storyText = newStory.value;
    if (storyText !== '') {
        this.socket.emit('newStoryByUser', storyText, roomID);
    }
    newStory.value = '';
}

// Update our stories list to include the given story.
function updateStoriesList(newStory) {
    let newStoryDiv = document.createElement("div")
    newStoryDiv.className = "Story"
    let deleteButton = document.createElement("img")
    deleteButton.src = '/assets/delete.png'
    deleteButton.setAttribute("class", "StoryDeleteButton")

    let text = document.createElement("span")
    text.setAttribute("class", "StoryTitleText")
    text.innerText = newStory

    newStoryDiv.appendChild(deleteButton);
    newStoryDiv.appendChild(text)

    document.getElementById('pendingStories').appendChild(newStoryDiv)
}

function deleteStoryItem(elem) {
    let storyText;
    for (let i = 0; i < elem.childNodes.length; i++) {
        let node = elem.childNodes[i]
        if (node.className === "StoryTitleText") {
            storyText = node.innerText;
        }
    }
    if (storyText !== undefined) {
        this.socket.emit('deleteStoryByUser', storyText, roomID);
    }
}

//Allow a user to submit a new story by pressing 'Return'
document.getElementById('newStoryTitle').addEventListener("keydown", function (e) {
    if (!e) { var e = window.event; }
    if (e.keyCode == 13) {
        e.preventDefault();
        addStory();
    }
}, false);

// Add event listener for deleting a story.
document.addEventListener('click', function (e) {
    if (e.target && e.target.className === 'StoryDeleteButton') {
        deleteStoryItem(e.target.parentNode)
    }
});

//Create room
function createRoom() {
    let username = document.getElementById('createRoomName').value;
    if (username != null && username !== '') {
        this.socket.emit('joinRoom', username, null);
    }
}
//join room
function joinRoom() {
    let username = document.getElementById('joinRoomName').value;
    let room = document.getElementById('joinRoomID').value;
    if (username != null && username !== '' && room != null && room !== '') {
        this.socket.emit('joinRoom', username, room);
    }
}

// Show the poker UI
this.socket.on('startSession', function (room, roomDetails, userID) {

    // Set Room ID
    roomID = room;
    myID = userID;

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
