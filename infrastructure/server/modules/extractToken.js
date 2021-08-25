// Bearer 제거, 순수 토큰 추출 미들웨어
const { TokenError } = require('../../response');

module.exports = (req, res, next) => {
    // console.log('-------------------headers', req.filteredToken);
    try {
        if (!req.filteredToken) {
            // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
            if (
                !Object.keys(req.query).length &&
                !Object.keys(req.params).length
            ) {
                throw new TokenError('토큰이 없습니다.');
            }
        } else {
            let authString = req.filteredToken;
            const token = authString.split(' ')[1];
            req.token = token;
            console.log('-------------------headers', req.token);
        }
        next();
    } catch (error) {
        next(error);
    }
};
