module.exports = class {
    constructor(userExist) {
        this.status = 409;
        this.message = '이미 가입된 email입니다.(Conflict)';
        this.userExist = userExist;
    }
};
