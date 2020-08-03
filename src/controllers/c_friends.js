/**
 * Model
 * .
 * Load Model
 */
const friendsModel = require("../models/m_friends");

/**
 * custom response helper
 * .
 * merapihkan output
 * response: function(res, statusExecution, data, statusCode, message)
 */
const myResponse = require("../helpers/myResponse");

// import joi
const validate = require('../helpers/joiSchema');

// import custom error message
const errorMessage = require("../helpers/myErrorMessage");

// import delete
const deleteImage = require("../helpers/deleteImage");
const myHelpers = require("../helpers/myHelpers");

/**
 * CRUD
 */
async function getFriends(req, res) {
	try {
		const filters = req.query;
		const fields = await friendsModel.getFieldsName();
		const totalData = await friendsModel.getTotalData();
		const generatedFilters = myHelpers.generateFilters(filters, fields);
		const result = await friendsModel.getData(generatedFilters, totalData, fields);
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

async function postFriend(req, res) {
	try {
		// Joi validation
		const fieldToPatch = Object.keys(req.body);
		await validate.validateFriends(req.body, fieldToPatch);

		const body = req.body;
		const oldData = await friendsModel.getDataByIds(body.user_id1, body.user_id2);
		if (oldData.length > 0) {
			const message = `Duplicate data`;
			return myResponse.response(res, "failed", "", 409, message);
		}
		const result = await friendsModel.addData(body);
		if (result.affectedRows > 0) {
			const result = await friendsModel.getDataFriendsRequest(body.user_id2);
			req.io.emit('notifications', {
				sender_id: parseInt(body.user_id1),
				receiver_id: parseInt(body.user_id2),
				message: 'You have new friend request',
				data: result
			});
			body.id = result.insertId
			return myResponse.response(res, "success", body, 201, "Created!");
		} else {
			const message = `Add data failed`;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function patchFriend(req, res) {
	try {
		// get data to validate
		const fieldToPatch = Object.keys(req.body);
		await validate.validateFriends(req.body, fieldToPatch);

		// checking if data is exists or not
		const id = req.params.id;
		const oldData = await friendsModel.getDataById(id);
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}
		const data = {
			status: 1
		}
		// update the friend data
		const result = await friendsModel.updateData(data, id);

		// prepare the respond data
		const newData = {
			id: id,
			...data,
		};

		// if update is success
		if (result.affectedRows > 0) {
			return myResponse.response(res, "success", newData, 200, "Updated!");
		}
		// if update is failed
		else {
			const message = `Update data ${data.friendname} failed `;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function deleteFriend(req, res) {
	console.log('delete')
	try {
		const id = req.params.id;
		const oldData = await friendsModel.getDataById(id);
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}
		const result = await friendsModel.deleteData(id);
		if (result.affectedRows > 0) {
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
async function getFriendById(req, res) {
	try {
		const id = req.params.id;
		const result = await friendsModel.getDataById(id);
		
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
async function confirmFriendRequest(req, res) {
	try {
		const body = req.body;
		const userID = req.params.userID;
		const friendID = req.params.friendID;
		const action = req.params.action === 'confirm' ? '1' : '2';
		const result = await friendsModel.updateDataFriendRequest(userID, friendID, action);
		if (result[0].affectedRows > 0) {
			req.io.emit('notifications', {
				sender_id: parseInt(userID),
				receiver_id: parseInt(friendID),
				message: 'Your friend request accepted',
			});
			body.id = result[0].insertId;
			return myResponse.response(res, "success", body, 200, 'Ok');
		} else {
			const message = `Confirm friend failed`;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}


module.exports = {
	postFriend,
	patchFriend,
	deleteFriend,
	getFriends,
	getFriendById,
	getFriendsRequest,
	confirmFriendRequest
}