const Joi = require('joi');
const { TypeException } = require('../../../domain/exceptions');

const idSchema = Joi.number().positive().required();
const approvalStateSchema = Joi.number().min(0).max(2).required();
const businessLicenseNumSchema = Joi.string().alphanum().max(10);
const companyNameSchema = Joi.string().required();
const presidentName = Joi.string();
const dateSchema = Joi.date();
const stringSchema = Joi.string();

module.exports = class GetCompanyDto {
    constructor({
        client_company_id,
        business_license_num,
        company_name,
        president_name,
        approval_state,
        create_date,
        delete_date,
        business_license_file,
        business_license_file_path,
        signature_file,
        signature_file_path,
    }) {
        this.clientCompanyId = client_company_id;
        this.approvalState = approval_state;
    }
    get clientCompanyId() {
        return this._clientCompanyId;
    }
    set clientCompanyId(client_company_id) {
        console.log('아이디', client_company_id);
        let { error, value } = idSchema.validate(client_company_id);
        if (error) {
            throw new TypeException('사용자 서비스 응답 : 기업 아이디');
        } else {
            this._clientCompanyId = value;
        }
    }

    get approvalState() {
        return this._approvalState;
    }
    set approvalState(approval_state) {
        console.log('승인상태', approval_state);
        const { error, value } = approvalStateSchema.validate(approval_state);
        if (error) {
            throw new TypeException('사용자 서비스 응답 : 기업 인증 상태');
        } else {
            this._approvalState = value;
        }
    }

    // 다른 파라미터도 추가할 것
};
