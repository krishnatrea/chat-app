const router  = require('express').Router();
const chatroomController = require('../controllers/chatroomController');

const auth = require('../middleware/auth');
const { route } = require('./user');

router.post("/create", auth, chatroomController.create);
router.post("/getallchatrooms", auth, chatroomController.getAllChatrooms);
router.post("/addmember", auth, chatroomController.Addmember);

// router.post("/login", userController.login);
// router.post("/register", userController.register);

module.exports = router;