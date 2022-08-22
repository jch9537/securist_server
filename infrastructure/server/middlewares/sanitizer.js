//TODO : sanitizeBody converter 함수로 이동 & 현재 함수는 requestChecker로 명칭 변경 후 sanitizeHtml 적용처리!!!
// html 태그 제거 모듈 : XSS 공격방어 미들웨어 => 허용 태그, 속성들은 sanitizeHtml의 옵션에서 처리가능

const sanitizeHtml = require('sanitize-html');
// const { logger } = require('../../../adapters/module');
// const { MiddlewareError } = require('../../response');

// 객체와 배열을 스캔하면서 XSS공격 문자 소독하는 함수
function sanitizeBody(body) {
    let result;
    if (typeof body !== 'object') {
        // console.log(body)
        if (typeof body === 'number') {
            return Number(sanitizeHtml(body));
        } else {
            // 문자열
            return sanitizeHtml(body);
        }
    } else {
        // console.log(body)
        if (Array.isArray(body)) {
            let innerArray = [];
            for (let i = 0; i < body.length; i++) {
                innerArray.push(sanitizeBody(body[i]));
            }
            result = innerArray;
        } else {
            let innerObj = {};
            for (let key in body) {
                innerObj[key] = sanitizeBody(body[key]);
            }
            result = innerObj;
        }
    }
    return result;
}

module.exports = (req, res, next) => {
    console.log('리퀘스트 :', req.files, req.body);
    try {
        if (req.method === 'OPTIONS' || req.method === 'HEAD') {
            console.log('메서드 : ', req.method);
        } else if (
            req.method === 'POST' ||
            req.method === 'PUT' ||
            req.method === 'PATCH'
        ) {
            //console.log('body : ', req.body);
            if (req.body.formData) {
                req.body = JSON.parse(req.body.formData);
                //console.log('~~~~~', req.body);
            }
            req.filteredBody = sanitizeBody(req.body);
            // else {
            //     req.filteredBody = sanitizeBody(req.body);
            // }
            // console.log('바디데이터 : ', req.filteredBody);
        } else if (req.method === 'GET' || req.method === 'DELETE') {
            // route에서 :id를 받기 전 request를 받으므로 req.params는 없음
            if (req.query) {
                if (Object.keys(req.query).length > 0) {
                    req.filteredQuery = sanitizeBody(req.query);
                    console.log('query 소독 : ', req.filteredQuery);
                }
            }
        }
        // 업로드 파일 여러개
        if (req.files) {
            // field가 하나인 경우
            // console.log('========== 소독전 파일들', req.files);
            if (Array.isArray(req.files)) {
                req.arrangedFiles = req.files.map((file) => {
                    let fileInfo = {};
                    fileInfo.fileType = file.fieldname;
                    fileInfo.fileName = file.originalname;
                    fileInfo.filePath = file.location;
                    return fileInfo;
                });
            } else {
                // field가 여러개인 경우 : 필드에 상관없이 배열 하나로 합침
                // typeof req.files === 'object'
                req.arrangedFiles = [];
                for (let key in req.files) {
                    let eachFieldData = req.files[key].map((file) => {
                        let fileInfo = {};
                        fileInfo.fileType = file.fieldname;
                        fileInfo.fileName = file.originalname;
                        fileInfo.filePath = file.location;
                        return fileInfo;
                    });
                    req.arrangedFiles = req.arrangedFiles.concat(eachFieldData);
                }
            }
            // console.log('========== 소독후 파일들', req.arrangedFiles);
        }
        // 업로드 파일 하나
        if (req.file) {
            req.arrangedFile = {
                fileType: req.file.fieldname,
                fileName: req.file.originalname,
                filePath: req.file.location,
            };
        }
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            let filteredToken = sanitizeHtml(token);
            console.log(
                'autorization headers 소독 :',
                req.headers.authorization
            );
            req.filteredToken = filteredToken;
        }
        next();
    } catch (error) {
        // logger.log('error', 'middleware', error.message);
        // next(new MiddlewareError(error.message, error));
        next(error);
    }
};

// // html 태그 제거 모듈 : XSS 공격방어 미들웨어 => 허용 태그, 속성들은 sanitizeHtml의 옵션에서 처리가능
// const sanitizeHtml = require('sanitize-html');

// // 객체와 배열을 스캔하면서 XSS공격 문자 소독하는 함수
// function sanitizeBody(body) {
//     let result;
//     if (typeof body !== 'object') {
//         // console.log(body)
//         if (typeof body === 'number') {
//             return Number(sanitizeHtml(body));
//         } else {
//             // 문자열
//             return sanitizeHtml(body);
//         }
//     } else {
//         // console.log(body)
//         if (Array.isArray(body)) {
//             let innerArray = [];
//             for (let i = 0; i < body.length; i++) {
//                 innerArray.push(sanitizeBody(body[i]));
//             }
//             result = innerArray;
//         } else {
//             let innerObj = {};
//             for (let key in body) {
//                 innerObj[key] = sanitizeBody(body[key]);
//             }
//             result = innerObj;
//         }
//     }
//     return result;
// }

// module.exports = (req, res, next) => {
//     console.log('리퀘스트 헤더 :', req.headers);
//     try {
//         if (
//             req.method === 'POST' ||
//             req.method === 'PUT' ||
//             req.method === 'PATCH' ||
//             req.method === 'DELETE'
//         ) {
//             //console.log('body : ', req.body);
//             if (req.body.formData) {
//                 req.body = JSON.parse(req.body.formData);
//                 //console.log('~~~~~', req.body);
//             }
//             req.filteredBody = sanitizeBody(req.body);
//             console.log('바디데이터 : ', req.filteredBody);
//         } else if (req.method === 'GET') {
//             // route에서 :id를 받기 전 request를 받으므로 req.params는 없음
//             if (req.query) {
//                 if (Object.keys(req.query).length !== 0) {
//                     req.filteredQuery = sanitizeBody(req.query);
//                     console.log('query 소독 : ', req.filteredQuery);
//                 }
//             }
//         }
//         if (req.headers.authorization) {
//             console.log('autorization headers :', req.headers);
//             let token = req.headers.authorization;
//             let filteredToken = sanitizeHtml(token);
//             console.log(
//                 'autorization headers 소독 :',
//                 req.headers.authorization
//             );
//             req.filteredToken = filteredToken;
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// };
