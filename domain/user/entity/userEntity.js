// TODO - setter, getter 따로 만들기, validation
'use strict';

const {
    validateId,
    validateEmail,
    validatePassword,
    validateName,
    validatePhoneNum,
    validateUserType,
    validateUserState,
    validateLogInFailure,
} = require('./utils/validateUserInfo');

module.exports = class {
    constructor({
        id,
        email,
        password,
        phone_num,
        name,
        user_type,
        user_state,
        login_failure_cnt,
        create_at,
    }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone_num = phone_num;
        this.user_type = user_type;
        this.user_state = user_state;
        this.login_failure_cnt = login_failure_cnt;
        // this.create_at = created_at
    }

    // id
    get id() {
        return this._id;
    }
    set id(id) {
        if (validateId(id)) {
            this._id = id;
        } else {
            this._id = '에러';
            // throw exceptions;
        }
    }
    // email
    get email() {
        return this._email;
    }
    set email(email) {
        if (validateEmail(email)) {
            this._email = email;
        } else {
            this._email = '에러';
            // throw exceptions;
        }
    }
    // password
    get password() {
        return this._password;
    }
    set password(password) {
        if (validatePassword(password)) {
            this._password = password;
        } else {
            this._password = '에러';
            // throw exceptions
        }
    }

    // name
    get name() {
        return this._name;
    }
    set name(name) {
        if (validateName(name)) {
            this._name = name;
        } else {
            this._name = '에러';
            // throw exceptions
        }
    }

    get phone_num() {
        return this._phone_num;
    }
    // phone_num 유효성 검사
    set phone_num(phone_num) {
        if (validatePhoneNum(phone_num)) {
            this._phone_num = phone_num;
        } else {
            this._phone_num = '에러';
            // throw exceptions
        }
    }

    // 사용자 타입
    get user_type() {
        return this._user_type;
    }
    set user_type(user_type) {
        if (validateUserType(user_type)) {
            this._user_type = user_type;
        } else {
            this._user_type = '에러';
            // throw exceptions
        }
    }

    get user_state() {
        return this._user_state;
    }
    // 사용자 상태
    set user_state(user_state) {
        if (validateUserState(user_state)) {
            this._user_state = user_state;
        } else {
            this._user_state = '에러';
            // throw exceptions
        }
    }
    // 로그인 실패 횟수
    get login_failure_cnt() {
        return this._login_failure_cnt;
    }
    set login_failure_cnt(login_failure_cnt) {
        if (validateLogInFailure(login_failure_cnt)) {
            this._login_failure_cnt = login_failure_cnt;
        } else {
            this._login_failure_cnt = '에러';
            // throw exceptions
        }
    }
    // verifyCreateAt(userData) {}
};
