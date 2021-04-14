'use strict';

const { ParameterException } = require('../../exceptions');
module.exports = class {
    constructor({ userType, businessLicenseNum, companyName, presidentName }) {
        this.userType = userType;
        this.businessLicenseNum = businessLicenseNum;
        this.companyName = companyName;
        this.presidentName = presidentName;
    }
    // userType
    get userType() {
        return this._userType;
    }
    set userType(userType) {
        let regUserType = /^[23]$/; // 사용자 타입 유효성 체크 : 기업 타입 2, 3 만 사용

        if (!regUserType.test(userType)) {
            throw new ParameterException('사용자 타입');
        } else {
            this._userType = userType;
        }
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
        let regCompanyName = /^[a-zA-Z가-힣0-9]{2,50}$/; // 이름 유효성 체크 : 한글, 영문 50자 이내

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
