'use strict';

module.exports = class VoucherEntity {
    constructor({
        voucherId,
        voucherAmount,
        projectCode,
        description,
        createAt,
        expirationDate,
        clientUserId,
    }) {
        this.voucherId = voucherId;
        this.voucherAmount = voucherAmount;
        this.projectCode = projectCode;
        this.description = description;
        this.createAt = createAt;
        this.expirationDate = expirationDate;
        this.clientUserId = clientUserId;
    }
};
