/**
 * ExpressJs FW
 */
// import express framework
const express = require('express');
// instance of express router
const router = express.Router();

// import middlewares
const authMiddleware = require('../middlewares/mdl_auth');
const validationMiddleware = require('../middlewares/mdl_validation');

/**
 * Load All Routes
 */
const authRouter = require('./r_auth');
const usersRouter = require('./r_users');
const friendsRouter = require('./r_friends');
const messagesRouter = require('./r_messages');
const attachmentsRouter = require('./r_attachments');

/**
 * Fire the router
 */
router.use('/auth', validationMiddleware.xssEscape, authRouter);
router.use('/users', validationMiddleware.xssEscape, authMiddleware.verifyJwtToken, usersRouter);
router.use('/friends', validationMiddleware.xssEscape, authMiddleware.verifyJwtToken, friendsRouter);
router.use('/messages', validationMiddleware.xssEscape, authMiddleware.verifyJwtToken, messagesRouter);
router.use('/attachments', validationMiddleware.xssEscape, authMiddleware.verifyJwtToken, attachmentsRouter);

module.exports = router;