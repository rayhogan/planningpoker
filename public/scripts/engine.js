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
function RenderUsers()
{
    var userMarkup = '';
    Object.keys(connectedUsers).forEach(function (id) {
        userMarkup += '<div> User '+connectedUsers[id].userId+' </div>';
    }); 

    document.getElementById('UserList').innerHTML = userMarkup;
}
