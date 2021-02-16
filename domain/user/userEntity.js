module.exports = class {
    constructor(reqObj) {
        this.email = this.verifyReqInfo(reqObj).email;
        this.password = this.verifyReqInfo(reqObj).password;
    }
    verifyReqInfo({ email, password }) {
        let validObj = {};
        validObj.email = email; // email 유효성 검사
        validObj.password = password; // password 유효성 검사
        //if(위의 유효성 검사를 통과 못하면) 에러 응답
        return validObj;
    }
};
