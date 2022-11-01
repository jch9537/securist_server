// Bearer 제거, 순수 토큰 추출 미들웨어
const { TokenError } = require('../../../adapters/error');

module.exports = (req, res, next) => {
    try {
        // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
        if (!req.filteredToken) {
            if (
                !Object.keys(req.query).length &&
                !Object.keys(req.params).length
            ) {
                throw new TokenError('No token');
            }
        } else {
            const authString = req.filteredToken;
            const token = authString.split(' ')[1];
            req.token = token;
        }
        next();
    } catch (error) {
        next(error);
    }
};
