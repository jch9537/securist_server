const pool = require('./index');

module.exports = class {
    constructor() {}
    // 사용자 정보 생성 - 공통
    createUser({ email, name, userType, phoneNum }) {
        console.log('DB > Query : createclienttantUser!!');

        let tableName, idColumn;
        if (userType === '3') {
            tableName = 'client_users';
            idColumn = 'client_user_id';
        } else {
            tableName = 'consultant_users';
            idColumn = 'consultant_user_id';
        }
        let sql = `INSERT INTO ${tableName} (${idColumn}, name, user_type, phone_num) VALUES (?, ?, ?, ?)`;
        let arg = [email, name, userType, phoneNum];
        pool.query(sql, arg, function (error, results, fields) {
            if (error) throw error;
            console.log(`--------------tbl_${tableName}  is: `, results);
        });
    }
    // 기업 정보 생성 - 기업 공통
    createCompany({
        userType,
        businessLicenseNum,
        companyName,
        presidentName,
    }) {
        console.log('DB > Query : createClientCompany!!');
        let result = {};
        let sql, arg;
        let tableName, idColumn;
        if (userType === '3') {
            tableName = 'client_companies';
            idColumn = 'client_company_id';
        } else {
            tableName = 'consulting_companies';
            idColumn = 'consulting_company_id';
        }
        sql = `INSERT INTO ${tableName} (business_license_num, company_name, president_name) VALUES (?, ?, ?)`;
        arg = [businessLicenseNum, companyName, presidentName];
        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    if (error.errno === 1062) {
                        // 이미 등록된 사업자인 경우
                        sql = `SELECT ${idColumn} FROM ${tableName} WHERE business_license_num =?`;
                        arg = [businessLicenseNum];
                        pool.query(sql, arg, function (error, results, fields) {
                            if (error) {
                                console.log(
                                    '에러 응답 > DB > Query >  createCompany : error',
                                    error
                                );
                                reject(error);
                            }
                            console.log(
                                '응답 > DB > Query >  createCompany  : results',
                                results[0]
                            );
                            result.companyId = results[0][idColumn];
                            result.isManager = '0'; // 처음가입이 아니므로 관리자 아님
                            resolve(result);
                        });
                    } else {
                        reject(error);
                    }
                }
                sql = `SELECT ${idColumn} FROM ${tableName} WHERE business_license_num =?`;
                arg = [businessLicenseNum];
                pool.query(sql, arg, function (error, results, fields) {
                    if (error) {
                        console.log(
                            '에러 응답 > DB > Query >  createCompany : error',
                            error
                        );
                        reject(error);
                    }
                    console.log(
                        '응답 > DB > Query >  createCompany  : results',
                        results[0]
                    );
                    result.companyId = results[0][idColumn];
                    result.isManager = '1'; // 처음가입이므로 관리자 처리
                    resolve(result);
                });
            });
        });
    }
    // 기업-사업자 연결 생성
    createCompanyAndUserRelation({ userType, companyId, userId, isManager }) {
        let tableName, companyIdColumn, userIdColumn;
        if (userType === '3') {
            tableName = 'client_user_and_company';
            companyIdColumn = 'clientCompany_id';
            userIdColumn = 'client_user_id';
        } else {
            tableName = 'consultant_user_and_company';
            companyIdColumn = 'consulting_company_id';
            userIdColumn = 'consultant_user_id';
        }
        let sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, is_manager) VALUES (?, ?, ?)`;
        let arg = [companyId, userId, isManager];
        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    console.log(
                        '에러 응답 > DB > Query >  createCompanyAndUserRelation  : error',
                        error
                    );
                    reject(error);
                }
                console.log(
                    '응답 > DB > Query >  createCompanyAndUserRelation  : results',
                    results[0]
                );
                resolve(results[0]);
            });
        });
    }
    // 사용자 가져오기 : 클라이언트 / 컨설턴트 개별적으로 가져오기
    getClientUserInfo(email) {
        console.log('DB > Query : getClientUserInfo!!');
        let sql = 'SELECT * FROM client_users WHERE client_user_id=?';
        let arg = [email];
        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    console.log(
                        '에러 응답 > DB > Query >  getClientUserInfo  : error',
                        error
                    );
                    reject(error);
                }
                console.log(
                    '응답 > DB > Query >  getClientUserInfo  : results',
                    results[0]
                );
                resolve(results[0]);
            });
        });
    }
    getConsultantUserInfo(email) {
        console.log('DB > Query : getConsultantUserInfo!!');
        let sql = 'SELECT * FROM consultant_users WHERE consultant_user_id=?';
        let arg = [email];
        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    console.log(
                        '에러 응답 > DB > Query >  getConsultantUserInfo  : error',
                        error
                    );
                    reject(error);
                }
                console.log(
                    '응답 > DB > Query > :  getConsultantUserInfo  : result',
                    results[0]
                );
                resolve(results[0]);
            });
        });
    }
    // 사용자 정보 변경 - 공통 : 연락처
    updatePhoneNum({ email, userType, phoneNum }) {
        let tableName, idColumn;

        if (userType === '3') {
            tableName = 'client_users';
            idColumn = 'client_user_id';
        } else if (userType === '2') {
            tableName = 'consultant_users';
            idColumn = 'consultant_user_id';
        } else {
            throw err; // 사용자 타입오류
        }
        console.log(
            'DB > Query : updateClientUserInfo!! : tablename, idColumn'
        );

        let sql = `UPDATE ${tableName} SET phone_num = ? WHERE ${idColumn} = ?`;
        let arg = [phoneNum, email];

        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    console.log(
                        '에러 응답 > DB > Query >  updateClientUserInfo  : error',
                        error
                    );
                    reject(error);
                }
                console.log(
                    '응답 > DB > Query >  updateClientUserInfo  : results',
                    results
                );
                resolve(results);
            });
        });
    }
    // 사용자 정보 변경 - 개인컨설턴트, 컨설팅 기업 구분해서 처리하기 : 처리 id와 이메일이 달라 문제점 발생됨
    updateBankInfo({
        id,
        userType,
        bankName,
        bankAccountNum,
        bankAccountOwner,
    }) {
        let tableName, idColumn;

        if (userType === '1') {
            tableName = 'consultant_users';
            idColumn = 'consultant_user_id';
        } else if (userType === '2') {
            tableName = 'consulting_companies';
            idColumn = 'consulting_company_id';
        } else {
            throw err; // 사용자 타입오류
        }

        console.log('DB > Query : updateBankInfo!! : tablename, idColumn');

        let sql = `UPDATE ${tableName} SET bank_name = ?, bank_account_num =?, bank_account_owner = ? WHERE ${idColumn} = ?`;
        let arg = [bankName, bankAccountNum, bankAccountOwner, email];
        // consulting_company의 경우 id 가 이메일이 아닌 문제점 발생

        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    console.log(
                        '에러 응답 > DB > Query >  updateBankInfo  : error',
                        error
                    );
                    reject(error);
                }
                console.log(
                    '응답 > DB > Query >  updateBankInfo  : results',
                    results
                );
                resolve(results);
            });
        });
    }
};
