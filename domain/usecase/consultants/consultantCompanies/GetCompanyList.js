module.exports = class {
    constructor({ companyRepository }) {
        this.companyRepository = companyRepository;
    }
    async excute(userData) {
        let result, response;
        try {
            response = await this.companyRepository.getCompanyList(userData);
            console.log(' 기업 리스트 결과----------------', response);

            result = {
                message: '등록된 기업 정보 리스트 가져오기 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '등록된 기업 정보 리스트 가져오기 실패';
            throw error;
        }
    }
};
