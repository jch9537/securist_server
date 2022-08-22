const awsS3 = require('./awsS3');
module.exports = new awsS3();

// module.exports = {
//     uploadClientProfile: s3.uploadClientProfile(),
//     uploadConsultantProfile: s3.uploadConsultantProfile(),
//     uploadConsultantProfileTemp: s3.uploadConsultantProfileTemp(),
//     uploadConsultingCompanyBusinessLicense: s3.uploadConsultingCompanyBusinessLicense(),
//     uploadConsultingCompanyBusinessLicenseTemp: s3.uploadConsultingCompanyBusinessLicenseTemp(),
// };
