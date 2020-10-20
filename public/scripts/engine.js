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
        userMarkup += '<div>' + connectedUsers[id].name + ' </div>';
    });

    document.getElementById('UserList').innerHTML = userMarkup;
}

// Apply update if a connected user updates the story title
this.socket.on('updateStory', function (storyInfo) {
    document.getElementById('storyDisplay').innerText = storyInfo;
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


function UpdateName()
{
    console.log(document.getElementById('username').value);
    // Push update back to server
    this.socket.emit('nameUpdatedByUser', document.getElementById('username').value);
    
}
