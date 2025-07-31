const { Router } = require("express");
const router = Router();
const UserController = require("../../Controller/Auth/User");

router.post("/usersignup", UserController.UserSignup);
router.post("/usersignin", UserController.UserSignin);
router.get("/alluser", UserController.getAlluser);

module.exports = router;
