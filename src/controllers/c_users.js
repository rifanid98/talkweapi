/**
 * Model
 * .
 * Load Model
 */
const usersModel = require("../models/m_users");
const friendsModel = require("../models/m_friends");
const messagesModel = require("../models/m_messages");

/**
 * custom response helper
 * .
 * merapihkan output
 * response: function(res, statusExecution, data, statusCode, message)
 */
const myResponse = require("../helpers/myResponse");

// import joi
const validate = require('../helpers/joiSchema');

// import bcrypt
const bcrypt = require("bcrypt");

// import jwt
const jwt = require("jsonwebtoken");

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
	let filter = {};
	let search = {};
	let pagination = {};
	let sort = {};

	// get filter
	for (field in fields) {
		// get field name
		const fieldName = fields[field];

		for (fltr in filters) {
			// masukin ke filter
			if (fltr == fieldName) {
				if (fltr in filter == false) {
					filter[fltr] = filters[fltr];
				}
			}
		}
	}

	// get search
	if (filters.search && filters.search.length > 0) {
		search.search = filters.search
	}

	// get pagination
	if ((filters.page && filters.page > 0) && (filters.limit && filters.limit > 0)) {
		pagination.page = filters.page;
		pagination.limit = filters.limit;
	}

	// get sort
	if (filters.sort_by && filters.sort_by.length > 0) {
		sort.sort_by = (filters.sort_by);
	}
	if (filters.sort_type && filters.sort_type.length > 0) {
		sort.sort_type = (filters.sort_type);
	}

	return {
		filter,
		search,
		pagination,
		sort
	};
}

/**
 * CRUD
 */
