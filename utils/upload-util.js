const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const {makeValidFileName} = require('./image-util');
const config = require('../configs/config');
const {asyncResizeImage} = require('../utils/image-util');

let bookingAttachmentsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `./uploads/bookingAttachments`;
        fs.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename: function (req, file, cb) {
        let date = Date.now();
        let fileName = file.originalname.split('.');
        fileName = fileName.slice(0, fileName.length - 1).toString();
        let fileExt = file.originalname.split('.').pop();
        let isLatinName = /^[A-Za-z0-9!@#$%^&()_ -]+$/.test(fileName);

        if (isLatinName) {
            file.originalname = file.originalname.replace(/ /g, '_');
        } else {
            file.originalname = `file.${fileExt}`;
        }

        cb(null, `${date}-${file.originalname}`);
    }
});

// upload file middleware with cheking on pdf file extension
const uploadBookingAttachments = multer({
    storage: bookingAttachmentsStorage,
    fileFilter: function (req, file, cb) {
        let filetypes = /doc|docx|pdf|xls|xlsx|csv|jpeg|jpg|png|gif|txt|rtf/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        let err = new Error('File extension not match');
        err.code = 400;
        return cb(err);
    },
    limits: {
        fileSize: 64 * 1024 * 1024 //  64 MB
    }
});

/*const uploadPublicImageStorage = multer.diskStorage({
    destination(req, file, cb) {
        const path = `./public/uploads/images`;
        fs.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename(req, file, cb) {

        let fileName = file.originalname.split('.');
        fileName = fileName.slice(0, fileName.length - 1).toString();
        let fileExt = file.originalname.split('.').pop();
        let isLatinName = /^[A-Za-z0-9!@#$%^&()_ -]+$/.test(fileName);

        if (isLatinName) {
            file.originalname = file.originalname.replace(/ /g, '_');
        } else {
            file.originalname = `image.${fileExt}`
        }
        cb(null, `${uuid.v1()}-${file.originalname}`);
    }
});

const uploadPublicImage = multer({
    storage: uploadPublicImageStorage,
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        let err = new Error('File extension not match');
        err.code = 400;
        return cb(err);
    },
    limits: { fileSize: 1024 * 1024 * 10 } // 10 Mb

});*/

const uploadPublicImageStorage = multer.diskStorage({
    destination(req, file, cb) {
        const type = config.UPLOAD_IMAGE_TYPES.includes(req.query.type) ? req.query.type+'/' : '';
        const path = './public/uploads/'+ type;
        fs.mkdirSync(path, { recursive: true });
        req.body.path = path;
        return cb(null, path);
    },
    filename(req, file, cb) {
        let fileName = file.originalname.split('.');
        fileName = fileName.slice(0, fileName.length - 1).toString();
        let fileExt = file.originalname.split('.').pop();

        file.originalname = makeValidFileName(fileName, fileExt, req.body.path) +'.'+fileExt;

        cb(null, `${file.originalname}`);
    }
});

const uploadPublicImage = multer({
    storage: uploadPublicImageStorage,
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        let err = new Error('File extension not match');
        err.code = 400;
        return cb(err);
    },
    limits: { fileSize: 1024 * 1024 * 10 } // 10 Mb

});


module.exports = {
    uploadPublicImage: uploadPublicImage,
    uploadBookingAttachments: uploadBookingAttachments
};
