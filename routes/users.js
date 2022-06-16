var express = require('express');
var router = express.Router();
var jwtHelper = require('../helpers/jwt-helper');

var authController = require("../controllers/auth-controller");

/* GET users listing. */
router.get("/login", authController.login);
router.post('/login', authController.accessUser);

router.get("/register", authController.register)
router.post("/register", authController.addUser);

router.get('/logout', authController.logout);

module.exports = router;
