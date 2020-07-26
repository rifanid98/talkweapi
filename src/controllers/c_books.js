/**
 * Model
 * .
 * Load Model
 */
const booksModel = require("../models/m_books");
const dbViewsModel = require("../models/m_dbviews");
const historiesModel = require("../models/m_histories");

/**
 * custom response helper
 * .
 * merapihkan output
 * response: function(res, statusExecution, data, statusCode, message)
 */
const myResponse = require("../helpers/myResponse");

// import joi
const validate = require('../helpers/joiSchema');

// import config
const config = require('../configs/global');

// import custom error message
const errorMessage = require("../helpers/myErrorMessage");

// import delete
const deleteImage = require("../helpers/deleteImage");



/**
 * Custom Function
 */
function generateFilters(filters = {}, fields = {}) {
	let search = {};
	let pagination = {};
	let sort = {};

	// get search filters
	for (field in fields) {
		// ambil field name
		const fieldName = fields[field];

		for (filter in filters) {
			// masukin ke search
			if (filter == fieldName) {
				if (filter in search == false) {
					search[filter] = filters[filter];
				}
			}
			if (filter == "genre" && "genre_name" == fieldName) {
				if (filter in search == false) {
					search[fieldName] = filters[filter];
				}
			}
			if (filter == "author" && "author_name" == fieldName) {
				if (filter in search == false) {
					search[fieldName] = filters[filter];
				}
			}
		}
	}

	// get pagination filters
	if ((filters.page && filters.page > 0) && (filters.limit && filters.limit > 0)) {
		pagination['page'] = filters.page;
		pagination['limit'] = filters.limit;
	}

	// get sort filters
	if (filters.sort && filters.sort.length > 0) {
		sort.sort = (filters.sort);
	}

	return {
		search,
		pagination,
		sort
	};
}

async function getBookById(id = 0) {
	try {
		const result = await booksModel.getDataById(id);
		return result;
	} catch (error) {
		console.log(error);
		return 'error';
	}
}

/**
 * CRUD
 */
