const pool = require('./index');
const { authService } = require('../../../adapters/outbound/auth'); // 같은 layer - 의존성에 문제 없는지 확인

module.exports = class {
    constructor() {}
    async signUp({
        email,
        password,
        name,
        userType,
        phoneNum,
        businessLicenseNum,
        companyName,
        presidentName,
    }) {
        let result, sql, arg;
        let tableName,
            idColumn,
            companyIdColumn,
            userIdColumn,
            companyId,
            isManager;

        pool.getConnection(async (error, connection) => {
            try {
                if (error) {
                    throw error;
                }
                let signUpEntity = {
                    email: email,
                    password: password,
                    name: name,
                    userType: userType,
                };

                connection.beginTransaction(function (err) {
                    if (err) throw err;
                });

                //사용자 생성
                console.log('DB > Query : createConsultantUser!!');
                if (userType === '3') {
                    tableName = 'client_users';
                    idColumn = 'client_user_id';
                } else {
                    tableName = 'consultant_users';
                    idColumn = 'consultant_user_id';
                }
                sql = `INSERT INTO ${tableName} (${idColumn}, name, user_type, phone_num) VALUES (?, ?, ?, ?)`;
                arg = [email, name, userType, phoneNum];
                await connection.query(
                    sql,
                    arg,
                    function (error, results, fields) {
                        if (error) throw error;
                    }
                );

                //기업 생성
                if (userType === '2' || userType === '3') {
                    console.log('DB > Query : createClientCompany!!');

                    if (userType === '3') {
                        tableName = 'client_companies';
                        idColumn = 'client_company_id';
                    } else {
                        tableName = 'consulting_companies';
                        idColumn = 'consulting_company_id';
                    }
                    sql = `INSERT INTO ${tableName} (business_license_num, company_name, president_name) VALUES (?, ?, ?)`;
                    arg = [businessLicenseNum, companyName, presidentName];
                    await connection.query(
                        sql,
                        arg,
                        async function (error, results, fields) {
                            if (error) {
                                if (error.errno === 1062) {
                                    // 이미 등록된 사업자인 경우 - 기업id 가져오기
                                    sql = `SELECT ${idColumn} FROM ${tableName} WHERE business_license_num =?`;
                                    arg = [businessLicenseNum];
                                    await connection.query(
                                        sql,
                                        arg,
                                        async function (
                                            error,
                                            results,
                                            fields
                                        ) {
                                            if (error) {
                                                throw error;
                                            } else {
                                                companyId =
                                                    results[0][idColumn];
                                                isManager = '0'; // 처음가입이 아니므로 관리자 아님

                                                // 등록된 기업과 사용자 연결
                                                if (userType === '3') {
                                                    tableName =
                                                        'client_user_and_company';
                                                    companyIdColumn =
                                                        'client_company_id';
                                                    userIdColumn =
                                                        'client_user_id';
                                                } else {
                                                    tableName =
                                                        'consultant_user_and_company';
                                                    companyIdColumn =
                                                        'consulting_company_id';
                                                    userIdColumn =
                                                        'consultant_user_id';
                                                }
                                                sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, is_manager) VALUES (?, ?, ?)`;
                                                arg = [
                                                    companyId,
                                                    email,
                                                    isManager,
                                                ];

                                                await connection.query(
                                                    sql,
                                                    arg,
                                                    function (
                                                        error,
                                                        results,
                                                        fields
                                                    ) {
                                                        if (error) throw error;
                                                    }
                                                );
                                                result = await authService.signUp(
                                                    signUpEntity
                                                ); // cognito 회원가입

                                                await connection.commit(
                                                    function (err) {
                                                        if (err) throw err;
                                                    }
                                                );
                                                console.log(
                                                    'success! 이미 등록된 기업!!'
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    throw error;
                                }
                            } else {
                                // 등록되지 않은 사업자인 경우 - 기업id 가져오기
                                sql = `SELECT ${idColumn} FROM ${tableName} WHERE business_license_num =?`;
                                arg = [businessLicenseNum];
                                await connection.query(
                                    sql,
                                    arg,
                                    async function (error, results, fields) {
                                        if (error) {
                                            throw error;
                                        } else {
                                            companyId = results[0][idColumn];
                                            isManager = '1'; // 처음 등록된 기업이므로 관리자 처리
                                            // 등록된 기업과 사용자 연결
                                            if (userType === '3') {
                                                tableName =
                                                    'client_user_and_company';
                                                companyIdColumn =
                                                    'client_company_id';
                                                userIdColumn = 'client_user_id';
                                            } else {
                                                tableName =
                                                    'consultant_user_and_company';
                                                companyIdColumn =
                                                    'consulting_company_id';
                                                userIdColumn =
                                                    'consultant_user_id';
                                            }
                                            sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, is_manager) VALUES (?, ?, ?)`;
                                            arg = [companyId, email, isManager];

                                            await connection.query(
                                                sql,
                                                arg,
                                                function (
                                                    error,
                                                    results,
                                                    fields
                                                ) {
                                                    if (error) throw error;
                                                }
                                            );

                                            result = await authService.signUp(
                                                signUpEntity
                                            ); // cognito 회원가입

                                            await connection.commit(function (
                                                err
                                            ) {
                                                if (err) throw err;
                                            });
                                            console.log(
                                                'success! 최초 등록 기업!!'
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                } else {
                    result = await authService.signUp(signUpEntity); // cognito 회원가입

                    await connection.commit(function (err) {
                        if (err) throw err;
                    });
                    console.log('success! 개인 컨설턴트!!');
                }
            } catch (error) {
                console.log('fail!');
                return connection.rollback(function () {
                    throw error;
                });
            } finally {
                connection.release();
                return result;
            }
        });
    }

    // 사용자 가져오기 : 클라이언트 / 컨설턴트 개별적으로 가져오기
    getClientUserInfo(email) {
        let sql, arg;
        console.log('DB > Query : getClientUserInfo!!');
        sql = 'SELECT * FROM client_users WHERE client_user_id=?';
        arg = [email];
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
        let sql, arg;
        console.log('DB > Query : getConsultantUserInfo!!');
        sql = 'SELECT * FROM consultant_users WHERE consultant_user_id=?';
        arg = [email];
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
        let sql, arg, tableName, idColumn;

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

        sql = `UPDATE ${tableName} SET phone_num = ? WHERE ${idColumn} = ?`;
        arg = [phoneNum, email];

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
    // 사용자 정보 변경 - 개인컨설턴트 입금정보
    updateUserBankInfo({ email, bankName, bankAccountNum, bankAccountOwner }) {
        let sql, arg;
        console.log('요청 > DB > Query : updateUserBankInfo!! : Parameter', {
            email,
            bankName,
            bankAccountNum,
            bankAccountOwner,
        });

        sql = `UPDATE consultant_users SET bank_name = ?, bank_account_num = ?, bank_account_owner = ? WHERE consultant_user_id = ?`;
        arg = [bankName, bankAccountNum, bankAccountOwner, email];
        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    console.log(
                        '에러 응답 > DB > Query >  updateBankInfo  : error',
                        error
                    );
                    reject(error);
                }
                sql = `SELECT bank_name, bank_account_num, bank_account_owner FROM consultant_users WHERE consultant_user_id = ?`;
                arg = [email];

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
                        results[0]
                    );
                    resolve(results[0]);
                });
            });
        });
    }
    // 사용자 정보 변경 - 컨설팅 업체 입금정보 : // email로 연결테이블에서 기업 id 가져오기

    updateCompanyBankInfo({
        email,
        bankName,
        bankAccountNum,
        bankAccountOwner,
    }) {
        let sql, arg;

        console.log('요청 > DB > Query : updateCompanyBankInfo!! : Parameter', {
            email,
            bankName,
            bankAccountNum,
            bankAccountOwner,
        });
        sql = `SELECT consulting_company_id FROM consultant_user_and_company where consultant_user_id = ?`;
        arg = [email];
        return new Promise((resolve, reject) => {
            pool.query(sql, arg, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                let consultingCompanyId = results[0]['consulting_company_id'];

                sql = `UPDATE consulting_companies SET bank_name = ?, bank_account_num =?, bank_account_owner = ? WHERE consulting_company_id = ?`;
                arg = [
                    bankName,
                    bankAccountNum,
                    bankAccountOwner,
                    consultingCompanyId,
                ];

                pool.query(sql, arg, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    }
                    sql = `SELECT bank_name, bank_account_num, bank_account_owner FROM consulting_companies WHERE consulting_company_id = ?`;
                    arg = [consultingCompanyId];

                    pool.query(sql, arg, function (error, results, fields) {
                        if (error) {
                            reject(error);
                        }
                        resolve(results[0]);
                    });
                });
            });
        });
    }
};

