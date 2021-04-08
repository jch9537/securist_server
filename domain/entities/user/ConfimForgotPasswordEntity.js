'use strict';

const UserEntity = require('./UserEntity');
const { ParameterException } = require('../../exceptions');

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
            throw new ParameterException('password');
        } else {
            this._password = password;
        }
    }
    get code() {
        return this._code;
    }
    set code(code) {
        let regCode = /^(?=[0-9]{6}$)/;
        //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식  : 유효성 코드 필요한지 확인?!

        if (!regCode.test(code)) {
            throw new ParameterException('code');
        } else {
            this._code = code;
        }
    }
};