async function getUsers(req, res) {
	try {
		const filters = req.query;
		const fields = await usersModel.getFieldsName();
		const totalData = await usersModel.getTotalData();
		const generatedFilters = generateFilters(filters, fields);
		const result = await usersModel.getData(generatedFilters, totalData, fields);
		if (result.result > 0) {
			result.previousPage = req.protocol + '://' + req.get('host') + req.originalUrl;
			if (req.query.page > 1) result.previousPage = result.previousPage.replace(`page=${req.query.page}`, `page=${parseInt(req.query.page) - 1}`)
			result.nextPage = req.protocol + '://' + req.get('host') + req.originalUrl;
			result.nextPage = result.nextPage.replace(`page=${req.query.page}`, `page=${parseInt(req.query.page) + 1}`)
		}
		return myResponse.response(res, "success", result, 200, "Ok!");
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function postUser(req, res) {
	try {
		// Joi validation
		const fieldToPatch = Object.keys(req.body);
		await validate.validateUsers(req.body, fieldToPatch);

		const body = req.body;
		const checkUser = await usersModel.getDataByName(body.username);

		if (checkUser.length > 0) {
			if (req.file) {
				// delete new image when duplicated data
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);
			}

			const message = `Duplicate data ${body.username}`;
			return myResponse.response(res, "failed", "", 409, message);
		}

		if (req.file === undefined) {
			// set default file when no image to upload
			body.image = `avatar.png`;
			// body.image = `${config.imageUrlPath(req)}avatar.png`;
		} else {
			if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
				// get the image name and set into data
				body.image = `${req.file.filename}`;
				// body.image = `${config.imageUrlPath(req)}${req.file.filename}`;
			} else {
				// delete new file when not an image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);

				const message = `There is no image to upload`;
				return myResponse.response(res, "failed", "", 500, message);
			}
		}

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(body.password, salt);
		body.password = hash;

		const result = await usersModel.addData(body);
		if (result.affectedRows > 0) {
			body.id = result.insertId;
			delete body.password
			return myResponse.response(res, "success", body, 201, "Created!");
		} else {
			if (req.file) {
				// delete new image when insert data is failed
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);
			}

			const message = `Add data failed`;
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

async function patchUser(req, res) {
	try {
		// get data to validate
		const fieldToPatch = Object.keys(req.body);
		await validate.validateUsers(req.body, fieldToPatch);

		// checking if data is exists or not
		const id = req.params.id;
		const oldData = await usersModel.getDataById(id);
		if (oldData.length < 1) {
			// delete new image when duplicated data
			const myRequest = { protocol: req.protocol, host: req.get('host') }
			deleteImage.delete(myRequest, req.file.filename);

			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}

		// checking if user want to change the username of user
		const body = req.body;
		if (body.username !== undefined) {
			const checkUser = await usersModel.getDataByName(body.username);
			if (checkUser.length > 0) {
				if (req.file) {
					// delete new image when duplicated data
					const myRequest = { protocol: req.protocol, host: req.get('host') }
					deleteImage.delete(myRequest, req.file.filename);
				}

				const message = `Duplicate data ${body.username}`;
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
					// image: `${config.imageUrlPath(req)}${req.file.filename}`,
					image: `${req.file.filename}`,
				};
			} else {
				// delete new file when not an image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, req.file.filename);

				const message = `There is no image to upload`;
				return myResponse.response(res, "failed", "", 500, message);
			}
		}

		if (data.password) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(data.password, salt);
			data.password = hash;
		}

		// update the user data
		const result = await usersModel.updateData(data, id);

		// prepare the respond data
		const newData = {
			user_id: id,
			...data,
		};

		// if update is success
		if (result.affectedRows > 0) {
			const imageName = oldData[0].image;
			// const imageName = oldData[0].image.split('/').pop();
			if (imageName != 'avatar.png' && req.file !== undefined) {
				// delete old image when not default image
				const myRequest = { protocol: req.protocol, host: req.get('host') }
				deleteImage.delete(myRequest, oldData[0].image);
			}
			delete newData.password
			req.io.emit('refresh', {})
			return myResponse.response(res, "success", newData, 200, "Updated!");
		}
		// if update is failed
		else {
			// delete new image when update data is failed
			const myRequest = { protocol: req.protocol, host: req.get('host') }
			deleteImage.delete(myRequest, req.file.filename);

			const message = `Update data ${data.username} failed `;
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

async function deleteUser(req, res) {
	try {
		const id = req.params.id;
		const oldData = await getUserById(id);
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}
		const result = await usersModel.deleteData(id);
		if (result.affectedRows > 0) {
			const imageName = oldData[0].image.split('/').pop();
			if (imageName != 'avatar.png') {
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
async function getUserById(req, res) {
	try {
		const id = req.params.id;
		const result = await usersModel.getDataById(id);
		
		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getUsersList(req, res) {
	try {
		const id = req.params.id;
		const result = await usersModel.getDatasList(id);
		
		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getFriendsList(req, res) {
	try {
		const id = req.params.id;
		const result = await friendsModel.getDataFriendsList(id);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getFriendsRequest(req, res) {
	try {
		const id = req.params.id;
		const result = await friendsModel.getDataFriendsRequest(id);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getFriends(req, res) {
	const status = req.params.status;
	switch (status) {
		case 'pending':
			getFriendsRequest(req, res)
	}
}

async function getUserMessages(req, res) {
	try {
		const id = req.params.id;
		const result = await messagesModel.getDataByUserId(id);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getNewUserMessages(req, res) {
	try {
		const id = req.params.id;
		const result = await messagesModel.getNewDataByUserId(id);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function deleteUserMessages(req, res) {
	try {
		const id1 = req.params.id1;
		const id2 = req.params.id2;
		const result = await messagesModel.deleteDataByUserId(id1, id2);
		if (result.affectedRows > 0) {
			req.io.emit('refresh', {});
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

module.exports = {
	postUser,
	patchUser,
	deleteUser,
	getUsers,
	getUserById,
	getUsersList,
	getFriendsList,
	getFriendsRequest,
	getFriends,
	getUserMessages,
	getNewUserMessages,
	deleteUserMessages
}