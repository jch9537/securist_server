'use strict';

const ParameterExetption = require('./entityException/ParameterExeption');

module.exports = class {
    constructor(email) {
        this.email = email;
    }
    // email
    get email() {
        return this._email;
    }
    set email(email) {
        let regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!

        if (!(email !== '' && email !== undefined && regEmail.test(email))) {
            throw new ParameterExetption('email');
        } else {
            this._email = email;
        }
    }
};
