// Bearer 제거, 순수 토큰 추출 미들웨어
const { Exception } = require('../../../adapters/exceptions');

module.exports = (req, res, next) => {
    // console.log('-------------------headers', req.filteredToken);
    try {
        if (!req.filteredToken) {
            throw new Exception('토큰이 없습니다.');
        }
        let authString = req.filteredToken;
        const token = authString.split(' ')[1];
        req.token = token;
        // console.log('-------------------headers', req.token);
        next();
    } catch (error) {
        next(new Exception('토큰 추출 오류'));
    }
};
