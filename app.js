const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use("/user", require('./routes/user'));
app.use("/chat", require('./routes/chatroom'));



// setup error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

 
module.exports = app