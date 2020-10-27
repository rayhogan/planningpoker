// Socket stuff
this.socket = io();

var connectedUsers = {};

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
    this.socket.emit('storyUpdatedByUser', document.getElementById('storyTitle').value);
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
    this.socket.emit('nameUpdatedByUser', document.getElementById('username').value);

}

function SubmitScore(element) {
    this.socket.emit('submitScore', parseInt(element.getAttribute("value")));
}

function ShowScore() {
    this.socket.emit('getScore');
}

// Add a new story from the user input.
function addStory() {
    let newStory = document.getElementById("newStoryTitle")
    let storyText = newStory.value;
    if (storyText !== '') {
        this.socket.emit('newStoryByUser', storyText)
    }
    newStory.value = ''
}

// Update our stories list to include the given story.
function updateStoriesList(newStory) {
    let newStoryDiv = document.createElement("div")
    newStoryDiv.className = "Story"
    let deleteButton = document.createElement("span")
    deleteButton.innerText = 'x'
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
        this.socket.emit('deleteStoryByUser', storyText);
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