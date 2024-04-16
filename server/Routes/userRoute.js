const express = require("express");
const { registerUser, loginUser, findUser, getUser, searchUser } = require("../Controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUser);
router.get("/search", searchUser);

module.exports = router;
