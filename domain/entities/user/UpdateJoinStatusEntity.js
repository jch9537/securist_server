'use strict';

const { ParameterException } = require('../../exceptions');

module.exports = class {
    constructor({ companyId, joinType }) {
        this.companyId = companyId;
        this.joinType = joinType;
    }

    // companyId
    get companyId() {
        return this._companyId;
    }
    set companyId(companyId) {
        let regCompanyId = /^[0-9]*$/; // 숫자만 허용

        if (!regCompanyId.test(companyId)) {
            throw new ParameterException('기업 아이디');
        } else {
            this._companyId = companyId;
        }
    }

    // joinType
    get joinType() {
        return this._joinType;
    }
    set joinType(joinType) {
        let regJoinType = /^[01]$/; // 사용자 소속 상태 타입 유효성 체크 : 0, 1 만 사용

        if (!regJoinType.test(joinType)) {
            throw new ParameterException('사용자 소속 상태 타입');
        } else {
            this._joinType = joinType;
        }
    }
};
