/**
 * Model
 * .
 * Load Model
 */
const attachmentsModel = require("../models/m_attachments");

/**
 * custom response helper
 * .
 * merapihkan output
 * response: function(res, statusExecution, data, statusCode, attachment)
 */
const myResponse = require("../helpers/myResponse");

// import joi
const validate = require('../helpers/joiSchema');

// import custom error attachment
const errorMessage = require("../helpers/myErrorMessage");

const myHelpers = require("../helpers/myHelpers");

/**
 * CRUD
 */
async function getAttachments(req, res) {
	try {
		const filters = req.query;
		const fields = await attachmentsModel.getFieldsName();
		const totalData = await attachmentsModel.getTotalData();
		const generatedFilters = myHelpers.generateFilters(filters, fields);
		const result = await attachmentsModel.getData(generatedFilters, totalData, fields);
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

async function postAttachment(req, res) {
	try {
		// Joi validation
		const fieldToPatch = Object.keys(req.body);
		await validate.validateAttachments(req.body, fieldToPatch);

		const body = req.body;
		const result = await attachmentsModel.addData(body);
		if (result.affectedRows > 0) {
			body.id = result.insertId
			return myResponse.response(res, "success", body, 201, "Created!");
		} else {
			const attachment = `Add data failed`;
			return myResponse.response(res, "failed", "", 500, attachment);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function patchAttachment(req, res) {
	try {
		// get data to validate
		const fieldToPatch = Object.keys(req.body);
		console.log(fieldToPatch)
		await validate.validateAttachments(req.body, fieldToPatch);

		// checking if data is exists or not
		const body = req.body;
		const id = req.params.id;
		const oldData = await attachmentsModel.getDataById(id);
		if (oldData.length < 1) {
			const attachment = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, attachment);
		}
		// update the attachment data
		const result = await attachmentsModel.updateData(body, id);

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
			const attachment = `Update data ${data.attachmentname} failed `;
			return myResponse.response(res, "failed", "", 500, attachment);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function deleteAttachment(req, res) {
	console.log('delete')
	try {
		const id = req.params.id;
		const oldData = await attachmentsModel.getDataById(id);
		if (oldData.length < 1) {
			const attachment = `Data with id ${id} not found`;
			return myResponse.response(res, "failed", "", 404, attachment);
		}
		const result = await attachmentsModel.deleteData(id);
		if (result.affectedRows > 0) {
			return myResponse.response(res, "success", "", 200, 'Deleted');
		} else {
			const attachment = `Internal Server Error`;
			return myResponse.response(res, "failed", "", 500, attachment);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

/**
 * Another CRUD
 */
async function getAttachmentById(req, res) {
	try {
		const id = req.params.id;
		const result = await attachmentsModel.getDataById(id);
		if (result.length < 1) {
			const message = `Data with id ${id} not found`
			return myResponse.response(res, "failed", result, 404, message);
		}
		return myResponse.response(res, "success", result, 200, 'Ok');
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}


module.exports = {
	postAttachment,
	patchAttachment,
	deleteAttachment,
	getAttachments,
	getAttachmentById,
}