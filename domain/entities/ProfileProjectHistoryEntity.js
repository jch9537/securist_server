'use strict';

module.exports = class ProfileProjectHistoryEntity {
    constructor({
        projectHistoryId,
        certificationId,
        certificationName,
        industryId,
        industryName,
        companyName,
        projectStartDate,
        projectEndDate,
        profileId,
    } = {}) {
        this.projectHistoryId = projectHistoryId;
        this.certificationId = certificationId;
        this.certificationName = certificationName;
        this.industryId = industryId;
        this.industryName = industryName;
        this.companyName = companyName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.profileId = profileId;
    }
};
