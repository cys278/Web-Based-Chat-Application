# Realtime Chat Application

## Description
This is a web-based chat application built using **Node.js** and **Socket.io** for real-time communication between users. The app supports both public and private messaging, with features like dark mode, search functionality within chats, and a user list for private messaging. The interface is responsive and intuitive, designed for seamless user interaction.

---

## Features

- **Real-time Communication**: Messages are sent and received instantly.
- **Public and Private Messaging**: Choose between group chats or one-on-one private messages.
- **Search Functionality**: Search through messages in private chats.
- **Dark Mode**: Toggle between light and dark themes.
- **User List**: View a list of online users for initiating private chats.
- **Persistent Chat History**: Chat history is stored locally per user during the session.
- **Responsive UI**: Clean and user-friendly interface.

---

## Technologies Used

### Frontend
- **HTML5**, **CSS3**: For structuring and styling the application.
- **JavaScript**: For dynamic behavior and user interactions.

### Backend
- **Node.js**: Handles server-side operations.
- **Socket.io**: Manages WebSocket connections for real-time data transmission.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js installation.

### Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:
   ```bash
   cd Realtime-Chat-Application
   ```

3. Navigate to the server directory:
   ```bash
   cd nodeserver
   ```

4. Install the required dependencies:
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npx nodemon index.js
   ```

6. Open the project in your browser:
   - Use a live server in your code editor to run the `index.html` file.
   - Alternatively, open the HTML file directly in your browser after starting the server.

---

## Usage

1. Open the application in your browser.
2. Enter your name in the prompt to join the chat.
3. Use the **Users Online** section to:
   - View the list of active users.
   - Click a user's name to start a private chat.
4. Use the search bar to search through messages in private chats.
5. Switch between **dark mode** and **light mode** using the toggle button.
6. Send a message using the input field and send button.

---

## File Structure

```
Realtime-Chat-Application
├── index.html          # Main HTML file for the client
├── style.css           # Styling for the client
├── js
│   └── client.js       # Frontend logic for interacting with the server
├── nodeserver
│   └── index.js        # Backend logic using Node.js and Socket.io
└── README.md           # Project documentation
```

---

## Key Functionalities

### Server-Side (`index.js`)
- **User Management**:
  - Tracks users and their respective sockets.
  - Updates and broadcasts the user list.
- **Message Handling**:
  - Broadcasts public messages to all users.
  - Directs private messages to specific users based on their socket ID.
- **Disconnection Management**:
  - Notifies other users when someone leaves.

### Client-Side (`client.js`)
- **Chat Management**:
  - Sends and receives messages in real-time.
  - Appends messages to the chat container.
  - Maintains chat history for private chats.
- **Search Functionality**:
  - Highlights and scrolls to matching messages within the chat.
- **UI Enhancements**:
  - Switch between themes using local storage for persistence.
  - Responsive design for an optimal user experience.

---

## Demo

1. Start the server and open the application in multiple browser tabs or devices.
2. Join with different usernames to test real-time messaging.
3. Experiment with public and private messaging, the search feature, and dark mode.

---

## Customization

1. **Notification Sound**:
   Replace the `notification.mp3` file to use a custom sound.
2. **Styling**:
   Modify the `style.css` file to customize the appearance.
3. **Port Configuration**:
   Change the port number in `index.js` to run the server on a different port.

---

## Future Improvements

- **User Authentication**: Add login functionality to authenticate users.
- **Database Integration**: Store chat history persistently using MongoDB or MySQL.
- **File Sharing**: Enable users to share files during chats.
- **Group Chat Rooms**: Allow users to create and join specific chat rooms.

---

## License
This project is licensed under the MIT License. Feel free to modify and use it as needed.

---

## Contact
For any questions or feedback, feel free to contact the developer:

- **Name**: Nirvaan Agarwal (Neil)
- **Email**: [your_email@example.com] (Replace with your actual email)

---

Happy Chatting! 🎉
