'use strict';

module.exports = class AuthEntity {
    constructor({ email, password, name, userType }) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.userType = userType;
    }
};
