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
  const sqlQuery = "SELECT * FROM friends ";
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
    const sqlQuery = "INSERT INTO friends SET ?, status = 0";
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
    const sqlQuery = "UPDATE friends SET ? WHERE id = ?";
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
    const sqlQuery = "DELETE FROM friends WHERE id = ?";
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
    const sqlQuery = "SELECT * FROM friends WHERE id = ?";
    conn.query(sqlQuery, id, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}
function getDataByIds(id1, id2) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT * FROM 
      friends AS f 
    WHERE 
      (f.user_id1 = ${id1} OR f.user_id2 = ${id1}) 
    AND
      (f.user_id1 = ${id2} OR f.user_id2 = ${id2})
    `;
    conn.query(sqlQuery, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}
function getDataByUserId(id1, id2) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT * FROM 
      users AS u,
      friends AS f 
    WHERE 
    (CASE
      WHEN f.user_id1 = ? THEN f.user_id2=u.id
      WHEN f.user_id2 = ? THEN f.user_id1=u.id
    END)
    AND f.status = 0 
    GROUP BY u.id`;
    conn.query(sqlQuery, id2, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataByName(friendname) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM friends WHERE friendname = ?";
    conn.query(sqlQuery, friendname, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataFriendsList(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT
        u.*,
        u.status AS user_status,
        f.*
        FROM 
        users AS u,
        friends AS f 
      WHERE 
      (CASE
        WHEN f.user_id1 = ? THEN f.user_id2=u.id
          WHEN f.user_id2 = ? THEN f.user_id1=u.id
      END)
      AND f.status = 1 
      GROUP BY u.id
    `;
    conn.query(sqlQuery, [id, id], function (error, result) {
      if (error) {
        reject(error);
      }
      result.map(res => delete res.password)
      resolve(result);
    })
  })
}

function getDataFriendsRequest(id) {
  return new Promise((resolve, reject) => {
    // const sqlQuery = `
    //   SELECT
    //     u.id as user_id,
    //     f.*
    //     FROM 
    //     users AS u,
    //     friends AS f 
    //   WHERE 
    //   (CASE
    //     WHEN f.user_id1 = ? THEN f.user_id2=u.id
    //       WHEN f.user_id2 = ? THEN f.user_id1=u.id
    //   END)
    //   AND f.status = 0 
    //   GROUP BY u.id
    // `;
    const sqlQuery = `
      SELECT * FROM 
        friends AS f 
      INNER JOIN 
        users AS u 
      ON 
      u.id = f.user_id1
      AND f.user_id2 = ?
      AND f.status = 0
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
    conn.query(`DESCRIBE friends`, function (error, result) {
      //      conn.query(`DESCRIBE friends`, function (error, result) {
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
    conn.query(`SELECT COUNT(id) AS total_data FROM friends`, function (error, result) {
      //      conn.query(`DESCRIBE friends`, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result[0].total_data);
    })
  })

}

function updateDataFriendRequest(userID, friendID, action) {
  const prepareData = {
    user_id1: userID,
    user_id2: friendID
  }
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    UPDATE friends
    SET status = ?
    WHERE user_id1 = ?
    AND user_id2 = ?;

    INSERT INTO friends  SET ?, status = 1
    `;
    conn.query(sqlQuery, [action, friendID, userID, prepareData], function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}


module.exports = {
  getData,
  addData,
  updateData,
  deleteData,
  getDataById,
  getDataByIds,
  getDataByName,
  getFieldsName,
  getTotalData,
  getDataByUserId,
  getDataFriendsList,
  getDataFriendsRequest,
  updateDataFriendRequest
}
