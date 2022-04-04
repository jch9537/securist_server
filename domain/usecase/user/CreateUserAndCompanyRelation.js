const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData, joinData) {
        let result, response;
        try {
            let companyEntity = new CompanyEntity(joinData);
            companyEntity.userType = userData.userType;
            companyEntity.email = userData.email;
            // companyEntity.email = 'mg.kim@aegisecu.com', // 테스트
            // companyEntity.email = 'mg.sun@aegisecu.com'
            // companyEntity.email = 'ej.lim@aegisecu.com'
            response = await this.userRepository.createUserAndCompanyRelation(
                companyEntity
            );
            if (response !== undefined) {
                if (response.isAlreadyBelongingUser) {
                    result = {
                        message:
                            '타 기업에 소속된 사용자는 중복 소속요청을 할 수 없습니다.',
                        data: response.isAlreadyBelongingUser,
                    };
                }
            } else {
                result = {
                    message: '사용자-기업 정보 연결 완료',
                };
            }
            return result;
        } catch (error) {
            console.error(error);
            error.message = '사용자-기업 정보 연결 실패';
            throw error;
        }
    }
};
