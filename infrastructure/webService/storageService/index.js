const awsS3 = require('./awsS3');
const s3 = new awsS3();

module.exports = {
    uploadConsultantProfileTemp: s3.uploadConsultantProfileTemp(),
    uploadConsultingCompanyBusinessLicenseTemp: s3.uploadConsultingCompanyBusinessLicenseTemp(),
};
