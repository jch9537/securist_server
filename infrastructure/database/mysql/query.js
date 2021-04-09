const pool = require('./index');

module.exports = class {
    constructor() {}
    createClientUser({ email, name, userType, phoneNum }) {
        console.log('Repository: createclienttantUser!!');
        let sql =
            'INSERT INTO client_users (client_user_id, name, user_type, phone_num) VALUES (?, ?, ?, ?)';
        let arg = [email, name, userType, phoneNum];
        pool.query(sql, arg, function (error, results, fields) {
            if (error) throw error;
            console.log('--------------tbl_client_users  is: ', results);
        });
    }
    createConsultantUser({ email, name, userType, phoneNum }) {
        console.log('Repository: createConsultantUser!!');
        let sql =
            'INSERT INTO consultant_users (consultant_user_id, name, user_type, phone_num) VALUES (?, ?, ?, ?)';
        let arg = [email, name, userType, phoneNum];
        pool.query(sql, arg, function (error, results, fields) {
            if (error) throw error;
            console.log('--------------tbl_consultant_users is: ', results);
        });
    }
    createClientCompany({ businessLicenseNum, companyName, presidentName }) {
        console.log('Repository: createClientCompany!!');
        let sql =
            'INSERT INTO client_companies (business_license_num, company_name, president_name) VALUES (?, ?, ?)';
        let arg = [businessLicenseNum, companyName, presidentName];
        pool.query(sql, arg, function (error, results, fields) {
            if (error) throw error;
            console.log('--------------tbl_client_companies  is: ', results);
        });
    }
    createConsultingCompany({
        businessLicenseNum,
        companyName,
        presidentName,
    }) {
        console.log('Repository: createConsultingCompany!!');
        let sql =
            'INSERT INTO consulting_companies (business_license_num, company_name, president_name) VALUES (?, ?, ?)';
        let arg = [businessLicenseNum, companyName, presidentName];
        pool.query(sql, arg, function (error, results, fields) {
            if (error) throw error;
            console.log(
                '--------------tbl_consulting_companies  is: ',
                results
            );
        });
    }
};
