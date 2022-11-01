'use strict';

module.exports = class TempAcademicBackgroundEntity {
    constructor({
        tempAcademicBackgroundId,
        finalAcademicType,
        schoolName,
        majorName,
        admissionDate,
        graduateDate,
        tempProfileId,
    }) {
        this.tempAcademicBackgroundId = tempAcademicBackgroundId;
        this.finalAcademicType = finalAcademicType;
        this.schoolName = schoolName;
        this.majorName = majorName;
        this.admissionDate = admissionDate;
        this.graduateDate = graduateDate;
        this.tempProfileId = tempProfileId;
    }
};
