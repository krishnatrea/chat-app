const jwt = require('jwt-then');
module.exports = async (req, res, next) => { 

    try {
        if(!req.headers.authorization) {
            return res.status(401).send({
                message: "Unauthorized"
            })
        }
        const token = req.headers.authorization.split(" ")[1];
        const payload = await jwt.verify(token, process.env.SECRET);
        req.payload = payload;

    } catch (error) { 
        console.log(error);  
        return res.status(401).send({
            message: "Unauthorized"
        })
    }
    next();
}