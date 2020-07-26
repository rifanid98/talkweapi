
/**
 * Multer File Handling
 */
// import multer
const multer = require('multer');
// import path
const path = require('path');
// set storage
const storage = multer.diskStorage({
    destination: path.join('src/assets/images/'),
    filename: function (req, file, cb) {
        const originalName = file.originalname.split(' ');
        const newName = originalName.join('-');
        cb(null, new Date().toISOString() + newName);
    }
});
// set file filter
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // reject files
        cb(null, false);
    }
};
// set upload multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    // fileFilter: fileFilter,
});

module.exports = upload;