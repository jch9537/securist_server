const { UserEntity } = require('../../entities');
const {
    GetClientCompanyInfoResponseDto,
    GetConsultingCompanyInfoResponseDto,
} = require('../../../adapters/dtos/responseDto');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        let result, response;
        let companyInfoResponse;
        try {
            let userEntity = new UserEntity(userData);

            let { userType } = userEntity;
            if (!(userType === 1 || userType === 2 || userType === 3)) {
                throw new UserTypeException('사용자 타입');
            }
            response = await this.userRepository.getUserBelongingCompanyInfo(
                userEntity
            );

            if (userType === 3) {
                companyInfoResponse = new GetClientCompanyInfoResponseDto(
                    response
                );
            } else {
                // userType === 1 || userType === 2
                companyInfoResponse = new GetConsultingCompanyInfoResponseDto(
                    response
                );
            }
            let { companyData } = companyInfoResponse;

            result = {
                message: '사용자 소속 기업 정보 가져오기 완료',
                data: companyData,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '사용자 소속 기업 정보 가져오기 실패';
            throw error;
        }
    }
};
