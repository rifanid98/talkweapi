/**
 * Model
 * .
 * Load Model
 */
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

// import custom error message
const errorMessage = require("../helpers/myErrorMessage");

const myHelpers = require("../helpers/myHelpers");

/**
 * CRUD
 */
async function getMessages(req, res) {
	try {
		const filters = req.query;
		const fields = await messagesModel.getFieldsName();
		const totalData = await messagesModel.getTotalData();
		const generatedFilters = myHelpers.generateFilters(filters, fields);
		const result = await messagesModel.getData(generatedFilters, totalData, fields);
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

async function postMessage(req, res) {
	try {
		// Joi validation
		const fieldToPatch = Object.keys(req.body);
		await validate.validateMessages(req.body, fieldToPatch);

		const body = req.body;
		// execute multipleStatements, so the output must be 2 rows
		// [0] is result of insert statement
		// [1] is result of select setatement
		// see messagesModel.addData on m_messages.js file
		const result = await messagesModel.addData(body);
		if (result[0].affectedRows > 0) {
			body.id = result.insertId
			// send message to client
			let message = {};
			await result[1].map(result => message = result);
			req.io.emit('privateMessage', {
				sender_id: parseInt(req.body.sender_id),
				receiver_id: parseInt(req.body.receiver_id),
				message: message
			});
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

async function patchMessage(req, res) {
	try {
		// get data to validate
		const fieldToPatch = Object.keys(req.body);
		await validate.validateMessages(req.body, fieldToPatch);

		// checking if data is exists or not
		const body = req.body;
		const id = req.params.id;
		const oldData = await messagesModel.getDataById(id);
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}
		// update the message data
		const result = await messagesModel.updateData(body, id);

		// prepare the respond data
		const data = {
			id: id,
			...body,
		};

		// if update is success
		if (result.affectedRows > 0) {
			return myResponse.response(res, "success", data, 200, "Updated!");
		}
		// if update is failed
		else {
			const message = `Update data ${data.messagename} failed `;
			return myResponse.response(res, "failed", "", 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function deleteMessage(req, res) {
	console.log('delete')
	try {
		const id = req.params.id;
		const oldData = await messagesModel.getDataById(id);
		if (oldData.length < 1) {
			const message = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, message);
		}
		const result = await messagesModel.deleteData(id);
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
async function getMessageById(req, res) {
	try {
		const id = req.params.id;
		const result = await messagesModel.getDataById(id);
		
		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getConversationsMessage(req, res) {
	try {
		const senderID = req.params.senderID;
		const receiverID = req.params.receiverID;
		const result = await messagesModel.getDataByUserIds(senderID, receiverID);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function getMessageStatus(req, res) {
	try {
		const receiverID = req.params.receiverID;
		const result = await messagesModel.getDataStatus(receiverID);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function setMessageStatus(req, res) {
	try {
		const senderID = req.params.senderID;
		const receiverID = req.params.receiverID;
		const result = await messagesModel.setDataStatus(senderID, receiverID);

		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}


module.exports = {
	postMessage,
	patchMessage,
	deleteMessage,
	getMessages,
	getMessageById,
	getConversationsMessage,
	setMessageStatus,
	getMessageStatus
}