// SignUp에서 모두 처리함  - 트랜잭션
// // 사용자 정보 생성 - 공통
// createUser({ email, name, userType, phoneNum }) {
//     console.log('DB > Query : createclienttantUser!!');

//     let tableName, idColumn;
//     if (userType === '3') {
//         tableName = 'client_users';
//         idColumn = 'client_user_id';
//     } else {
//         tableName = 'consultant_users';
//         idColumn = 'consultant_user_id';
//     }
//     let sql = `INSERT INTO ${tableName} (${idColumn}, name, user_type, phone_num) VALUES (?, ?, ?, ?)`;
//     let arg = [email, name, userType, phoneNum];
//     pool.query(sql, arg, function (error, results, fields) {
//         if (error) throw error;
//         console.log(`--------------tbl_${tableName}  is: `, results);
//     });
// }
// // 기업 정보 생성 - 기업 공통
// createCompany({
//     userType,
//     businessLicenseNum,
//     companyName,
//     presidentName,
// }) {
//     console.log('DB > Query : createClientCompany!!');
//     let result = {};
//     let sql, arg;
//     let tableName, idColumn;
//     if (userType === '3') {
//         tableName = 'client_companies';
//         idColumn = 'client_company_id';
//     } else {
//         tableName = 'consulting_companies';
//         idColumn = 'consulting_company_id';
//     }
//     sql = `INSERT INTO ${tableName} (business_license_num, company_name, president_name) VALUES (?, ?, ?)`;
//     arg = [businessLicenseNum, companyName, presidentName];
//     return new Promise((resolve, reject) => {
//         pool.query(sql, arg, function (error, results, fields) {
//             if (error) {
//                 if (error.errno === 1062) {
//                     // 이미 등록된 사업자인 경우
//                     sql = `SELECT ${idColumn} FROM ${tableName} WHERE business_license_num =?`;
//                     arg = [businessLicenseNum];
//                     pool.query(sql, arg, function (error, results, fields) {
//                         if (error) {
//                             console.log(
//                                 '에러 응답 > DB > Query >  createCompany : error',
//                                 error
//                             );
//                             reject(error);
//                         }
//                         console.log(
//                             '응답 > DB > Query >  createCompany  : results',
//                             results[0]
//                         );
//                         result.companyId = results[0][idColumn];
//                         result.isManager = '0'; // 처음가입이 아니므로 관리자 아님
//                         resolve(result);
//                     });
//                 } else {
//                     reject(error);
//                 }
//             }
//             sql = `SELECT ${idColumn} FROM ${tableName} WHERE business_license_num =?`;
//             arg = [businessLicenseNum];
//             pool.query(sql, arg, function (error, results, fields) {
//                 if (error) {
//                     console.log(
//                         '에러 응답 > DB > Query >  createCompany : error',
//                         error
//                     );
//                     reject(error);
//                 }
//                 console.log(
//                     '응답 > DB > Query >  createCompany  : results',
//                     results[0]
//                 );
//                 result.companyId = results[0][idColumn];
//                 result.isManager = '1'; // 처음가입이므로 관리자 처리
//                 resolve(result);
//             });
//         });
//     });
// }
// // 기업-사업자 연결 생성
// createCompanyAndUserRelation({ userType, companyId, userId, isManager }) {
//     let tableName, companyIdColumn, userIdColumn;
//     if (userType === '3') {
//         tableName = 'client_user_and_company';
//         companyIdColumn = 'clientCompany_id';
//         userIdColumn = 'client_user_id';
//     } else {
//         tableName = 'consultant_user_and_company';
//         companyIdColumn = 'consulting_company_id';
//         userIdColumn = 'consultant_user_id';
//     }
//     let sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, is_manager) VALUES (?, ?, ?)`;
//     let arg = [companyId, userId, isManager];
//     return new Promise((resolve, reject) => {
//         pool.query(sql, arg, function (error, results, fields) {
//             if (error) {
//                 console.log(
//                     '에러 응답 > DB > Query >  createCompanyAndUserRelation  : error',
//                     error
//                 );
//                 reject(error);
//             }
//             console.log(
//                 '응답 > DB > Query >  createCompanyAndUserRelation  : results',
//                 results[0]
//             );
//             resolve(results[0]);
//         });
//     });
// }
