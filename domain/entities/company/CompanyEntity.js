'use strict';

const { ParameterException } = require('../../exceptions');

module.exports = class {
    constructor({ businessLicenseNum, companyName, presidentName }) {
        this.businessLicenseNum = businessLicenseNum;
        this.companyName = companyName;
        this.presidentName = presidentName;
    }
    // businessLicenseNum
    get businessLicenseNum() {
        return this._businessLicenseNum;
    }
    set businessLicenseNum(businessLicenseNum) {
        let regBusinessNum = /^([0-9]{3})([0-9]{2})([0-9]{5}$)/;
        if (!regBusinessNum.test(businessLicenseNum)) {
            throw new ParameterException('사업자등록번호');
        } else {
            this._businessLicenseNum = businessLicenseNum;
        }
    }
    // companyName
    get companyName() {
        return this._companyName;
    }
    set companyName(companyName) {
        let regCompanyName = /^[a-zA-Z가-힣]{2,50}$/; // 이름 유효성 체크 : 한글, 영문 50자 이내

        if (!regCompanyName.test(companyName)) {
            throw new ParameterException('기업명');
        } else {
            this._companyName = companyName;
        }
    }
    // presidentName
    get presidentName() {
        return this._presidentName;
    }
    set presidentName(presidentName) {
        let regPresidentName = /^[a-zA-Z가-힣]{2,50}$/; // 이름 유효성 체크 : 한글, 영문 50자 이내

        if (!regPresidentName.test(presidentName)) {
            throw new ParameterException('대표명');
        } else {
            this._presidentName = presidentName;
        }
    }
};
