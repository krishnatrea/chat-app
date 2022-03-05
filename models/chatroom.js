const mongoose= require('mongoose');

const chatroomSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required!", 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: "CreatedBy is required!",
        ref: "User",
    },
    members : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Chatroom', chatroomSchema); 