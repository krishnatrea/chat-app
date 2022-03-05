const router  = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/users", auth,userController.GetAllUsers)

module.exports = router;