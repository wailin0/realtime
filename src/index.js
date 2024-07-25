const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
const cors = require("cors");

const PORT = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(publicDir))

let driverList = {};


io.on('connection', (socket) => {

    //driver sending location
    socket.on('driverLocation', (data) => {
        io.to(data.customerId).emit('driverLocationUpdate', data);
    });

    socket.on('reportLocation', (data) => {
        // data should include driverId and location info
        driverList[data.driverId] = {socketId: socket.id, ...data};

        // Broadcast the updated locations to all connected clients
        io.emit('allDriverLocation', Object.values(driverList));
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
        socket.join(roomId);
    });


    // Handle socket client disconnection
    socket.on('disconnect', () => {
        const driverToRemove = Object.values(driverList).find(driver => driver.socketId === socket.id);
        if (driverToRemove) {
            delete driverList[driverToRemove.driverId];
            // Broadcast the updated driverList to all connected clients after removal
            io.emit('allDriverLocation', Object.values(driverList));
        }
    });
})

app.use(function (req, res, next) {
    req.io = io;
    next();
});

app.post('/sendTripStatus', (req, res) => {
    req.io.to(req.body.customerId).emit('tripStatusUpdate', req.body);

    res.send('Message sent to client');
});

server.listen(PORT, () => {
    console.log('Server is up at ' + PORT)
})

