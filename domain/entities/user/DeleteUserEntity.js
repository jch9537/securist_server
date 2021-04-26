'use strict';

const { ParameterException } = require('../../exceptions');

module.exports = class {
    constructor(withdrawalType) {
        this.withdrawalType = withdrawalType;
    }
    // withdrawalType
    get withdrawalType() {
        return this._withdrawalType;
    }
    set withdrawalType(withdrawalType) {
        let regWithdrawalType = /^[0123]$/; // 탈퇴사유 타입 유효성 체크 : 0, 1, 2, 3 만 사용
        if (!regWithdrawalType.test(withdrawalType)) {
            throw new ParameterException('사용자 타입');
        } else {
            this._withdrawalType = withdrawalType;
        }
    }
};
