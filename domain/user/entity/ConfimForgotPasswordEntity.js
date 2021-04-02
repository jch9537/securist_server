//TODO code 유효성 처리 필요한지 확인?
'use strict';

const UserEntity = require('./UserEntity');
const ParameterExetption = require('./entityException/ParameterExeption');

module.exports = class extends UserEntity {
    constructor({ email, password, code }) {
        super(email);
        this.password = password;
        this.code = code;
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
    get code() {
        return this._code;
    }
    set code(code) {
        let regCode = /^(?=[0-9]{6}$)/;
        //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

        if (!regCode.test(code)) {
            throw new ParameterExetption('code');
        } else {
            this._code = code;
        }
    }
};
