'use strict';

module.exports = class ClientUsersEntity {
    constructor({ email, userType, name, phoneNum, profileStatus }) {
        this.clientUserId = email;
        this.userType = userType;
        this.name = name;
        this.phoneNum = phoneNum;
        this.profileStatus = profileStatus;
    }
};
