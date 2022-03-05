const router  = require('express').Router();
const userController = require('../controllers/chatroomController');

const auth = require('../middleware/auth');

router.post("/create", auth, userController.create);

// router.post("/login", userController.login);
// router.post("/register", userController.register);

module.exports = router;