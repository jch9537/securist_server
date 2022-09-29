'use strict';

module.exports = class ClientUsersEntity {
    constructor({
        clientUserId,
        userType,
        name,
        phoneNum,
        profileStatus,
        createdAt,
        withdrawalAt,
    } = {}) {
        this.clientUserId = clientUserId;
        this.userType = userType;
        this.name = name;
        this.phoneNum = phoneNum;
        this.profileStatus = profileStatus;
        this.createdAt = createdAt;
        this.withdrawalAt = withdrawalAt;
    }
};
