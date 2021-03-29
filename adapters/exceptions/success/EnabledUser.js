module.exports = class {
    constructor(userExist) {
        this.status = 204;
        this.message = '사용 가능한 email입니다.';
        this.userExist = userExist;
    }
};
