/**
 * Like SQL Generator
 */
module.exports = {
  createSQLLikeFromObj: function (filters = {}) {
    let result = "";
    const length = Object.keys(filters).length - 1;
    let i = 0;
    for (key in filters) {
      const filter = "'%" + filters[key] + "%'";
      let field = "" + key;
      result += (i == length) ? `${field} LIKE ${filter}` : `${field} LIKE ${filter} OR `;
      i++;
    }

    return result;
  },
  createSQLANDFromObj: function (filters = {}) {
    let result = '(';
    const prefix = 'AND ';
    Object.keys(filters).map(filter => {
      result += `${filter} = '${filters[filter]}' ${prefix}`
    })
    result = result.substr(0, result.length - prefix.length)
    result += ')'
    return result;
  },
  createSQLLikeFromObj: function (fields = {}, keyword = "") {
    let result = '(';
    const prefix = 'OR ';
    Object.keys(fields).map(field => {
      result += `${field} LIKE '%${keyword}%' ${prefix}`
    })
    result = result.substr(0, result.length - prefix.length)
    result += ')'
    
    return result;
  },
  createQuery: function (query, filters, totalData, fields) {
    const search = filters.search;
    const filter = filters.filter;
    const sort = filters.sort;
    const pagination = filters.pagination;
    let sqlQuery = query;

    // search
    if (Object.keys(search).length > 0) {
      sqlQuery += " WHERE " + this.createSQLLikeFromObj(fields, filters.search.search);
    }

    // filter
    if (Object.keys(filter).length > 0) {
      if (Object.keys(search).length > 0) {
        sqlQuery += ' AND '
      } else {
        sqlQuery += ' WHERE '
      }
      sqlQuery += this.createSQLANDFromObj(filter);
    }

    // sort
    const defaultField = Object.keys(fields);
    if (Object.keys(sort).length > 0 && (sort.sort_by && sort.sort_type)) {
      sqlQuery += " ORDER BY " + sort.sort_by;
      sqlQuery += sort.sort_type === 'asc' ? ' ASC' : ' DESC';
    } else if (Object.keys(sort).length === 1) {
      if (sort.sort_by && !sort.sort_type) sqlQuery += ` ORDER BY ${sort.sort_by} ASC`;
      if (!sort.sort_by && sort.sort_type) {
        sqlQuery += ' ORDER BY ' + defaultField[1];
        sqlQuery += sort.sort_type === 'asc' ? ' ASC' : ' DESC';
      }
    } else {
      sqlQuery += ' ORDER BY ' + defaultField[1] + ' ASC'
    }

    // pagination
    var dataPerPage = 5;
    var activePage = 1;
    var totalPage = 0;

    if (Object.keys(pagination).length == 2) {

      if (pagination.limit) {
        var dataPerPage = parseInt(pagination.limit);
      }
      if (pagination.page) {
        var activePage = parseInt(pagination.page);
      }

      let firstData = (dataPerPage * activePage) - dataPerPage;
      sqlQuery += ("page" in pagination) ? " LIMIT " + firstData + ", " + dataPerPage + " " : "";

      var totalPage = Math.ceil(totalData / dataPerPage);
    }

    return {
      sqlQuery,
      totalPage
    };
  },
  generateFilters: function(filters = {}, fields = {}) {
    let filter = {};
    let search = {};
    let pagination = {};
    let sort = {};

    // get filter
    for (field in fields) {
      // get field name
      const fieldName = fields[field];

      for (fltr in filters) {
        // masukin ke filter
        if (fltr == fieldName) {
          if (fltr in filter == false) {
            filter[fltr] = filters[fltr];
          }
        }
      }
    }

    // get search
    if (filters.search && filters.search.length > 0) {
      search.search = filters.search
    }

    // get pagination
    if ((filters.page && filters.page > 0) && (filters.limit && filters.limit > 0)) {
      pagination.page = filters.page;
      pagination.limit = filters.limit;
    }

    // get sort
    if (filters.sort_by && filters.sort_by.length > 0) {
      sort.sort_by = (filters.sort_by);
    }
    if (filters.sort_type && filters.sort_type.length > 0) {
      sort.sort_type = (filters.sort_type);
    }

    return {
      filter,
      search,
      pagination,
      sort
    };
  }
}