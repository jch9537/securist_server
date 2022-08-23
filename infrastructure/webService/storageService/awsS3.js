const AWS = require('../awsConfig');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

const { etcHelper } = require('../../../domain/helper');
const { StorageServiceError } = require('../../../adapters/error');
const { DataBrew } = require('aws-sdk');

//S3 업로드 경로 지정
const classifyStoragePath = function (requestUrl, fieldName) {
    let storagePath;
    if (requestUrl === '/api/user/my/profile/temp') {
        storagePath = `profile/temp/${fieldName}`;
    }
    return storagePath;
};

module.exports = class AwsS3 {
    constructor() {
        this.s3 = new AWS.S3();

        this.uploadFilesInStorage = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: process.env.AWS_S3_BUCKET_NAME,
                acl: 'public-read-write', // S3 보안 추가 후 수정
                contentDisposition: function (req, file, cb) {
                    cb(
                        null,
                        `attachment; filename="${encodeURIComponent(
                            file.originalname
                        )}"`
                    );
                },
                key: function (req, file, cb) {
                    cb(
                        null,
                        `${classifyStoragePath(
                            req.originalUrl,
                            file.fieldname
                        )}/${new Date().getFullYear()}${
                            new Date().getMonth() + 1
                        }${new Date().getDate()}T${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}_${uuidv4()}${etcHelper.extractExtension(
                            file.originalname
                        )}`
                    );
                },
            }),
            // limits: { fileSize: 20 * 1024 * 1024 }, // 용량 제한
        });

        this.deleteUploadFilesInStorage = this.deleteUploadFilesInStorage.bind(
            this
        );
    }
    // s3 삭제 함수
    async deleteUploadFilesInStorage(uploadFiles) {
        try {
            // 삭제 파일 가공 : S3 저장 Key 만 추출
            let deleteFiles = uploadFiles.map((uploadFile) => {
                return { Key: uploadFile.split('amazonaws.com/')[1] };
            });
            console.log(' 삭제할 파일 ', deleteFiles);

            // 파라미터 생성
            var params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Delete: {
                    Objects: deleteFiles,
                    Quiet: false,
                },
            };

            // 삭제 요청
            let result = await new Promise((resolve, reject) => {
                this.s3.deleteObjects(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        // reject(new StorageServiceError(err.message, err.data));
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
            console.log('삭제 처리완료 ', result);
            return result;
        } catch (error) {
            console.error('S3 에러', error);
            throw new StorageServiceError(error.message, error.data);
        }
    }
};
//bucket does not exist 404

// successful response : 성공 응답 형태
//    data = {
//     Deleted: [
//        {
//       DeleteMarker: true,
//       DeleteMarkerVersionId: "A._w1z6EFiCF5uhtQMDal9JDkID9tQ7F",
//       Key: "objectkey1"
//      },
//        {
//       DeleteMarker: true,
//       DeleteMarkerVersionId: "iOd_ORxhkKe_e8G8_oSGxt2PjsCZKlkt",
//       Key: "objectkey2"
//      }
//     ]
//    }

// const AWS = require('../awsConfig');

// const multer = require('multer');
// const multerS3 = require('multer-s3');

// module.exports = class {
//     constructor() {
//         this.s3 = new AWS.S3();
//     }
//     // 개인 프로필 임시저장 업로드 데이터 저장
//     uploadConsultantProfileTemp(req, res, next) {
//         let storage = multerS3({
//             s3: this.s3,
//             bucket: 'securist-user',
//             acl: 'public-read-write',
//             key: function (req, file, cb) {
//                 // console.log('444444444444444444444444444444', file);
//                 cb(
//                     null,
//                     `consultant/profile/temp/${file.fieldname}/${Date.now()}_${
//                         file.originalname
//                     }`
//                 );
//             },
//         });
//         console.log('s3 리퀘스트', req);
//         let upload = multer({ storage: storage });
//         return upload;
//     }
//     // 클라이언트 프로필 인증 정보 업로드 데이터 저장
//     uploadClientProfile(req, res, next) {
//         let storage = multerS3({
//             s3: this.s3,
//             bucket: 'securist-user',
//             acl: 'public-read-write',
//             key: function (req, file, cb) {
//                 console.log('44444444444444444444444444444477', file);
//                 cb(
//                     null,
//                     `client-company/${file.fieldname}/${Date.now()}_${
//                         file.originalname
//                     }`
//                 );
//             },
//         });
//         console.log('s3 리퀘스트', req);
//         let upload = multer({ storage: storage });
//         return upload;
//     }
//     // 개인 컨설턴트 프로필 정보 업로드 데이터 저장
//     uploadConsultantProfile(req, res, next) {
//         let storage = multerS3({
//             s3: this.s3,
//             bucket: 'securist-user',
//             acl: 'public-read-write',
//             key: function (req, file, cb) {
//                 // console.log('444444444444444444444444444444', file);
//                 cb(
//                     null,
//                     `consultant/profile/certification/${
//                         file.fieldname
//                     }/${Date.now()}_${file.originalname}`
//                 );
//             },
//         });
//         console.log('s3 리퀘스트', req);
//         let upload = multer({ storage: storage });
//         return upload;
//     }
//     // 기업 프로필 임시저장 업로드 데이터 저장
//     uploadConsultingCompanyBusinessLicenseTemp(req, res, next) {
//         console.log('s3 리퀘스트1111111', req);
//         let storage = multerS3({
//             s3: this.s3,
//             bucket: 'securist-user',
//             acl: 'public-read-write',
//             key: function (req, file, cb) {
//                 console.log('5555555555555555555555', file);
//                 cb(
//                     null,
//                     `consulting-company/temp/business-license/${Date.now()}_${
//                         file.originalname
//                     }`
//                 );
//             },
//         });
//         let upload = multer({ storage: storage });
//         return upload;
//     }
//     // 기업 프로필 정보 업로드 데이터 저장
//     uploadConsultingCompanyBusinessLicense(req, res, next) {
//         console.log('s3 리퀘스트1111111', req);
//         let storage = multerS3({
//             s3: this.s3,
//             bucket: 'securist-user',
//             acl: 'public-read-write',
//             key: function (req, file, cb) {
//                 console.log('5555555555555555555555', file);
//                 cb(
//                     null,
//                     `consulting-company/business-license/${Date.now()}_${
//                         file.originalname
//                     }`
//                 );
//             },
//         });
//         let upload = multer({ storage: storage });
//         return upload;
//     }
// };
