'use strict';

module.exports = class ConsultantUsersEntity {
    constructor({
        consultantUserId,
        userType,
        name,
        phoneNum,
        profileStatus,
        profileGrade,
        bankName,
        bankAccountNum,
        bankAccountOwner,
        // userIntroduce,
        applicationState,
    } = {}) {
        this.consultantUserId = consultantUserId;
        this.userType = userType;
        this.name = name;
        this.phoneNum = phoneNum;
        this.profileStatus = profileStatus;
        this.profileGrade = profileGrade;
        this.bankName = bankName;
        this.bankAccountNum = bankAccountNum;
        this.bankAccountOwner = bankAccountOwner;
        // this.userIntroduce = userIntroduce;
        this.applicationState = applicationState;
    }
};
