module.exports = {
    // 자격증 발급 영역
    //---- 관리자 ------
    // GetLicenseIssuance: require('./GetLicenseIssuance'),
    // GetLicenseIssuanceList: require('./GetLicenseIssuanceList'),
    // UpdateLicenseIssuance: require('./UpdateLicenseIssuance'),
    // CancelLicenseIssuance: require('./CancelLicenseIssuance'),
    //---- 사용자 ------
    CreateLicenseIssuance: require('./CreateLicenseIssuance'),
    GetLicenseIssuanceByUser: require('./GetLicenseIssuanceByUser'),
    GetLicenseIssuanceListByReceptionId: require('./GetLicenseIssuanceListByReceptionId'),
    UpdateLicenseIssuanceByUser: require('./UpdateLicenseIssuanceByUser'),
    CancelLicenseIssuanceByUser: require('./CancelLicenseIssuanceByUser'),
};
