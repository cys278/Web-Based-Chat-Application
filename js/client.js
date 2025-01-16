const socket = io('http://localhost:8000');

// Get DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const userList = document.getElementById('userList');
const searchSection = document.querySelector('.search-section'); // New: Search section reference
const sendSection = document.querySelector('.send'); // New: Send section reference
let currentRecipient = null; // No public chat, private messaging only
let userChats = {}; // To store chat history per user
let currentChatDisplayed = null; // Keep track of which chat is currently displayed

// Initially hide the chat sections
searchSection.style.display = 'none';
messageContainer.style.display = 'none';
sendSection.style.display = 'none';

// Get the switch input and body element for theme
const themeSwitch = document.querySelector('.switch input');
const body = document.body;

// Search and continue chat buttons
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const continueChatBtn = document.getElementById('continueChatBtn');

// Audio for receiving messages
var audio = new Audio('notification.mp3');

// Append messages to the chat container for a specific user
const append = (message, position, recipient) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    
    // Store messages for the specific user
    if (!userChats[recipient]) {
        userChats[recipient] = [];
    }

    const lastMessage = userChats[recipient][userChats[recipient].length - 1];
    
    // Avoid duplicate message entry
    if (!lastMessage || lastMessage.message !== message) {
        userChats[recipient].push({ message, position });
    }

    // Display the message only if the chat with this user is active
    if (currentRecipient === recipient) {
        messageContainer.appendChild(messageElement);
    }

    if (position === 'left') {
        audio.play(); // Play notification sound for received messages
    }
};



// Load the chat history of the selected recipient
const loadChatHistory = (recipient) => {
    if (currentChatDisplayed === recipient) {
        return; // Prevent reloading if the chat is already displayed
    }

    messageContainer.innerHTML = ''; // Clear the container when switching users

    if (userChats[recipient]) {
        userChats[recipient].forEach(chat => {
            const messageElement = document.createElement('div');
            messageElement.innerText = chat.message;
            messageElement.classList.add('message', chat.position);
            messageContainer.appendChild(messageElement);
        });
    }

    currentChatDisplayed = recipient; // Set the current recipient
};


// Listen for private messages from the server
socket.on('private-message', (data) => {
    append(`Private from ${data.from}: ${data.message}`, 'left', data.from);
    if (currentRecipient === data.from) {
        loadChatHistory(data.from); // Load the chat history if it's the current recipient
    }
});

// Search through messages for the current chat
searchBtn.addEventListener('click', () => {
    let searchTerm = searchInput.value.trim().toLowerCase(); // Get the search term
    if (!searchTerm) {
        return; // Do nothing if the search input is empty
    }

    const chatHistory = userChats[currentRecipient] || []; // Get chat history for the current recipient
    let firstMatch = null;

    messageContainer.innerHTML = ''; // Clear the chat container before showing search results
    chatHistory.forEach(chat => {
        const messageElement = document.createElement('div');
        messageElement.innerText = chat.message;
        messageElement.classList.add('message', chat.position);

        // Check if the message contains the search term
        if (chat.message.toLowerCase().includes(searchTerm)) {
            messageElement.style.backgroundColor = 'yellow'; // Highlight the message
            if (!firstMatch) {
                firstMatch = messageElement; // Set the first match for scrolling
            }
        }

        messageContainer.append(messageElement); // Append the message element to the container
    });

    // Scroll to the first matching message if found
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth' });
    }

    toggleSearchAndContinue(false);  // Switch to "Continue Chat" button
});

// When "Continue Chat" is clicked
continueChatBtn.addEventListener('click', () => {
    loadChatHistory(currentRecipient);  // Reload the full chat history
    toggleSearchAndContinue(true);  // Switch back to "Search" button
});

// Toggle between search and continue buttons
function toggleSearchAndContinue(showSearch) {
    if (showSearch) {
        searchBtn.style.display = 'inline';    // Show the "Search" button
        continueChatBtn.style.display = 'none'; // Hide the "Continue Chat" button
    } else {
        searchBtn.style.display = 'none';       // Hide the "Search" button
        continueChatBtn.style.display = 'inline'; // Show the "Continue Chat" button
    }
}

// Ask new user for their name and inform the server
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// Receive new user join event from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right', 'public');
});

// Receive a user leaving event from the server
socket.on('leave', name => {
    append(`${name} left the chat`, 'right', 'public');
});

// Handle form submission to send a message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message === '') {
        return; // Prevent sending empty or whitespace-only messages
    }

    if (currentRecipient) {
        // Send a private message
        append(`You (Private to ${currentRecipient}): ${message}`, 'right', currentRecipient);
        socket.emit('send-private-message', { message, recipient: currentRecipient });
    }

    messageInput.value = ''; // Clear the input field
});

// Check local storage to apply the saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeSwitch.checked = true; // Check the switch if dark mode is active
}

// Listen for switch toggle to change theme
themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        // Apply dark mode
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark'); // Save preference to local storage
    } else {
        // Revert to light mode
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light'); // Save preference to local storage
    }
});

// Update the list of users when the server sends the updated list
socket.on('update-user-list', users => {
    userList.innerHTML = ''; // Clear the list first
    users.forEach(user => {
        if (user !== userName) { // Don't show yourself in the list
            const userElement = document.createElement('li');
            userElement.innerText = user;
            userElement.addEventListener('click', () => {
                currentRecipient = user; // Set the selected recipient for private messaging
                loadChatHistory(user); // Load chat history with this user

                // Show the chat UI when a user is selected
                searchSection.style.display = 'block';
                messageContainer.style.display = 'block';
                sendSection.style.display = 'block';

                alert(`You are now chatting privately with ${user}`);
            });
            userList.append(userElement);
        }
    });
});
