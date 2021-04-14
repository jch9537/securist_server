//  기업-사용자 생성
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    excute(companyAndUserRelationData) {
        console.log(
            'CreateCompanyAndUserRelation!!',
            companyAndUserRelationData
        );

        let result;
        try {
            result = this.Repository.createCompanyAndUserRelation(
                companyAndUserRelationData
            );
            console.log(
                '응답 > createCompanyAndUserRelation result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
};
