'use strict';

const { ParameterException } = require('../../exceptions');

module.exports = class {
    constructor({ email, status }) {
        this.email = email;
        this.status = status;
    }
    // email
    get email() {
        return this._email;
    }
    set email(email) {
        let regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!

        if (!(email !== '' && email !== undefined && regEmail.test(email))) {
            console.log('----------------------------', email);
            throw new ParameterException('이메일');
        } else {
            this._email = email;
        }
    }
    // status
    get status() {
        return this._status;
    }
    set status(status) {
        let regStatus = /^[012]$/; // 상태변경 타입 유효성 체크 : 0, 1, 2 만 사용

        if (!regStatus.test(status)) {
            throw new ParameterException('사용자 타입');
        } else {
            this._status = status;
        }
    }
};
