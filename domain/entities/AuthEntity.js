'use strict';

module.exports = class AuthEntity {
    constructor({ email, password, name, userType, code }) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.userType = userType;
        this.code = code;
    }
};
