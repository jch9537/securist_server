const multer = require('multer');

module.exports = (req, res, next) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `tmp/${file.fieldname}`);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });

    const upload = multer({ storage: storage });
    return upload;
};
