// Bearer 제거, 순수 토큰 추출 미들웨어
module.exports = (req, res, next) => {
    console.log('-------------------headers', req.filteredToken);
    if (req.filteredToken) {
        let authString = req.filteredToken;
        const token = authString.split(' ')[1];
        req.token = token;
        console.log('-------------------headers', req.token);
    }
    next();
};
