// Node server which will handle socket.io connections
const io = require('socket.io')(8000);

const users = {}; // Maps socket.id to username
const userSockets = {}; // Maps username to socket.id for private messages

io.on('connection', socket => {

    // If any new user joins, broadcast to others and update user list
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        userSockets[name] = socket.id; // Store the username and their socket.id

        // Broadcast to other users that a new user joined
        socket.broadcast.emit('user-joined', name);

        // Send updated user list to all connected clients
        io.emit('update-user-list', Object.values(users));
    });

    // Handle private message sending
    socket.on('send-private-message', data => {
        const recipientSocketId = userSockets[data.recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private-message', {
                message: data.message,
                from: users[socket.id] // Sender's name
            });
        }
    });

    // Listen for private messages from the server
socket.on('private-message', (data) => {
    // Append the message for the sender
    append(`Private from ${data.from}: ${data.message}`, 'left', data.from);
    
    // Only display messages if the recipient's chat is currently active
    if (currentRecipient === data.from) {
        loadChatHistory(data.from); // Load the chat history if it's the current recipient
    }
});



    // If someone leaves the chat, update the list and notify others
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete userSockets[users[socket.id]]; // Remove from userSockets
        delete users[socket.id]; // Remove from users

        // Send updated user list to all connected clients
        io.emit('update-user-list', Object.values(users));
    });
});
