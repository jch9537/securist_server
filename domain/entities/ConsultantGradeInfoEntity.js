'use strict';

module.exports = class ConsultantGradeInfoEntity {
    constructor({
        consultantGradeInfoId,
        clientAverageScore,
        totalProjectCount,
        totalBusinessAmount,
        consultantUserId,
    } = {}) {
        this.consultantGradeInfoId = consultantGradeInfoId;
        this.clientAverageScore = clientAverageScore;
        this.totalProjectCount = totalProjectCount;
        this.totalBusinessAmount = totalBusinessAmount;
        this.consultantUserId = consultantUserId;
    }
    calculateconsultantUserGrade = () => {
        let consultantUserGrade;
        if (
            this.clientAverageScore >= 4.8 &&
            this.totalProjectCount >= 5 &&
            this.totalBusinessAmount >= 100000000
        ) {
            consultantUserGrade = 'VVIP';
        } else if (
            this.clientAverageScore >= 4.5 &&
            this.totalProjectCount >= 3 &&
            this.totalBusinessAmount >= 500000000
        ) {
            consultantUserGrade = 'VIP';
        } else if (
            this.clientAverageScore >= 4.2 &&
            this.totalProjectCount >= 1 &&
            this.totalBusinessAmount >= 100000000
        ) {
            consultantUserGrade = 'Family';
        } else {
            consultantUserGrade = 'Welcome';
        }
        return consultantUserGrade;
    };
};
