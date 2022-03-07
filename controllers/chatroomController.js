const mongoose = require('mongoose');
const Chatroom = mongoose.model('Chatroom');
const User = mongoose.model('User');

exports.create = async (req, res) => {
    const {name, createdBy} = req.body;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if(!nameRegex.test(name)) {
        return res.status(400).send({
            message: "Invalid name"
        });
    }
    const chatroomExist = await Chatroom.findOne({name, createdBy});
    if(chatroomExist) {
        return res.status(400).send({
            message: "Chatroom already exist",
            chatroom: chatroomExist
        });
    }
    const chatroom = new Chatroom({name,createdBy,members: [createdBy]});

    await chatroom.save();

    res.json({
        message: "Chatroom created successfully",
        chatroom,
    });
}

exports.getAllChatrooms = async (req, res) => { 
    const {userId} = req.body;
    const checkuser = await User.findOne({_id: userId});
    if(!checkuser) {
        return res.status(400).send({
            message: "Invalid user"
        });
    }
    // const Adminchatrooms = await Chatroom.find({createdBy: userId});
    const Memberchatrooms = await Chatroom.find({members: userId});
    const chatrooms = [ ...Memberchatrooms];
    res.json({
        message: "Chatrooms fetched successfully",
        chatrooms
    });
}

exports.Addmember = async (req, res) => {
    const {chatroomId, userId} = req.body;
    const checkuser = await User.findOne({_id: userId});
    if(!checkuser) {
        return res.status(400).send({
            message: "Invalid user"
        });
    }
    const checkchatroom = await Chatroom.findOne({_id: chatroomId});
    if(!checkchatroom) {
        return res.status(400).send({
            message: "Invalid chatroom"
        });
    }
     await Chatroom.findOneAndUpdate({_id: chatroomId}, {$push: {members: userId}});
     const chatroom = await Chatroom.findById(chatroomId);
    
    res.json({
        message: "Member added successfully",
        chatroom
    });
}

exports.createTwoUserChat = async (req, res) => {
    const {userId, friendId} = req.body;
    const checkuser = await User.findOne({_id: userId});
    if(!checkuser) {
        return res.status(400).send({
            message: "Invalid user"
        });
    }
    const checkfriend = await User.findOne({_id: friendId});
    if(!checkfriend) {
        return res.status(400).send({
            message: "Invalid friend"
        });
    }
    const chatroom = await Chatroom.findOne({name: `${checkuser.name} & ${checkfriend.name}`});
    if(chatroom) {
        return res.json({
            message: "Chatroom already exist",
            chatroom
        })
    }
    const newchatroom = new Chatroom({
        name: `${checkuser.name} & ${checkfriend.name}`,
        createdBy: userId,
        members: [userId, friendId]
    });
    await newchatroom.save();
    res.json({
        message: "Chatroom created successfully",
        chatroom: newchatroom
    });
}