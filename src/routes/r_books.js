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
const booksController = require('../controllers/c_books');

// Get All Books
router.get('/', authMiddleware.checkRole([3, 2, 1]), booksController.getBooks);
// Post a Book
router.post('/', authMiddleware.checkRole([2, 1]), upload.single('image'), booksController.postBook);
// Patch a Book
router.patch('/:id', authMiddleware.checkRole([2, 1]), upload.single('image'), booksController.patchBook);
// Delete a Book
router.delete('/:id', authMiddleware.checkRole([1]), booksController.deleteBook);

// Get Book Detail
router.get('/:id', authMiddleware.checkRole([3, 2, 1]), booksController.getBookDetail);
// Return a Book
router.patch('/:id/return', authMiddleware.checkRole([3, 2, 1]), booksController.returnBook);
// Borrow a Book
router.patch('/:id/borrow', authMiddleware.checkRole([3, 2, 1]), booksController.borrowBook);

module.exports = router;