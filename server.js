require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useNewUrlParser: true,
} );

mongoose.connection.on("error", err => {
    console.log("Mongoose connection error: " + err);
})
mongoose.connection.once("open" , ()=> {
    console.log("Mongoose connected successfully"); 
})

require("./models/message.js");
require("./models/user.js");
require("./models/chatroom.js");

const app  = require('./app')
const server = require('http').createServer(app);



const io = require('socket.io')(server, {
    origin: "*"
});
const jwt = require('jwt-then');
const { error } = require('console');

io.use(async (socket, next)=> {
    errorCheck = false;
    try {
        const token = socket.handshake.query.token;  
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (error) {   
        socket.error();
    }
    
})

io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);
    socket.on('disconnect', ()=> {
        console.log(`User ${socket.userId} disconnected`);
    })

    socket.on("joinRoom", ({chatroomId}) => {
        socket.join(chatroomId);
        console.log(`User ${socket.userId} joined room ${chatroomId}`);
    })

    socket.on("leaveRoom", ({chatroomId}) => {
        socket.leave(chatroomId);
        console.log(`User ${socket.userId} leaved room ${chatroomId}`);
    })
    socket.on("chatroomMessage", async ({chatroomId, message}) => {
        if(message.trim().lenght > 0 ) {
            console.log(`User ${socket.userId} sent message to room ${chatroomId}`)
            const user = await User.find({id: socket.userId});
            console.log(message)
            const message = new Message({
                chatroom : chatroomId,
                user : user.name,
                message : message
            });

        io.to(chatroomId).emit("newMessage", {
            message,
            name: user.name,
            userId: socket.userId
        });
        await message.save(); 
    }
})
})

server.listen(3000, "0.0.0.0",() => {
    console.log('Server is up on port 3000')
}) 