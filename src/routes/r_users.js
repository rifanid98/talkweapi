/**
 * ExpressJs FW
 */
// import express framework
const express = require('express');
// instance of express router
const router = express.Router();

// import multer upload helper
const upload = require('../helpers/upload');

// import middlewares
const authMiddleware = require('../middlewares/mdl_auth');

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
router.get('/:id', usersController.getUsers);
// Get User Friends
router.get('/:id/friends/', usersController.getUsers);
// Get User Friends By Status
router.get('/:id/friends/:status', usersController.getUsers);
// Get User Messages
router.get('/:id/messages/', usersController.getUsers);


// /**
//  * Main CRUD
//  */
// // Get All Users
// router.get('/', authMiddleware.checkRole([3, 2, 1]), usersController.getUsers);
// // Post a User
// router.post('/', authMiddleware.checkRole([2, 1]), upload.single('image'), usersController.postUser);
// // Patch a User
// router.patch('/:id', authMiddleware.checkRole([2, 1]), upload.single('image'), usersController.patchUser);
// // Delete a User
// router.delete('/:id', authMiddleware.checkRole([1]), usersController.deleteUser);

// /**
//  * Ext CRUD
//  */
// // Get User By ID
// router.get('/:id', authMiddleware.checkRole([3, 2, 1]), usersController.getUsers);
// // Get User Friends
// router.get('/:id/friends/', authMiddleware.checkRole([3, 2, 1]), usersController.getUsers);
// // Get User Friends By Status
// router.get('/:id/friends/:status', authMiddleware.checkRole([3, 2, 1]), usersController.getUsers);
// // Get User Messages
// router.get('/:id/messages/', authMiddleware.checkRole([3, 2, 1]), usersController.getUsers);

module.exports = router;