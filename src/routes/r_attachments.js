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
const attachmentsController = require('../controllers/c_attachments');


/**
 * Main CRUD
 */
// Get All Attachments
router.get('/', attachmentsController.getAttachments);
// Post a Attachment
router.post('/', upload.none(), attachmentsController.postAttachment);
// Patch a Attachment
router.patch('/:id', upload.none(), attachmentsController.patchAttachment);
// Delete a Attachment
router.delete('/:id', attachmentsController.deleteAttachment);

/**
 * Ext CRUD
 */
// Get Attachment By ID
router.get('/:id', attachmentsController.getAttachmentById);

module.exports = router;