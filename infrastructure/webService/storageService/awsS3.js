const AWS = require('../awsConfig');

const multer = require('multer');
const multerS3 = require('multer-s3');

module.exports = class {
    constructor() {
        this.s3 = new AWS.S3();
    }
    // 개인 프로필 임시저장 업로드 데이터 저장
    uploadConsultantProfileTemp(req, res, next) {
        let storage = multerS3({
            s3: this.s3,
            bucket: 'securist-user',
            acl: 'public-read-write',
            key: function (req, file, cb) {
                // console.log('444444444444444444444444444444', file);
                cb(
                    null,
                    `consultant/profile/temp/${file.fieldname}/${Date.now()}_${
                        file.originalname
                    }`
                );
            },
        });
        console.log('s3 리퀘스트', req);
        let upload = multer({ storage: storage });
        return upload;
    }
    // 개인 프로필 정보 업로드 데이터 저장
    uploadConsultantProfile(req, res, next) {
        let storage = multerS3({
            s3: this.s3,
            bucket: 'securist-user',
            acl: 'public-read-write',
            key: function (req, file, cb) {
                // console.log('444444444444444444444444444444', file);
                cb(
                    null,
                    `consultant/profile/certification/${
                        file.fieldname
                    }/${Date.now()}_${file.originalname}`
                );
            },
        });
        console.log('s3 리퀘스트', req);
        let upload = multer({ storage: storage });
        return upload;
    }
    // 기업 프로필 임시저장 업로드 데이터 저장
    uploadConsultingCompanyBusinessLicenseTemp(req, res, next) {
        console.log('s3 리퀘스트1111111', req);
        let storage = multerS3({
            s3: this.s3,
            bucket: 'securist-user',
            acl: 'public-read-write',
            key: function (req, file, cb) {
                console.log('5555555555555555555555', file);
                cb(
                    null,
                    `consulting-company/temp/business-license/${Date.now()}_${
                        file.originalname
                    }`
                );
            },
        });
        let upload = multer({ storage: storage });
        return upload;
    }
    // 기업 프로필 정보 업로드 데이터 저장
    uploadConsultingCompanyBusinessLicense(req, res, next) {
        console.log('s3 리퀘스트1111111', req);
        let storage = multerS3({
            s3: this.s3,
            bucket: 'securist-user',
            acl: 'public-read-write',
            key: function (req, file, cb) {
                console.log('5555555555555555555555', file);
                cb(
                    null,
                    `consulting-company/business-license/${Date.now()}_${
                        file.originalname
                    }`
                );
            },
        });
        let upload = multer({ storage: storage });
        return upload;
    }
};