async function getBooks(req, res) {
	try {
		const filters = req.query;
		const fields = await dbViewsModel.getBookAndGenreFieldName();
		const totalData = await booksModel.getAllData();
		const generatedFilters = generateFilters(filters, fields);

		const newFilters = {
			search: generatedFilters.search,
			pagination: generatedFilters.pagination,
			sort: generatedFilters.sort
		};

		const result = await booksModel.getDataCustom(newFilters, totalData.length);
		result.nextPage = req.protocol + '://' + req.get('host') + req.originalUrl;
		result.nextPage = result.nextPage.replace(`page=${req.query.page}`, `page=${parseInt(req.query.page) + 1}`)
		result.previousPage = req.protocol + '://' + req.get('host') + req.originalUrl;
		if (req.query.page > 1) {
			result.previousPage = result.previousPage.replace(`page=${req.query.page}`, `page=${parseInt(req.query.page) - 1}`)
		}

		return myResponse.response(res, "success", result, 200, "Ok!");
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function postBook(req, res) {
	try {
		// Joi validation
		const fieldToPatch = Object.keys(req.body);
		await validate.validateBooks(req.body, fieldToPatch);

		const data = req.body;
		const checkBook = await booksModel.getDataByTitle(data.title);

		if (checkBook.length > 0) {
			if (req.file) {
				// delete new image when duplicated data
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);
			}

			const message = `Duplicate data ${data.title}`;
			return myResponse.response(res, "failed", "", 409, message);
		}

		if (req.file === undefined) {
			// set default file when no image to upload
			data.image = `${config.imageUrlPath(req)}default.png`;
		} else {
			if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
				// get the image name and set into data
				data.image = `${config.imageUrlPath(req)}${req.file.filename}`;
			} else {
				// delete new file when not an image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);

				const message = `There is no image to upload`;
				return myResponse.response(res, "failed", "", 500, message);
			}
		}

		const result = await booksModel.addData(data);
		if (result.affectedRows > 0) {
			data.book_id = result.insertId;
			return myResponse.response(res, "success", data, 201, "Created!");
		} else {
			if (req.file) {
				// delete new image when insert data is failed
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);
			}

			const message = `Add data failed`;
			return myResponse.response(res, "failed", "", 409, message);
		}
	} catch (error) {
		console.log(error);

		// delete image when error
		if (req.file) {
			const myRequest = { protocol: req.protocol, host: req.get('host') }
			deleteImage.delete(myRequest, req.file.filename);
		}

		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function patchBook(req, res) {
	try {
		// get data to validate
		const fieldToPatch = Object.keys(req.body);
		const error = await validate.validateBooks(req.body, fieldToPatch);

		// checking if data is exists or not
		const id = req.params.id;
		const oldData = await getBookById(id);
		if (oldData.length < 1) {
			// delete new image when duplicated data
			const myRequest = { protocol: req.protocol, host: req.get('host') }
			deleteImage.delete(myRequest, req.file.filename);

			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}

		// checking if user want to change the title of book
		const body = req.body;
		if (body.title !== undefined) {
			const checkBook = await booksModel.getDataByTitle(body.title);
			if (checkBook.length > 0) {
				if (req.file) {
					// delete new image when duplicated data
					const myRequest = { protocol: req.protocol, host: req.get('host') }
					deleteImage.delete(myRequest, req.file.filename);
				}

				const message = `Duplicate data ${body.title}`;
				return myResponse.response(res, "failed", "", 409, message);
			}
		}

		// checking is there a file or not
		let data = {};
		if (req.file === undefined) {
			// if there is no file to upload
			data = {
				...body
			};
		} else {
			// checking type of file
			if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
				data = {
					...body,
					image: `${config.imageUrlPath(req)}${req.file.filename}`,
				};
			} else {
				// delete new file when not an image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);

				const message = `There is no image to upload`;
				return myResponse.response(res, "failed", "", 500, message);
			}
		}

		// update the book data
		const result = await booksModel.updateData(data, id);

		// prepare the respond data
		const newData = {
			book_id: id,
			...data,
		};

		// if update is success
		if (result.affectedRows > 0) {
			const imageName = oldData[0].image.split('/').pop();
			if (imageName != 'default.png' && req.file !== undefined) {
				// delete old image when not default image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, oldData[0].image);
			}

			return myResponse.response(res, "success", newData, 200, "Updated!");
		}
		// if update is failed
		else {
			// delete new image when update data is failed
			const myRequest = { protocol: req.protocol, host: req.get('host') }
			deleteImage.delete(myRequest, req.file.filename);

			const message = `Update data ${data.title} failed `;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);

		// delete image when error
		if (req.file) {
			const myRequest = { protocol: req.protocol, host: req.get('host') }
			deleteImage.delete(myRequest, req.file.filename);
		}

		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function deleteBook(req, res) {
	try {
		const id = req.params.id;
		const oldData = await getBookById(id);
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}
		const result = await booksModel.deleteData(id);
		if (result.affectedRows > 0) {
			const imageName = oldData[0].image.split('/').pop();
			if (imageName != 'default.png') {
				// delete old image when not default image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, oldData[0].image);
			}
			return myResponse.response(res, "success", "", 200, 'Deleted');
		} else {
			const message = `Internal Server Error`;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

/**
 * Another CRUD
 */
async function getBookDetail(req, res) {
	try {
		const id = req.params.id;
		const oldData = await getBookById(id);

		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}

		const result = await booksModel.getDataById(id);

		if (result.length < 1) {
			const message = `Update data ${oldData[0].title} failed `;
			return myResponse.response(res, "failed", "", 500, message);
		}

		return myResponse.response(res, "success", result, 200, "Ok!");
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function borrowBook(req, res) {
	try {
		const id = req.params.id;
		const userId = req.decodedToken.user_id;
		const oldData = await getBookById(id);

		// check if borrower has been borrowed same book 
		const checkBorrowStatus = await historiesModel.getBorrowStatus(userId, oldData[0].book_id);
		if (checkBorrowStatus.length > 0) {
			const message = `the book has been borrowed by user with id #${userId} and has not been returned`;
			return myResponse.response(res, "failed", "", 404, message);
		}

		// check if book is exists
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}

		// check if book is available
		if (oldData[0].status == 1) {
			const message = `Book with id ${oldData[0].book_id} has been borrowed`;
			return myResponse.response(res, "failed", "", 409, message);
		}

		const bookLeft = await booksModel.getDataById(id);
		const bookQuantity = bookLeft[0].quantity;
		let bookData = {};
		if (bookQuantity > 1) {
			bookData = {
				quantity: bookQuantity - 1
			}
		}
		// if book less than 2, set book status to not available
		else if (bookQuantity === 1) {
			bookData = {
				quantity: bookQuantity - 1,
				status: 1
			}
		}

		// borrowing the book (updating quantity)
		const updateBookQuantity = await booksModel.updateData(bookData, id);
		// if update quantity of the book failed
		if (updateBookQuantity.affectedRows < 1) {
			const message = `Failed to borrow a book`;
			return myResponse.response(res, "failed", "", 500, message);
		}

		const borrowData = {
			book_id: id,
			user_id: userId
		}
		// inserting into history
		const insertIntoHistory = await historiesModel.addData(borrowData);
		// if inserting into history failed
		if (insertIntoHistory.affectedRows > 0) {
			const data = {
				history_id: insertIntoHistory.insertId,
				title: oldData.title
			}

			return myResponse.response(res, "success", data, 200, "Ok!");
		} else {
			// restoring back the book quantity
			const bookData = {
				quantity: bookQuantity + 1
			}

			const restoreBookQuantity = await booksModel.updateData(bookData, id);
			if (restoreBookQuantity.affectedRows < 1) {
				// if restoring book quantity failed
				const message = `Failed to borrow a book, book not restored`;
				return myResponse.response(res, "failed", "", 500, message);
			}
			const message = `Failed to borrow a book, book restored`;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function returnBook(req, res) {
	try {
		const id = req.params.id;
		const userId = req.decodedToken.user_id;
		const oldData = await getBookById(id);

		// get history data
		const historyData = await historiesModel.getBorrowStatus(userId, id);

		if (historyData.length < 1) {
			const message = `No books have not been returned`;
			return myResponse.response(res, "failed", "", 409, message);
		}

		// check if book is exists
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}

		const bookLeft = await booksModel.getDataById(id);
		const bookQuantity = bookLeft[0].quantity;
		let bookData = {};
		if (bookQuantity > 0) {
			bookData = {
				quantity: bookQuantity + 1,
				status: 0
			}
		}

		// returning the book (updating quantity)
		const updateBookQuantity = await booksModel.updateData(bookData, id);
		// if update quantity of the book failed
		if (updateBookQuantity.affectedRows < 1) {
			const message = `Failed to return a book`;
			return myResponse.response(res, "failed", "", 500, message);
		}

		const historyId = historyData[0].history_id;
		const returnData = {
			done: 1
		}
		const returnBook = await historiesModel.updateData(returnData, historyId);

		if (returnBook.affectedRows > 0) {
			const data = {
				history_id: historyData[0].history_id,
				title: oldData[0].title
			}
			const message = `Book returned`;
			return myResponse.response(res, "success", data, 200, message);
		} else {
			// restoring back the book quantity
			if (bookQuantity > 0) {
				bookData = {
					quantity: bookQuantity - 1
				}
			}
			// if book less than 2, set book status to available
			else if (bookQuantity === 0) {
				bookData = {
					quantity: bookQuantity - 1,
					status: 1
				}
			}

			const restoreBookQuantity = await booksModel.updateData(bookData, id);
			if (restoreBookQuantity.affectedRows < 1) {
				// if restoring book quantity failed
				const message = `Failed to return a book, book data not restored`;
				return myResponse.response(res, "failed", "", 500, message);
			}

			const message = `Failed to borrow a book, book data restored`;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

module.exports = {
	getBookDetail,
	postBook,
	patchBook,
	deleteBook,
	getBooks,
	borrowBook,
	returnBook
}