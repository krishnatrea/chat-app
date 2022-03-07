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

const Message = require("./models/message.js");
const User = require("./models/user.js");
require("./models/chatroom.js");

const app  = require('./app')
const server = require('http').createServer(app);



const io = require('socket.io')(server, {
    origin: "*"
});
const jwt = require('jwt-then');
const { error } = require('console');

io.use(async (socket, next)=> {
    console.log("try to connect ")
    errorCheck = false;
    try {
        const token = socket.handshake.query.token;  
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (error) {   
      console.log(error)
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
        console.log("message", message);    
            console.log(`User ${socket.userId} sent message to room ${chatroomId}`)
            const user = await User.findOne({id: socket.userId});
            console.log(message)
            const messagtosave = new Message({
                chatroom : chatroomId,
                user : user.id,
                message : message
            });

        io.to(chatroomId).emit("newMessage", {
            message,
            name: user.name,
            userId: socket.userId
        });
        await messagtosave.save(); 

})
})

server.listen(8000, "192.168.0.104",() => {
    console.log('Server is up on port 8000')
}) 
