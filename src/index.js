const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const PORT = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')

app.use(express.static(publicDir))


io.on('connection', (socket) => {
    console.log("new websocket connection")

    socket.on('driverLocation', (data) => {
        console.log(`Driver ${data.driverId} location: `, data.location);
        // Broadcast the driver's location to the specific customer
        io.to(data.customerId).emit('driverLocationUpdate', data);
    });

    // Listen for the customer joining the room
    socket.on('joinRoom', (roomId) => {
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.join(roomId);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})


server.listen(PORT, () => {
    console.log('Server is up at ' + PORT)
})

