'use strict';

module.exports = class ProfileAcademicBackgroundEntity {
    constructor({
        academicBackgroundId,
        finalAcademicType,
        schoolName,
        majorName,
        graduationClassificationType,
        admissionDate,
        graduateDate,
        academicScore,
        profileId,
    }) {
        this.academicBackgroundId = academicBackgroundId;
        this.finalAcademicType = finalAcademicType;
        this.schoolName = schoolName;
        this.majorName = majorName;
        this.graduationClassificationType = graduationClassificationType;
        this.admissionDate = admissionDate;
        this.graduateDate = graduateDate;
        this.academicScore = academicScore;
        this.profileId = profileId;
    }
};
