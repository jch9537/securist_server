// TODO - setter, getter 따로 만들기, validation
'use strict';

const {
    validateEmail,
    validatePassword,
    validateName,
    validateUserType,
    validateUserState,
    validateLogInFailCount,
} = require('./utils/validateUserInfo');

module.exports = class {
    constructor({
        email,
        password,
        name,
        userType,
        // userState,
        // logInFailCount,
        // create_at,
    }) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.userType = userType;
        // this.userState = userState;
        // this.logInFailCount = logInFailCount;
        // this.create_at = created_at
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
    // userType
    get userType() {
        return this._userType;
    }
    set userType(userType) {
        this._userType = userType;
    }
    // //userState
    // get userState() {
    //     return this._userState;
    // }
    // set userState(userState) {
    //     this._userState = userState;
    // }
    // // 로그인 실패 횟수
    // get logInFailCount() {
    //     return this._logInFailCount;
    // }
    // set logInFailCount(logInFailCount) {
    //     if (validateLogInFailCount(logInFailCount)) {
    //         this._logInFailCount = logInFailCount;
    //     } else {
    //         this._logInFailCount = '에러';
    //         // throw exceptions
    //     }
    // }
    // // verifyCreateAt(userData) {}
};
