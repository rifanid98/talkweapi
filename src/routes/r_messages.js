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
const messagesController = require('../controllers/c_messages');


/**
 * Main CRUD
 */
// Get All Messages
router.get('/', messagesController.getMessages);
// Post a Message
router.post('/', upload.none(), messagesController.postMessage);
// Patch a Message
router.patch('/:id', upload.none(), messagesController.patchMessage);
// Delete a Message
router.delete('/:id', messagesController.deleteMessage);

/**
 * Ext CRUD
 */
// Get Message By ID
router.get('/:id', messagesController.getMessageById);
// Get Conversations By ID
router.get('/:senderID/:receiverID', messagesController.getConversationsMessage);

module.exports = router;