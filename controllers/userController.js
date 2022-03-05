const mongoose = require('mongoose');
const User = mongoose.model('User');
const sha256 = require('js-sha256');
const jwt = require('jwt-then')
exports.register = async (req, res) => {
    const {name, email, password} = req.body;

    const emailRegex = /[@gmail.com|@yahoo.com|@hotmail.com|@live.com]/;

    if(emailRegex.test(email) === false) {
        return res.status(400).send({
            message: "Invalid email address"
        });
    }
    const userCheck = await User.findOne({
        email, 
        password: sha256(password + process.env.SALT)
    })
    if(userCheck) {
        return res.status(400).send({ 
            message: "User exist"
        })
    }

    if(password.length < 6) {
        return res.status(400).send({
            message: "Password must be at least 6 characters long"
        });
    }
    const user = new User({name, email, password : sha256(password + process.env.SALT)});

    await user.save();
    res.json({
        message: "User created successfully"
    })
}

exports.login = async (req, res) => {
    const { email, password} = req.body;

    const user = await User.findOne({
        email, 
        password: sha256(password + process.env.SALT)
    })
    if(!user) {
        return res.status(400).send({
            message: "Invalid email or password"
        })
    }

    const token = await jwt.sign({id: user.id}, process.env.SECRET)

    res.json({  
        message: "User logged in successfully",
        token : token,
        userId: user.id,
        name: user.name
    })
}

exports.GetAllUsers = async (req, res) => {
    const users = await User.find();
    res.json({
        message: "Users fetched successfully",
        users
    })
}