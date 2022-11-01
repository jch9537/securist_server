'use strict';

module.exports = class ConsultantPenaltyEntity {
    constructor({ penaltyId, penaltyType, createAt, consultantUserId } = {}) {
        this.penaltyId = penaltyId;
        this.penaltyType = penaltyType;
        this.createAt = createAt;
        this.consultantUserId = consultantUserId;
    }
};
