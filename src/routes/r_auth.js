/**
 * ExpressJs FW
 */
// import express framework
const express = require('express');
// instance of express router
const router = express.Router();

// import multer upload helper
const upload = require('../helpers/upload');

/**
 * Controllers
 */
// load the controller
const authController = require('../controllers/c_auth');
const userController = require('../controllers/c_users');

// register user
router.post('/register', upload.none(), userController.postUser);
router.post('/login', upload.none(), authController.login);
router.post('/refreshtoken', upload.none(), authController.refresh_token);

module.exports = router;