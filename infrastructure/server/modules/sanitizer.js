//TODO : UPDATE, PATCH, DELETE 관련 태그제거 추가

// html 태그 제거 모듈 : XSS 공격방어 미들웨어 => 허용 태그, 속성들은 sanitizeHtml의 옵션에서 처리가능
const sanitizeHtml = require('sanitize-html');

module.exports = (req, res, next) => {
    // console.log('리퀘스트 :', req);
    let filteredData = {};
    if (req.method === 'POST') {
        console.log('body : ', req.body);
        for (let key in req.body) {
            console.log('key: ', key, 'value :', req.body[key]);
            filteredData[key] = sanitizeHtml(req.body[key]);
        }
        console.log('body소독 : ', filteredData);
        req.filteredData = filteredData;
    } else if (req.method === 'GET') {
        // console.log('-------------------------------------', req);
        console.log('req.params : ', req.params, 'req.query : ', req.query);
        for (let key in req.query) {
            console.log('key: ', key, 'value :', req.query[key]);
            filteredData[key] = sanitizeHtml(req.query[key]);
        }
        console.log('query 소독 : ', filteredData);
        req.filteredData = filteredData;
    }
    if (req.headers.authorization) {
        let token = req.headers.authorization;
        let filteredToken = sanitizeHtml(token);
        console.log('autorization headers 소독 :', req.headers.authorization);
        req.filteredToken = filteredToken;
    }
    next();
};