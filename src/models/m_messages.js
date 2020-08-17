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
    const sqlQuery = "INSERT INTO messages SET ?, message_read = 0; SELECT * FROM messages WHERE id = LAST_INSERT_ID()";
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

function getDataByUserId(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT 
      m.*, 
      u.full_name,
      u.email,
      u.image,
      u.online,
      u.location
    FROM 
      messages m 
    LEFT JOIN 
      messages m1 
    ON 
    (
      (
        (m.sender_id = m1.sender_id AND m.receiver_id = m1.receiver_id) 
        OR 
        (m.sender_id = m1.receiver_id and m.receiver_id = m1.sender_id )
      ) 
      AND 
      CASE 
        WHEN m.created_at = m1.created_at THEN m.id < m1.id 
        ELSE m.created_at < m1.created_at 
      END 
    ) 
    INNER JOIN 
      users as u
    ON 
      (m.sender_id = u.id OR m.receiver_id = u.id) 
    WHERE 
      u.id != ? 
    AND 
    m1.id is null 
    AND ? IN(m.sender_id, m.receiver_id) 
    ORDER BY m.created_at DESC
    `;
    conn.query(sqlQuery, [id, id], function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getNewDataByUserId(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT 
      u.*,
      m.*
    FROM 
      messages AS m 
    INNER JOIN 
      users AS u 
    ON u.id=m.sender_id 
    WHERE m.id 
    IN (
        SELECT 
          MAX(id) 
        FROM 
        messages AS m 
        WHERE 
        m.receiver_id = ?
        GROUP BY 
        m.sender_id
    ) 
    AND
    m.message_read = 0
    ORDER BY m.created_at DESC
    `;
    conn.query(sqlQuery, id, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataByUserIds(senderID, receiverID) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT * FROM
      messages AS m
    WHERE 
      (m.sender_id=${senderID} OR m.receiver_id=${senderID})
    AND
      (m.sender_id=${receiverID} OR m.receiver_id=${receiverID})  
    ORDER BY m.id  ASC
    `;
    conn.query(sqlQuery, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataStatus(receiverID) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT 
      sender_id, 
      receiver_id, 
      COUNT(*) AS total
    FROM 
      messages
    WHERE 
      message_read = 0
    AND 
      receiver_id = ?
    GROUP BY
    sender_id,
    receiver_id`;
    conn.query(sqlQuery, receiverID, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function setDataStatus(senderID, receiverID) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE messages SET message_read = 1 WHERE sender_id = ? AND receiver_id = ? AND message_read = 0";
    conn.query(sqlQuery, [senderID, receiverID], function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function deleteDataByUserId(id1, id2) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `DELETE FROM messages WHERE (sender_id=${id1} OR receiver_id=${id1}) AND (sender_id=${id2} OR receiver_id=${id2})`;
    conn.query(sqlQuery, function (error, result) {
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
  getFieldsName,
  getTotalData,
  getDataByUserId,
  getNewDataByUserId,
  getDataByUserIds,
  setDataStatus,
  getDataStatus,
  deleteDataByUserId
}