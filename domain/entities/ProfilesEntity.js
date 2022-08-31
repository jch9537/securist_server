'use strict';

module.exports = class ProfilesEntity {
    constructor({
        profileId,
        introduce,
        academicScore,
        careerScore,
        licenseScore,
        // profileGrade,
        confirmComment,
        confirmRequestDate,
        confirmCompleteDate,
        consultantUserId,
    }) {
        this.profileId = profileId;
        this.introduce = introduce;
        this.academicScore = academicScore;
        this.careerScore = careerScore;
        this.licenseScore = licenseScore;
        this.profileGrade = this.calculateProfileGrade();
        this.confirmComment = confirmComment;
        this.confirmRequestDate = confirmRequestDate;
        this.confirmCompleteDate = confirmCompleteDate;
        this.consultantUserId = consultantUserId;
    }
    calculateProfileGrade = () => {
        console.log(
            'this값',
            this.academicScore,
            this.careerScore,
            this.licenseScore
        );
        if (
            this.academicScore !== undefined &&
            this.careerScore !== undefined &&
            this.licenseScore !== undefined
        ) {
            const profileScore =
                this.academicScore * 0.2 +
                this.careerScore * 0.5 +
                this.licenseScore * 0.3;
            console.log('프로필 점수 : ', profileScore);
            if (profileScore > 100 || profileScore < 0) {
                // 오류 처리
            } else if (profileScore < 20) {
                return 5;
            } else if (profileScore < 40) {
                return 4;
            } else if (profileScore < 60) {
                return 3;
            } else if (profileScore < 80) {
                return 2;
            } else {
                return 1;
            }
        }
        return undefined;
    };
};
