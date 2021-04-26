const { UpdateJoinStatusEntity } = require('../../entities/user');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, joinData) {
        console.log(userData);
        let result;
        try {
            let updateJoinStatusEntity = new UpdateJoinStatusEntity(joinData);
            updateJoinStatusEntity.email = userData.email;
            updateJoinStatusEntity.userType = userData.userType;

            result = await this.Repository.updateJoinStatus(
                updateJoinStatusEntity
            );
            console.log('결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
