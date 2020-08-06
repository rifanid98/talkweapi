/**
 * JOI!
 */
const Joi = require('joi');

/**
 * Custom Joi Error Handling
 */
function myJoiError(error = {}) {
	const joiError = error.error.details[0];
	const errorMessage = {
		joiError: 'joi',
		message: joiError.message
	};

	return errorMessage;
}

module.exports = {
	/**
	 * Dynamic Schema Example
	 */
	validateBooks: function (book, field = null) {
		const joiSchema = {
			// bookImage: Joi.required(),
			title: Joi.string().trim().min(3).required(),
			description: Joi.string().trim().min(3).required(),
			author_id: Joi.number().min(1).required(),
			status: Joi.number().min(0).max(1).required(),
			quantity: Joi.number().min(1).required(),
			genre_id: Joi.number().min(0).required()
		};

		if (!field) {
			return new Promise((resolve, reject) => {
				const error = Joi.validate(book, joiSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		} else {
			const dynamicSchema = Object.keys(joiSchema)
				.filter(key => field.includes(key))
				.reduce((obj, key) => {
					obj[key] = joiSchema[key];
					return obj;
				}, {});
			return new Promise((resolve, reject) => {
				const error = Joi.validate(book, dynamicSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		}
	},

	/**
	 * Authentication Schemas
	 */
	validateRegister: function (userData) {
		const joiSchema = {
			username: Joi.string().trim().min(3).required(),
			full_name: Joi.string().trim().min(3).required(),
			password: Joi.string().trim().min(3).required(),
			email: Joi.string().email({ minDomainAtoms: 2 }),
			role: Joi.number().min(1).required()
		};

		return new Promise((resolve, reject) => {
			const error = Joi.validate(userData, joiSchema);

			if (error.error != null) {
				reject(myJoiError(error));
			}
			resolve();
		});
	},
	validateLogin: function (userData) {
		const joiSchema = {
			username: Joi.string().trim().min(3).required(),
			password: Joi.string().trim().min(3).required()
		};

		return new Promise((resolve, reject) => {
			const error = Joi.validate(userData, joiSchema);

			if (error.error != null) {
				reject(myJoiError(error));
			}
			resolve();
		});
	},
	validateUsers: function (user, field = null) {
		const joiSchema = {
			username: Joi.string().trim().min(3).required(),
			full_name: Joi.string().trim().min(3).required(),
			password: Joi.string().trim().min(3).required(),
			email: Joi.string().email({ minDomainAtoms: 2 }),
			role: Joi.number().min(1).max(3).required(),
			online: Joi.number().min(0).max(1).required(),
			status: Joi.string().trim().min(3).required(),
			location: Joi.string().trim().min(3).required(),
			location_share: Joi.number().min(0).max(1).required(),
		};

		if (!field) {
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, joiSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		} else {
			const dynamicSchema = Object.keys(joiSchema)
				.filter(key => field.includes(key))
				.reduce((obj, key) => {
					obj[key] = joiSchema[key];
					return obj;
				}, {});
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, dynamicSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		}
	},
	validateFriends: function (user, field = null) {
		const joiSchema = {
			user_id1: Joi.number().min(1).required(),
			user_id2: Joi.number().min(1).required(),
			status: Joi.number().min(1).required(),
		};

		if (!field) {
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, joiSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		} else {
			const dynamicSchema = Object.keys(joiSchema)
				.filter(key => field.includes(key))
				.reduce((obj, key) => {
					obj[key] = joiSchema[key];
					return obj;
				}, {});
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, dynamicSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		}
	},
	validateMessages: function (user, field = null) {
		const joiSchema = {
			sender_id: Joi.number().min(1).required(),
			receiver_id: Joi.number().min(1).required(),
			message: Joi.string().trim().min(1).required(),
			// attachment_id: Joi.number().min(1).required(),
		};

		if (!field) {
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, joiSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		} else {
			const dynamicSchema = Object.keys(joiSchema)
				.filter(key => field.includes(key))
				.reduce((obj, key) => {
					obj[key] = joiSchema[key];
					return obj;
				}, {});
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, dynamicSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		}
	},
	validateAttachments: function (user, field = null) {
		const joiSchema = {
			file: Joi.string().trim().min(1).required(),
		};

		if (!field) {
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, joiSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		} else {
			const dynamicSchema = Object.keys(joiSchema)
				.filter(key => field.includes(key))
				.reduce((obj, key) => {
					obj[key] = joiSchema[key];
					return obj;
				}, {});
			return new Promise((resolve, reject) => {
				const error = Joi.validate(user, dynamicSchema);

				if (error.error != null) {
					reject(myJoiError(error));
				}
				resolve();
			});
		}
	},
	validateRefreshToken: function (userData) {
		const joiSchema = {
			tokenRefresh: Joi.string().trim().min(3).required()
		};

		return new Promise((resolve, reject) => {
			const error = Joi.validate(userData, joiSchema);

			if (error.error != null) {
				reject(myJoiError(error));
			}
			resolve();
		});
	}
}
