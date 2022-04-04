'use strict';

const { ParameterException } = require('../exceptions');

module.exports = class CompanyEntity {
    constructor({
        companyId = null,
        businessLicenseNum = null,
        companyName = null,
        presidentName = null,
    }) {
        this.companyId = companyId;
        this.businessLicenseNum = businessLicenseNum;
        this.companyName = companyName;
        this.presidentName = presidentName;
    }
    // companyId  : 유효성 맞는지 확인!!!!
    get companyId() {
        return this._companyId;
    }
    set companyId(companyId) {
        if (companyId !== null) {
            let regCompanyId = /^[0-9]+$/; // 기업 아이디 숫자만 허용

            if (!regCompanyId.test(companyId)) {
                throw new ParameterException('기업 아이디');
            } else {
                this._companyId = Number(companyId);
            }
        } else {
            this._companyId = Number(companyId);
        }
    }

    // businessLicenseNum
    get businessLicenseNum() {
        return this._businessLicenseNum;
    }
    set businessLicenseNum(businessLicenseNum) {
        if (businessLicenseNum !== null) {
            let regBusinessNum = /^([0-9]{3})([0-9]{2})([0-9]{5}$)/;
            if (!regBusinessNum.test(businessLicenseNum)) {
                throw new ParameterException('사업자등록번호');
            } else {
                this._businessLicenseNum = businessLicenseNum;
            }
        } else {
            this._businessLicenseNum = businessLicenseNum;
        }
    }
    // companyName
    get companyName() {
        return this._companyName;
    }
    set companyName(companyName) {
        if (companyName !== null) {
            let regCompanyName = /^[a-zA-Z가-힣0-9]{2,50}$/; // 회사명 유효성 체크 : 한글, 영문 50자 이내

            if (!regCompanyName.test(companyName)) {
                throw new ParameterException('기업명');
            } else {
                this._companyName = companyName;
            }
        } else {
            this._companyName = companyName;
        }
    }
    // presidentName
    get presidentName() {
        return this._presidentName;
    }
    set presidentName(presidentName) {
        if (presidentName !== null) {
            let regPresidentName = /^[a-zA-Z가-힣]{2,50}$/; // 대표명 유효성 체크 : 한글, 영문 50자 이내

            if (!regPresidentName.test(presidentName)) {
                throw new ParameterException('대표명');
            } else {
                this._presidentName = presidentName;
            }
        } else {
            this._presidentName = presidentName;
        }
    }
};
