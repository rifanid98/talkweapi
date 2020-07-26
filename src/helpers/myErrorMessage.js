/**
 * My Custom Error
 */
const deleteImage = require("./deleteImage");

module.exports = {
    myErrorMessage: function (error, message) {
        var errorMessage = "Internal Server Error";

        if (Object.keys(error).length < 1 && Object.keys(message).length > 0) {
            var errorMessage = message;
        }
        if (Object.keys(error).length > 0 && Object.keys(message).length < 1) {
            if ('joiError' in error) {
                var errorMessage = error.message;
            }
            if ('sqlMessage' in error) {
                // var errorMessage = error.sqlMessage;
                if (error.errno === 1451) {
                    var errorMessage = "There is still data related to the file you want to delete";
                } else {
                    var errorMessage = "Internal Server Error";
                }
            }
        }
        return errorMessage;
    }
}