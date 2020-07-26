// import xss escape characters
require('../helpers/xssEscape');

module.exports = {
    xssEscape: function(req, res, next) {
        for (key in req.query) {
            req.query[key] = req.query[key].escape();
        }
        for (key in req.body) {
            req.body[key] = req.body[key].escape();
        }
        for (key in req.params) {
            req.params[key] = req.params[key].escape();
        }
        // console.log(req.query);
        
        next();
    }
}