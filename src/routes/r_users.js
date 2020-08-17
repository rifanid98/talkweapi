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
const usersController = require('../controllers/c_users');


/**
 * Main CRUD
 */
// Get All Users
router.get('/', usersController.getUsers);
// Post a User
router.post('/', upload.single('image'), usersController.postUser);
// Patch a User
router.patch('/:id', upload.single('image'), usersController.patchUser);
// Delete a User
router.delete('/:id', usersController.deleteUser);

/**
 * Ext CRUD
 */
// Get User By ID
router.get('/:id', usersController.getUserById);
// Get User By ID
router.get('/:id/list', usersController.getUsersList);
// Get User Friends
router.get('/:id/friends/', usersController.getFriendsList);
// Get User Friends By Status
router.get('/:id/friends/:status', usersController.getFriends);
// Get User Messages
router.get('/:id/messages/', usersController.getUserMessages);
// Get New User Messages
router.get('/:id/messages/new', usersController.getNewUserMessages);
// Delete User Messages
router.delete('/:id1/messages/:id2', usersController.deleteUserMessages);

module.exports = router;