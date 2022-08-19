'use strict';

module.exports = class TempAcademicBackgroundEntity {
    constructor({
        tempAcademicBackgroundId,
        finalAcademicType,
        schoolName,
        majorName,
        graduationClassificationType,
        admissionDate,
        graduateDate,
        tempProfileId,
    }) {
        this.tempAcademicBackgroundId = tempAcademicBackgroundId;
        this.finalAcademicType = finalAcademicType;
        this.schoolName = schoolName;
        this.majorName = majorName;
        this.graduationClassificationType = graduationClassificationType;
        this.admissionDate = admissionDate;
        this.graduateDate = graduateDate;
        this.tempProfileId = tempProfileId;
    }
};
