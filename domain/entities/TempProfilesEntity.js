'use strict';

module.exports = class TempProfilesEntity {
    constructor({ tempProfileId, introduce, phoneNum, consultantUserId }) {
        this.tempProfileId = tempProfileId;
        this.introduce = introduce;
        this.phoneNum = phoneNum;
        this.consultantUserId = consultantUserId;
    }
};
