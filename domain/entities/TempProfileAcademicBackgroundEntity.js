'use strict';

module.exports = class TempProfileAcademicBackgroundEntity {
    constructor({
        tempAcademicBackgroundId,
        finalAcademicType,
        schoolName,
        majorName,
        graduationClassificationType,
        admissionDate,
        graduateDate,
        consultantProfileTempId,
    }) {
        this.tempAcademicBackgroundId = tempAcademicBackgroundId;
        this.finalAcademicType = finalAcademicType;
        this.schoolName = schoolName;
        this.majorName = majorName;
        this.graduationClassificationType = graduationClassificationType;
        this.admissionDate = admissionDate;
        this.graduateDate = graduateDate;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
