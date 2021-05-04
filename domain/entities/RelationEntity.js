'use strict';

// const AuthEntity = require('./AuthEntity');
const { ParameterException } = require('../exceptions');
// /*
// type의 경우 위와 같이 형식을 나눠주는 것이 코드 가독성이 좋음
// const UpdateBankInfoEntityConfig = {
//     userType: {
//         PERSONAL_CONSULTANT : '1',
//     }
// }
// */
module.exports = class RelationEntity {
    constructor({ email = null, companyId = null, belongingType = null }) {
        this.email = email;
        this.companyId = companyId;
        this.belongingType = belongingType;
    }
    // email
    get email() {
        return this._email;
    }
    set email(email) {
        if (email !== null) {
            let regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!

            if (
                !(email !== '' && email !== undefined && regEmail.test(email))
            ) {
                console.log('----------------------------', email);
                throw new ParameterException('이메일');
            } else {
                this._email = email;
            }
        } else {
            this._email = email;
        }
    }
    // companyId  : 유효성 맞는지 확인!!!!
    get companyId() {
        return this._companyId;
    }
    set companyId(companyId) {
        if (companyId !== null) {
            let regCompanyId = /^[0-9]+$/; // 회사 아이디  유효성 체크 : 숫자만 허용

            if (!regCompanyId.test(companyId)) {
                throw new ParameterException('기업 아이디');
            } else {
                this._companyId = companyId;
            }
        } else {
            this._companyId = companyId;
        }
    }
    // belongingType
    get belongingType() {
        return this._belongingType;
    }
    set belongingType(belongingType) {
        if (belongingType !== null) {
            let regbelongingType = /^[012]$/; // 소속상태 타입 유효성 체크 : 0, 1, 2 만 사용

            if (!regbelongingType.test(belongingType)) {
                throw new ParameterException('사용자 타입');
            } else {
                this._belongingType = belongingType;
            }
        } else {
            this._belongingType = belongingType;
        }
    }
};
