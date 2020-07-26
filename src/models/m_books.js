/**
 * Config MySQL
 * .
 * load config mysql
 */
const conn = require('../helpers/mysql');

/**
 * Custom Function
 */
function generateLike(filters = {}) {
  let result = "";
  const length = Object.keys(filters).length - 1;
  let i = 0;
  for (key in filters) {
    const filter = "'%" + filters[key] + "%'";
    let field = "" + key;
    // if (key == "genre") {
    //     field = key + "_name";
    // }
    result += (i == length) ? `${field} LIKE ${filter}` : `${field} LIKE ${filter} OR `;
    i++;
  }

  return result;
}

/**
 * CRUD
 */
function getAllData() {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM books";
    conn.query(sqlQuery, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function addData(data) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "INSERT INTO books SET ?";
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
    const sqlQuery = "UPDATE books SET ? WHERE book_id = ?";
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
    const sqlQuery = "DELETE FROM books WHERE book_id = ?";
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
function getFieldName() {
  return new Promise((resolve, reject) => {
    conn.query(`DESCRIBE v_book_and_genre`, function (error, result) {
      //      conn.query(`DESCRIBE books`, function (error, result) {
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

function getTotalDataCustom(query, data) {
  return new Promise((resolve, reject) => {
    conn.query(query, data, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result.length);
    })
  })

}

async function getDataCustom(filters) {
  const fields = await this.getFieldName();
  let sqlQuery = "SELECT * FROM `v_book_and_genre` ";

  // search
  if (Object.keys(filters.search).length > 0) {
    sqlQuery += " WHERE " + generateLike(filters.search);
  }

  // sort
  if (Object.keys(filters.sort).length > 0) {
    if (`${filters.sort.sort}` in fields) {
      sqlQuery += " ORDER BY " + filters.sort.sort + " ASC";
    }
  }



  const totalData = await this.getTotalDataCustom(sqlQuery, filters.search);

  // pagination
  var dataPerPage = 5;
  var activePage = 1;
  var totalPage = 0;

  if (Object.keys(filters.pagination).length == 2) {

    if (filters.pagination.limit) {
      var dataPerPage = filters.pagination.limit;
    }
    if (filters.pagination.page) {
      var activePage = filters.pagination.page;
    }

    let first_data = (dataPerPage * activePage) - dataPerPage;
    sqlQuery += ("page" in filters.pagination) ? " LIMIT " + first_data + ", " + dataPerPage + " " : "";

    var totalPage = Math.ceil(totalData / dataPerPage);
  }

  return new Promise((resolve, reject) => {
    conn.query(sqlQuery, filters.search, function (error, result) {
      if (error) {
        reject(error);
      }

      const new_result = {
        totalPage,
        result
      }

      return Object.keys(filters.pagination).length > 0 ? resolve(new_result) : resolve(result);
    })
  })
}

function getDataById(id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM v_book_and_genre WHERE book_id = ?";
    conn.query(sqlQuery, id, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataByTitle(data) {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM books WHERE title = ?";
    conn.query(sqlQuery, data, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataByFilter(filters) {
  return new Promise((resolve, reject) => {
    const newFilters = this.generateLike(filters)
    const sqlQuery = `SELECT * FROM v_book_and_genre WHERE ${newFilters}`;

    conn.query(sqlQuery, filter, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getDataBySort(sort) {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      `SELECT 
            books.*, 
            genres.name 
            FROM 
            books INNER JOIN genres 
            WHERE 
            books.genre_id=genres.genre_id ORDER BY ` + sort.sort + ` ASC`;

    // console.log(sqlQuery);

    conn.query(sqlQuery, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

function getUsedGenres(sort) {
  return new Promise((resolve, reject) => {
    const sqlQuery = 'SELECT `genres`.* FROM `genres` INNER JOIN `books` WHERE `genres`.`genre_id`=`books`.`genre_id` GROUP BY `genres`.`name`';
    conn.query(sqlQuery, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  })
}

module.exports = {
  getFieldName,
  getTotalDataCustom,
  getDataCustom,
  getAllData,
  getDataById,
  getDataByFilter,
  getDataByTitle,
  getDataBySort,
  addData,
  updateData,
  deleteData,
  getUsedGenres
}