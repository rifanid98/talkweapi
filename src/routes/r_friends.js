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
const friendsController = require('../controllers/c_friends');


/**
 * Main CRUD
 */
// Get All Friends
router.get('/', friendsController.getFriends);
// Post a Friend
router.post('/', upload.none(), friendsController.postFriend);
// Patch a Friend
router.patch('/:id', upload.none(), friendsController.patchFriend);
// Delete a Friend
router.delete('/:id', friendsController.deleteFriend);

/**
 * Ext CRUD
 */
// Get Friend By ID
router.get('/:id', friendsController.getFriendById);

module.exports = router;