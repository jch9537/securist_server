'use strict';

module.exports = class ConsultantProfileTempEntity {
    constructor({
        consultantProfileTempId,
        consultantIntroduce,
        phoneNum,
        consultantUserId,
    }) {
        this.consultantProfileTempId = consultantProfileTempId;
        this.consultantIntroduce = consultantIntroduce;
        this.phoneNum = phoneNum;
        this.consultantUserId = consultantUserId;
    }
};
