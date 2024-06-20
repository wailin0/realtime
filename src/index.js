const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const cors = require("cors");

const PORT = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')

app.use(cors());
app.use(express.static(publicDir))


io.on('connection', (socket) => {
    console.log("new websocket connection")

    //driver sending location
    socket.on('driverLocation', (data) => {
        console.log(`Driver ${data.driverId} sent to ${data.customerId} location: `, data.location);
        // Broadcast the driver's location to the specific customer
        io.to(data.customerId).emit('driverLocationUpdate', data);
    });

    //driver sending fee
    socket.on('driverTripFee', (data) => {
        console.log(`Driver ${data.driverId} trip cost: `, data.tripFee);
        io.to(data.customerId).emit('driverTripFeeUpdate', data);
    });

    //driver sending fee
    socket.on('tripStatus', (data) => {
        console.log(`Driver ${data.driverId} trip status: `, data.status);
        io.to(data.customerId).emit('tripStatusUpdate', data);
    });

    // Listen for the customer joining the room
    socket.on('joinRoom', (roomId) => {
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.join(roomId);
    });


    // Handle socket client disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})


server.listen(PORT, () => {
    console.log('Server is up at ' + PORT)
})

