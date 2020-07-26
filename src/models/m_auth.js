/**
 * Config MySQL
 * .
 * load config mysql
 */
const conn = require('../helpers/mysql');

module.exports = {
  register: function (data) {
    return new Promise((resolve, reject) => {
      const sqlQuery = "INSERT INTO users SET ?";
      conn.query(sqlQuery, data, function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
    })
  },

  login: function (data) {
    return new Promise((resolve, reject) => {
      const sqlQuery = "SELECT * FROM users WHERE username = ?";
      conn.query(sqlQuery, data, function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
    })
  },

  getDataByName: function (data) {
    return new Promise((resolve, reject) => {
      const sqlQuery = "SELECT * FROM users WHERE username = ?";
      conn.query(sqlQuery, data, function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
    })
  },
}