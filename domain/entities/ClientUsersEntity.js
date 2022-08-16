'use strict';

module.exports = class ClientUsersEntity {
    constructor({ clientUserId, userType, name, phoneNum, profileStatus }) {
        this.clientUserId = clientUserId;
        this.userType = userType;
        this.name = name;
        this.phoneNum = phoneNum;
        this.profileStatus = profileStatus;
    }
};
