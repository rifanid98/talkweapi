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
const booksRouter = require('./r_books');

/**
 * Fire the router
 */
router.use('/books', validationMiddleware.xssEscape, authMiddleware.verifyJwtToken, booksRouter);

module.exports = router;