/**
 * Model
 * .
 * Load Model
 */
const authModel = require("../models/m_auth");

/**
 * custom response helper
 * .
 * merapihkan output
 * response: function(res, statusExecution, data, statusCode, message)
 */
const myResponse = require("../helpers/myResponse");

// import joi
const validate = require("../helpers/joiSchema");
// const validate = require("../helpers/joiSchema");

// import bcrypt
const bcrypt = require("bcrypt");

// import jwt
const jwt = require("jsonwebtoken");

// import
const config = require("../configs/global");

// import custom error message
const errorMessage = require("../helpers/myErrorMessage");

/**
 * CRUD
 */

async function register(req, res) {
	try {
		const body = req.body;
		const error = await validate.validateRegister(body);

		const checkData = await authModel.getDataByName(body.username);
		console.log(checkData);

		if (checkData < 1) {
			if (req.file === undefined) {
				// set default file when no image to upload
				body.image = `${config.imageUrlPath(req)}avatar.png`;
			}

			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(body.password, salt);
			body.password = hash;
			body.role = 3;

			const result = await authModel.register(body);
			delete body.password;
			return myResponse.response(res, "success", body, 201, "Created!");
		} else {
			const message = `duplicate data. ${body.username} is exists`;
			return myResponse.response(res, "failed", "", 409, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function login(req, res) {
	try {
		const data = req.body;
		const error = await validate.validateLogin(data);

		const result = await authModel.login(data.username);
		if (result.length > 0) {
			if (bcrypt.compareSync(data.password, result[0].password)) {
				delete result[0].password;

				// jsonwebtoken
				const tokenLoginData = {
					user_id: result[0].user_id,
					role: result[0].role,
					name: result[0].username,
					image: result[0].image,
					tokenType: 'login'
				};
				const token = jwt.sign(tokenLoginData, config.jwtSecretKey, { expiresIn: config.jwtTokenLoginLifeTime });
				const tokenRefreshData = {
					user_id: result[0].user_id,
					role: result[0].role,
					name: result[0].username,
					tokenType: 'refresh'
				};
				const tokenRefresh = jwt.sign(tokenRefreshData, config.jwtSecretKey, { expiresIn: config.jwtTokenRefreshLifeTime });
				result[0].tokenLogin = token;
				result[0].tokenRefresh = tokenRefresh;

				return myResponse.response(res, "success", result, 200, "Ok!");
			} else {
				const message = `Username or Password is wrong!`;
				return myResponse.response(res, "failed", "", 400, message);
			}
		} else {
			const message = `Username or Password is wrong!`;
			return myResponse.response(res, "failed", "", 400, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

async function refresh_token(req, res) {
	try {
		const data = req.body;
		const error = await validate.validateRefreshToken(data);

		const tokenRefresh = data.tokenRefresh;
		const decoded = jwt.verify(tokenRefresh, config.jwtSecretKey);
		console.log(decoded);

		if (decoded.tokenType == 'refresh') {
			delete decoded.iat;
			delete decoded.exp;
			decoded.tokenType = 'login';
			const tokenLogin = jwt.sign(decoded, config.jwtSecretKey, { expiresIn: config.jwtTokenLoginLifeTime });
			decoded.tokenType = 'refresh';
			const tokenRefresh = jwt.sign(decoded, config.jwtSecretKey, { expiresIn: config.jwtTokenRefreshLifeTime });
			return myResponse.response(res, "success", { tokenLogin: tokenLogin, tokenRefresh: tokenRefresh }, 200, "Ok!");
		} else {
			const message = `Wrong token. Please use refresh token`;
			return myResponse.response(res, "failed", error, 500, message);
		}
	} catch (error) {
		console.log(error);
		return myResponse.response(res, "failed", "", 500, errorMessage.myErrorMessage(error, {}));
	}
}

module.exports = {
	register,
	login,
	refresh_token
}