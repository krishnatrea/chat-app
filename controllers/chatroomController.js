const mongoose = require('mongoose');
const Chatroom = mongoose.model('Chatroom');

exports.create = async (req, res) => {

    const {name, createdBy} = req.body;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if(!name.test(name)) {
        return res.status(400).send({
            message: "Invalid name"
        });
    }
    const chatroomExist = await Chatroom.findOne({name, createdBy});
    if(chatroomExist) {
        return res.status(400).send({
            message: "Chatroom already exist"
        });
    }
    const chatroom = new Chatroom({name,createdBy});

    await chatroom.save();

    res.json({
        message: "Chatroom created successfully",
    });
}

exports.getAllChatrooms = async (req, res) => { 
    const {userId} = req.params;
    const checkuser = await User.findOne({_id: userId});
    if(!checkuser) {
        return res.status(400).send({
            message: "Invalid user"
        });
    }
    const Adminchatrooms = await Chatroom.findAll({createdBy: userId});
    const Memberchatrooms = await Chatroom.findAll({members: userId});
    const chatrooms = [...Adminchatrooms, ...Memberchatrooms];
    res.json({
        message: "Chatrooms fetched successfully",
        chatrooms
    });
}

exports.Addmember = async (req, res) => {
    const {chatroomId, userId} = req.params;
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
    const chatroom = await Chatroom.findOneAndUpdate({_id: chatroomId}, {$push: {members: userId}});
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
    const chatroom = await Chatroom.findOne({members: {$all: [userId, friendId]}});
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