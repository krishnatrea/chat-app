const router  = require('express').Router();
const chatroomController = require('../controllers/chatroomController');

const auth = require('../middleware/auth');
const { route } = require('./user');

router.post("/create", auth, chatroomController.create);
router.get("/getallchatrooms", auth, chatroomController.getAllChatrooms);
router.get("/addmember", auth, chatroomController.Addmember);

// router.post("/login", userController.login);
// router.post("/register", userController.register);

module.exports = router;