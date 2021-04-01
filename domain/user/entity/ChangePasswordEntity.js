// TODO entity 상속처리 > validation파일 합치기
'use strict';
// const UserEntity = require('../entity/UserEntity');
const ParameterExetption = require('./entityException/ParameterExeption');

module.exports = class {
    constructor(password) {
        this.password = password;
    }
    // password
    get password() {
        return this._password;
    }
    set password(password) {
        let regPwd = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

        if (!regPwd.test(password)) {
            throw new ParameterExetption('password');
        } else {
            this._password = password;
        }
    }
};
