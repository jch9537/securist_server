// html 태그 제거 모듈 : XSS 공격방어 미들웨어 => 허용 태그, 속성들은 sanitizeHtml의 옵션에서 처리가능
const sanitizeHtml = require('sanitize-html');

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
    console.log('리퀘스트 헤더 :', req.headers);
    try {
        if (
            req.method === 'POST' ||
            req.method === 'PUT' ||
            req.method === 'PATCH' ||
            req.method === 'DELETE'
        ) {
            //console.log('body : ', req.body);
            if (req.body.formData) {
                req.body = JSON.parse(req.body.formData);
                //console.log('~~~~~', req.body);
            }
            req.filteredBody = sanitizeBody(req.body);
            console.log('바디데이터 : ', req.filteredBody);
        } else if (req.method === 'GET') {
            // route에서 :id를 받기 전 request를 받으므로 req.params는 없음
            if (req.query) {
                if (Object.keys(req.query).length !== 0) {
                    req.filteredQuery = sanitizeBody(req.query);
                    console.log('query 소독 : ', req.filteredQuery);
                }
            }
        }
        if (req.headers.authorization) {
            console.log('autorization headers :', req.headers);
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
        next(error);
    }
};
