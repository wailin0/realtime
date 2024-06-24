const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const cors = require("cors");

const PORT = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(publicDir))

io.on('connection', (socket) => {
    console.log("new websocket connection")

    //driver sending location
    socket.on('driverLocation', (data) => {
        io.to(data.customerId).emit('driverLocationUpdate', data);
    });

    //driver sending fee
    socket.on('driverTripInfo', (data) => {
        io.to(data.customerId).emit('driverTripInfoUpdate', data);
    });

    socket.on('tripStatus', (data) => {
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

app.use(function(req,res,next){
    req.io = io;
    next();
});

app.post('/sendTripComplete', (req, res) => {
    req.io.to(req.body.customerId).emit('tripStatusUpdate', req.body );

    res.send('Message sent to all clients');
});

server.listen(PORT, () => {
    console.log('Server is up at ' + PORT)
})

