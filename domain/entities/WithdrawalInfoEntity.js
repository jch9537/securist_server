'use strict';

module.exports = class WithdrawalInfoEntity {
    constructor({ withdrawalId, userType, withdrawalType }) {
        this.withdrawalId = withdrawalId;
        this.userType = userType;
        this.withdrawalType = withdrawalType;
    }
};
