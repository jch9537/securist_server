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
        consultantUserId,
    }) {
        this.academicBackgroundId = academicBackgroundId;
        this.finalAcademicType = finalAcademicType;
        this.schoolName = schoolName;
        this.majorName = majorName;
        this.graduationClassificationType = graduationClassificationType;
        this.admissionDate = admissionDate;
        this.graduateDate = graduateDate;
        this.consultantUserId = consultantUserId;
    }
};
