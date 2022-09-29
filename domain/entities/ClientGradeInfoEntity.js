'use strict';

module.exports = class ClientGradeInfoEntity {
    constructor({
        clientGradeInfoId,
        totalProjectCount,
        totalBusinessAmount,
        clientUserId,
    }) {
        this.clientGradeInfoId = clientGradeInfoId;
        this.totalProjectCount = totalProjectCount;
        this.totalBusinessAmount = totalBusinessAmount;
        this.clientUserId = clientUserId;
    }
    calculateClientUserGrade = () => {
        let clientUserGrade;
        if (
            this.totalProjectCount >= 5 &&
            this.totalBusinessAmount >= 100000000
        ) {
            clientUserGrade = 'VVIP';
        } else if (
            this.totalProjectCount >= 3 &&
            this.totalBusinessAmount >= 500000000
        ) {
            clientUserGrade = 'VIP';
        } else if (
            this.totalProjectCount >= 1 &&
            this.totalBusinessAmount >= 100000000
        ) {
            clientUserGrade = 'Family';
        } else {
            clientUserGrade = 'Welcome';
        }
        return clientUserGrade;
    };
};
