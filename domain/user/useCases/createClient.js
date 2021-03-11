const UserEntity = require('../entity/userEntity');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth; //DB로 변경
    }
    excute({ businessLicenseNum, clientName, presidentName }) {
        let clientEntity = new UserEntity({
            businessLicenseNum,
            clientName,
            presidentName,
        });
        let result = this.Auth.signUp(clientEntity); //DB로 변경
        return result;
    }
};

/*
input에 없는 created_at과 같은 정보는 어디에서 넣어 줄지 정하기
 */
