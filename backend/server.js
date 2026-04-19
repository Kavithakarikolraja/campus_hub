require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Socket.io for Real-Time Chat
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // Dynamic for Vercel/Render
        methods: ["GET", "POST"]
    }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Allow user to join a personal room based on their DB ID to receive notifications anywhere
    socket.on('setup_user', (userId) => {
        socket.join(userId);
        onlineUsers.set(userId, socket.id);
        io.emit('update_online_users', Array.from(onlineUsers.keys()));
        console.log(`User setup with ID: ${userId}`);
    });

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User joined chat room: ${data}`);
    });

    socket.on('send_message', async (data) => {
        // Send to the active chat room
        socket.to(data.room).emit('receive_message', data);

        // Also send a notification specifically to the receiver's personal user room
        const ids = data.room.split('_');
        const receiverId = ids.find(id => id !== data.authorId);

        if (receiverId) {
            socket.to(receiverId).emit('receive_message', data);
        }

        // Save message to MongoDB
        try {
            await Message.create({
                room: data.room,
                authorId: data.authorId,
                authorName: data.authorName || data.author,
                text: data.message,
                time: data.time
            });
        } catch (err) {
            console.error('Failed to save message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                io.emit('update_online_users', Array.from(onlineUsers.keys()));
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
