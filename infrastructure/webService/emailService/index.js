const SES = require('./awsSes');
// 클라우드 email서비스(aws, googlecloud, azure)의 공통적인 내용이 담긴 클래스
module.exports = class {
    constructor() {}
    sendCode() {}
    sendLink() {}
};
