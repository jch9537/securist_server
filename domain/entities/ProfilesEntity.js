'use strict';

module.exports = class ProfilesEntity {
    constructor({
        profileId,
        introduce,
        profileGrade,
        comfirmComment,
        confirmRequestDate,
        confirmCompleteDate,
        consultantUserId,
    }) {
        this.profileId = profileId;
        this.introduce = introduce;
        this.profileGrade = profileGrade;
        this.comfirmComment = comfirmComment;
        this.confirmRequestDate = confirmRequestDate;
        this.confirmCompleteDate = confirmCompleteDate;
        this.consultantUserId = consultantUserId;
    }
    calculateProfileGrade = (academicScore, careerScore, licenseScore) => {
        const profileScore =
            academicScore * 0.2 + careerScore * 0.5 + licenseScore * 0.3;
        if (profileScore > 100 || profileScore < 0) {
            // 오류
        } else if (profileScore < 20) {
            this._profileGrade = 5;
        } else if (profileScore < 40) {
            this._profileGrade = 4;
        } else if (profileScore < 60) {
            this._profileGrade = 3;
        } else if (profileScore < 80) {
            this._profileGrade = 2;
        } else {
            this._profileGrade = 1;
        }
    };
};
