/**
 * Config MySQL
 * .
 * load config mysql
 */
const conn = require('../helpers/mysql');

/**
 * Helpers
 */
const myHelpers = require('../helpers/myHelpers');

/**
 * CRUD
 */
function getData(filters, totalData, fields) {
  const sqlQuery = "SELECT * FROM messages ";
  const query = myHelpers.createQuery(sqlQuery, filters, totalData, fields)
  return new Promise((resolve, reject) => {
    conn.query(query.sqlQuery, function (error, result) {
      if (error) {
        reject(error);
      }

      const newResult = {
        totalPage: query.totalPage,
        result
      }
      
      return Object.keys(filters.pagination).length > 0 ? resolve(newResult) : resolve(result);
    })
  })
}

function addData(data) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "INSERT INTO messages SET ?, message_read = 0";
    conn.query(sqlQuery, data, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function updateData(data, id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE messages SET ? WHERE id = ?";
    conn.query(sqlQuery, [data, id], function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function deleteData(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM messages WHERE id = ?";
    conn.query(sqlQuery, id, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

/**
 * Another CRUD
 */
function getDataById(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM messages WHERE id = ?";
    conn.query(sqlQuery, id, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataByFriendId(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT * FROM
      messages as m 
    WHERE 
      m.friend_id = (
        SELECT 
          f.id as friend_id 
        FROM
          users as u 
          INNER JOIN 
          friends as f
        WHERE 
          (u.id = f.user_id1 OR u.id = f.user_id2)
        AND
          f.status = 1 
        AND 
          u.id = ?
        GROUP BY f.id
      )
    `;
    conn.query(sqlQuery, id, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getFieldsName() {
  return new Promise((resolve, reject) => {
    conn.query(`DESCRIBE messages`, function (error, result) {
      //      conn.query(`DESCRIBE messages`, function (error, result) {
      if (error) {
        reject(error);
      }
      let fields = {};
      result.forEach(field => {
        fields[field.Field] = field.Field;
      });
      resolve(fields);
    })
  })

}

function getTotalData() {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT COUNT(id) AS total_data FROM messages`, function (error, result) {
      //      conn.query(`DESCRIBE messages`, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result[0].total_data);
    })
  })

}

module.exports = {
  getData,
  addData,
  updateData,
  deleteData,
  getDataById,
  getFieldsName,
  getTotalData,
  getDataByFriendId
}