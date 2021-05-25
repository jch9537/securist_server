//TODO : 예외처리 - new Exception(err.statusCode, err.message, err) 추가
const pool = require('./index');
// const { logger } = require('../../../adapters/middleware');
const { authService } = require('../../../adapters/outbound/auth'); // 같은 layer - 의존성에 문제 없는지 확인

module.exports = class {
    constructor() {}
    // 사용자--------------------------------------------------------------------
    // CREATE
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
        console.log('##################', {
            email,
            password,
            name,
            userType,
            phoneNum,
            businessLicenseNum,
            companyName,
            presidentName,
        });
        pool.getConnection(async (error, connection) => {
            try {
                if (error) {
                    throw error;
                }
                let userEntity = {
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
                if (userType === 3) {
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
                if (userType === 2 || userType === 3) {
                    console.log('DB > Query : createClientCompany!!');

                    if (userType === 3) {
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
                                                if (userType === 3) {
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
                                                sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, belonging_type) VALUES (?, ?, ?)`;
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
                                                    userEntity
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
                                            isManager = 1; // 처음 등록된 기업이므로 관리자 처리
                                            // 등록된 기업과 사용자 연결
                                            if (userType === 3) {
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
                                            sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, belonging_type) VALUES (?, ?, ?)`;
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
                                                userEntity
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
                    result = await authService.signUp(userEntity); // cognito 회원가입

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

    // GET
    // 사용자 가져오기 : 클라이언트 / 컨설턴트 공통
    getUserInfo({ email, userType }) {
        console.log('---------------------------------사용자정보 : ', {
            email,
            userType,
        });
        let sql, arg;
        let tableName, idColumn;

        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (userType === 3) {
                    tableName = 'client_users';
                    idColumn = 'client_user_id';
                } else {
                    tableName = 'consultant_users';
                    idColumn = 'consultant_user_id';
                }
                sql = `SELECT * FROM ${tableName} WHERE ${idColumn}=?`;
                arg = [email];

                if (error) {
                    reject(error);
                } else {
                    connection.query(
                        sql,
                        arg,
                        function (error, results, fields) {
                            if (error) {
                                console.log(
                                    '에러 응답 > DB > Query >  getUserInfo  : error',
                                    error
                                );
                                reject(error);
                            }
                            console.log(
                                '응답 > DB > Query > :  getUserInfo  : result',
                                results
                            );
                            resolve(results[0]);
                        }
                    );
                }
            });
        });
    }
    // 사용자 소속 기업정보 가져오기
    async getUserBelongingCompanyInfo({ email, userType }) {
        let result;
        let idColumn;
        // try {
        if (userType === 3) {
            idColumn = 'client_company_id';
        } else if (userType === 2) {
            idColumn = 'consulting_company_id';
        }
        let companyInfo = await this.getRelationInfo({ email, userType });
        let companyId = companyInfo[`${idColumn}`];
        console.log('사용자 소속기업정보 가져오기 result', companyId);

        result = await this.getCompanyInfo({ userType, companyId });
        return result;
        // } catch (error) {
        //     console.log('사용자 소속 기업정보 가져오기 err: ', error);
        //     throw error;
        // }
    }

    // UPDATE
    // 사용자 정보 변경 - 공통 : 연락처
    updatePhoneNum({ email, userType, phoneNum }) {
        let result;
        let sql, arg, tableName, idColumn;

        if (userType === 3) {
            tableName = 'client_users';
            idColumn = 'client_user_id';
        } else if (userType === 2) {
            tableName = 'consultant_users';
            idColumn = 'consultant_user_id';
        } else {
            throw err; // 사용자 타입오류
        }
        console.log(
            'DB > Query : updateClientUserInfo!! : tablename, idColumn'
        );

        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `UPDATE ${tableName} SET phone_num = ? WHERE ${idColumn} = ?`;
                    arg = [phoneNum, email];
                    connection.query(
                        sql,
                        arg,
                        function (error, results, fields) {
                            if (error) {
                                console.log(
                                    '에러 응답 > DB > Query >  updateClientUserInfo  : error',
                                    error
                                );
                                // logger.log(
                                //     'error',
                                //     `[DB 오류] > ${email} > /`,
                                //     `**SQL : ${error.sql} / **MESSAGE :  ${error.sqlMessage}`
                                // );
                                reject(error);
                            } else {
                                console.log(
                                    '응답 > DB > Query >  updateClientUserInfo  : results1',
                                    results
                                );
                                sql = `SELECT phone_num FROM ${tableName} WHERE ${idColumn} = ?`;
                                arg = [email];
                                connection.query(
                                    sql,
                                    arg,
                                    (error, results, filelds) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            console.log(
                                                '응답 > DB > Query >  updateClientUserInfo  : results2',
                                                results
                                            );
                                            resolve(results[0]);
                                        }
                                    }
                                );
                                // logger.log(
                                //     'info',
                                //     `[DB 성공] > ${email} / `,
                                //     '연락처 변경 완료'
                                // );
                            }
                        }
                    );
                }
            });
        });
    }
    // 사용자 정보 변경 - 컨설턴트 입금정보 : 사용자 타입별 분할
    async updateBankInfo({
        email,
        userType,
        bankName,
        bankAccountNum,
        bankAccountOwner,
    }) {
        let result;
        if (userType === 1) {
            result = await this.updateUserBankInfo({
                email,
                bankName,
                bankAccountNum,
                bankAccountOwner,
            });
        } else if (userType === 2) {
            result = await this.updateCompanyBankInfo({
                email,
                bankName,
                bankAccountNum,
                bankAccountOwner,
            });
        } else {
            throw error;
        }
        return result;
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
    // 기업 - 사용자 소속요청 승인 처리

    //DELETE
    //회원 탈퇴 - 나중에 처리하기
    /*
        **회원탈퇴 처리 순서 : 트랜잭션 처리**
        1. 탈퇴사유 insert
        2. 사용자 정보로 사용자-기업 정보 가져오기 : 기업id, 관리자 여부
        3. 사용자-기업 테이블에서 기업의 사용자 수 가져오기 : 마지막 사용자이면 기업정보 삭제
        4. 사용자-기업 레코드 삭제
        5. 기업테이블에서 기업의 마지막 사용자 이거나 사용자가 관리자이면 해당 기업 레코드 삭제
        6. 사용자 테이블에서 사용자 레코드 삭제
        7. cognito 사용자 가입정보 삭제
        */

    /*
        **회원탈퇴 차후 처리 사유
        1. 사용자가 탈퇴 처리(탈퇴시 사용자와 연관된 정보 모두 삭제) 또는 사용자가 탈퇴 요청(관리자에게 탈퇴 요청 후 관리자가 탈퇴처리) 여부 
        2. 사용자가 탈퇴처리 시 연관된 기업정보가 삭제되면 예측하지 못한 큰 문제 발생가능(바우처, 잘못된 기업, 사용자가 남아있는 기업 삭제)
        3. 프로젝트와 다른 여러 처리 후 나중에 처리
        */

    async deleteUser(token, { email, userType, withdrawalType }) {
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
                connection.beginTransaction(function (err) {
                    if (err) throw err;
                });
                sql = `INSERT INTO withdrawal_info (user_type, withdrawal_type) VALUES (?, ?)`;
                arg = [userType, withdrawalType];
                await connection.query(
                    sql,
                    arg,
                    function (error, results, fields) {
                        if (error) throw error;
                        console.log('deleteUser > 탈퇴정보 저장', results);
                    }
                );

                if (userType === 2 || userType === 3) {
                    if (userType === 3) {
                        tableName = 'client_user_and_company';
                        userIdColumn = 'client_user_id';
                        companyIdColumn = 'client_company_id';
                    } else {
                        tableName = 'consultant_user_and_company';
                        userIdColumn = 'consultant_user_id';
                        companyIdColumn = 'consulting_company_id';
                    }
                    sql = `
                        SELECT ${companyIdColumn}, belonging_type FROM ${tableName} WHERE ${userIdColumn} = ?`;
                    arg = [email];
                    let userAndCompanyInfo;
                    await connection.query(
                        sql,
                        arg,
                        function (error, results, fields) {
                            if (error) throw error;
                            // console.log(
                            //     '사용자 기업 연결정보 가져오기 --------------------',
                            //     results
                            // );
                            userAndCompanyInfo = results[0];
                            console.log(
                                ' 사용자 기업 연결정보 가져오기 ~~~~~~~~~~~',
                                userAndCompanyInfo
                            );
                            sql = `SELECT ${companyIdColumn}, belonging_type FROM ${tableName} WHERE ${userIdColumn} = ?`;
                            arg = [email];
                        }
                    );
                }

                await connection.commit(function (err) {
                    if (err) throw err;
                });
                console.log('success! 회원탈퇴처리완료!!');
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
    // 기업--------------------------------------------------------------------
    // CREATE

    // GET
    // 기업 리스트 가져오기 : 기업(클/컨) 공통
    getCompanyList({ userType }) {
        let sql;
        let tableName, idColumn;

        if (userType === 2) {
            tableName = 'consulting_companies';
            idColumn = 'consulting_company_id';
        } else if (userType === 3) {
            tableName = 'client_companies';
            idColumn = 'client_company_id';
        } else {
            throw error;
        }

        return new Promise((resolve, reject) => {
            pool.getConnection(async (error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `SELECT ${idColumn}, company_name, president_name from ${tableName} WHERE approval_state IN (2, 3);`;
                    await connection.query(sql, (error, results, filelds) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log(
                                '컨설팅 기업 정보리스트 가져오기 ------------------- : ',
                                results
                            );
                            resolve(results);
                        }
                    });
                }
            });
        });
    }
    // 기업 정보 가져오기
    getCompanyInfo({ userType, companyId }) {
        let sql, arg;
        let tableName, idColumn;
        console.log(
            ' 요청 > DB > getCompanyInfo > 기업 정보 가져오기 ------------------- : ',
            { userType, companyId }
        );

        if (userType === 3) {
            tableName = 'client_companies';
            idColumn = 'client_companies';
        } else if (userType === 2) {
            tableName = 'consulting_companies';
            idColumn = 'consulting_company_id';
        }

        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;
                    arg = [companyId];
                    connection.query(sql, arg, (error, results, filelds) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log(
                                ' 응답 > DB > getCompanyInfo > 기업 정보 가져오기 ------------------- : ',
                                results
                            );
                            resolve(results[0]);
                        }
                    });
                }
            });
        });
    }
    // 기업 소속 사용자들 정보 가져오기 : 기업 (클라이언트/컨설턴트) 공통
    getCompanyBelongedUsersInfo({ userType, companyId }) {
        console.log('--------------------', userType, companyId);
        let result = [];
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn, userTypeForGetInfo;

        if (userType === 2) {
            tableName = 'consultant_user_and_company';
            companyIdColumn = 'consulting_company_id';
            userIdColumn = 'consultant_user_id';
            userTypeForGetInfo = 1;
        } else if (userType === 3) {
            tableName = 'client_user_and_company';
            companyIdColumn = 'client_company_id';
            userIdColumn = 'client_user_id';
            userTypeForGetInfo = 3;
        }

        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `SELECT ${userIdColumn} FROM ${tableName} WHERE ${companyIdColumn} = ?`;
                    arg = [companyId];
                    connection.query(
                        sql,
                        arg,
                        async (error, results, fields) => {
                            if (error) {
                                reject(error);
                            } else {
                                let belongedUsers = results.map(
                                    (user) => user[userIdColumn]
                                );
                                for (let i = 0; i < belongedUsers.length; i++) {
                                    let userData = {
                                        email: belongedUsers[i],
                                        userType: userTypeForGetInfo,
                                    };
                                    let userInfo = await this.getUserInfo(
                                        userData
                                    );
                                    result.push(userInfo);
                                }
                                console.log(
                                    '소속 사용자들 정보 ------------------- : ',
                                    result
                                );
                                resolve(result);
                            }
                        }
                    );
                }
            });
        });
    }
    // UPDATE
    // DELETE

    // 사용자-기업 관계--------------------------------------------------------------------
    // CREATE
    //사용자-기업 관계 데이터 생성
    createUserAndCompanyRelation({ userType, email, companyId }) {
        let result;
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn, belongingType;

        if (userType === 3) {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
            companyIdColumn = 'client_company_id';
            belongingType = 2; // 클라이언트 사용자는 바로 소속처리 : 상황변경에 따라 기본값 변경
        } else if (userType === 2 || userType === 1) {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
            belongingType = 1; // 컨설턴트 사용자는 소속요청 중 처리
        }

        return new Promise((resolve, reject) => {
            pool.getConnection(async (error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    let checkBelongingCompany = await this.getRelationInfo({
                        email,
                        userType,
                    });
                    // console.log(
                    //     'createUserAndCompanyRelation checkBelongingCompany : ',
                    //     checkBelongingCompany
                    // );
                    // console.log(
                    //     'createUserAndCompanyRelation 연결데이터 확인 : ',
                    //     checkBelongingCompany[companyIdColumn],
                    //     companyId
                    // );
                    if (checkBelongingCompany === undefined) {
                        // 기업에 처음 소속요청을 하는 경우
                        sql = `INSERT INTO ${tableName} (${userIdColumn}, ${companyIdColumn}, belonging_type) VALUES (?, ?, ?);`;
                        arg = [email, companyId, belongingType];

                        await connection.query(
                            sql,
                            arg,
                            (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    result = results;
                                    resolve(result);
                                }
                            }
                        );
                    } else if (
                        checkBelongingCompany[companyIdColumn] !==
                        Number(companyId) // 이미 타기업에 소속된 사용자의 경우
                    ) {
                        reject(error); // 타기업에 소속된 사용자는 중복 소속요청을 할 수 없습니다. - 예외처리!!!!!!!!!!!
                    } else if (
                        checkBelongingCompany[companyIdColumn] ===
                        Number(companyId)
                    ) {
                        // 현재 기업에 소속된 적 있었던 사용자의 경우
                        let updateData = {
                            userType: userType,
                            companyId: companyId,
                            email: email,
                            belongingType: belongingType,
                        };
                        result = await this.updateBelongingStatus(updateData);
                        resolve(result);
                    }
                }
            });
        });
    }
    // GET
    // 사용자-기업 연결정보 가져오기
    getRelationInfo({ email, userType }) {
        let sql, arg;
        let tableName, userIdColumn;
        console.log('요청 > DB > Query >  getRelationInfo : ', email, userType);

        if (userType === 3) {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
        } else if (userType === 2) {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
        }

        return new Promise((resolve, reject) => {
            pool.getConnection(async (error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `SELECT * FROM ${tableName} WHERE ${userIdColumn} = ?`;
                    arg = [email];
                    await connection.query(
                        sql,
                        arg,
                        (error, results, filelds) => {
                            if (error) {
                                console.log(
                                    '에러 > DB > Query >  getRelationInfo : ',
                                    error
                                );
                                reject(error);
                            } else {
                                console.log(
                                    '응답 > DB > Query >  getRelationInfo : ',
                                    results
                                );
                                resolve(results[0]);
                            }
                        }
                    );
                }
            });
        });
    }

    // UPDATE
    // 업체 - 소속 상태변경(승인, 거절, 삭제)처리
    updateBelongingStatus({ userType, companyId, email, belongingType }) {
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            '요청 > DB > Query >  updateBelongingStatus : ',
            email,
            userType,
            companyId
        );
        if (userType === 1 || userType === 2) {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
        } else if (userType === 3) {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
            companyIdColumn = 'client_company_id';
        }
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `UPDATE ${tableName} SET belonging_type = ? WHERE ${companyIdColumn} = ? AND ${userIdColumn}= ?;`;
                    arg = [belongingType, companyId, email];
                    connection.query(sql, arg, (error, results, filelds) => {
                        if (error) {
                            console.log(
                                '에러 > DB > Query >  updateBelongingStatus  : error',
                                error
                            );
                            reject(error);
                        } else {
                            console.log(
                                ' 응답 > DB > Query >  updateBelongingStatus  : results1',
                                results
                            );
                            // resolve(results);
                            sql = `SELECT ${userIdColumn},belonging_type FROM ${tableName} WHERE ${companyIdColumn} = ? AND ${userIdColumn}= ?`;
                            arg = [companyId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, filelds) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        console.log(
                                            ' 응답 > DB > Query >  updateBelongingStatus  : results2',
                                            results
                                        );
                                        if (results.length === 0) {
                                            reject(
                                                '선택 사용자가 소속기업이 없는 경우 // query에서 예외처리'
                                            );
                                        }
                                        resolve(results[0]);
                                    }
                                }
                            );
                        }
                    });
                }
            });
        });
    }
    // DELETE
    //사용자-기업 관계 데이터 삭제
    // ** 추후 확인 사항 : 사용자 프로젝트 진행 시 삭제 불가!! 프로젝트 서비스 작성 시 고려해 코드추가!!!!!!!!
    deleteUserAndCompanyRelation({ userType, email, companyId }) {
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            ' 요청 > DB > Query >  deleteUserAndCompanyRelation  : 요청데이터 : ',
            {
                userType,
                email,
                companyId,
            }
        );

        if (userType === 3) {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
            companyIdColumn = 'client_company_id';
        } else if (userType === 2) {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
        } else if (userType === 1) {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
        }

        return new Promise((resolve, reject) => {
            pool.getConnection(async (error, connection) => {
                if (error) {
                    console.log(
                        ' 에러 > DB > Query >  deleteUserAndCompanyRelation  : error2',
                        error
                    );
                    reject(error);
                } else {
                    sql = `DELETE FROM ${tableName} WHERE ${userIdColumn} = ? AND ${companyIdColumn} = ?`;
                    arg = [email, companyId];

                    await connection.query(
                        sql,
                        arg,
                        (error, results, fields) => {
                            if (error) {
                                console.log(
                                    ' 에러 > DB > Query >  deleteUserAndCompanyRelation  : error3',
                                    error
                                );
                                reject(error);
                            } else {
                                console.log(
                                    ' 응답 > DB > Query >  deleteUserAndCompanyRelation  : results',
                                    results
                                );
                                resolve(results);
                            }
                        }
                    );
                }
            });
        });
    }
    // 프로필 -------------------------------------------------------------------------------------
    // CREATE
    // 개인 컨설턴트 프로필 생성
    createConsultantProfileTemp(
        {
            email,
            introduce,
            abilityCertifications, // 수행가능 인증들 데이터 - 여러개이므로 배열형태로 받기
            // certificationId,
            // certificationName,
            abilityTasks, // 수행가능 세부과제들 데이터 - 여러개이므로 배열형태로 받기
            // taskId,
            // taskName,
            // taskGroupId,
            // taskGroupName,
            abilityIndustries, // 수행가능 업종들 데이터 - 여러개이므로 배열형태로 받기
            // industryId,
            // industryName,
            academicBackground, // 학력정보들 - 여러개이므로 배열형태로 받기 // 파일 업로드 처리
            // finalAcademicType,
            // schoolName,
            // majorName,
            // graduationClassificationType,
            // admissionDate,
            // graduateDate,
            career, // 경력 정보들 - 여러개이므로 배열형태로 받기  // 파일 업로드 처리
            // companyName,
            // position,
            // assignedWork,
            // joiningDate,
            // resignationDate = null,
            license, // 자격증 정보들 - 여러개이므로 배열형태로 받기 // 파일 업로드 처리
            // licenseName,
            // license_num,
            // issueInstitution,
            // issuedDate,
            projectHistory,
            // projectName,
            // assignedTask,
            // projectIndustryName,
            // projectStartDate,
            // projectEndDate,
            etc,
            // etcCertifications = null,
            // etcIndustries = null,
        },
        uploadData
    ) {
        // email = 'mg.sun@aegisecu.com'; // 테스트용
        let result, sql, arg;
        console.log(
            '요청 > DB > Query >  CreateConsultantProfileTemp  : parameter',
            // email,
            // abilityCertifications[0],
            // abilityIndustries,
            // abilityIndustries[0],
            // academicBackground,
            // career[0],
            // license[0],
            // projectHistory[0],
            // etc},
            uploadData
        );

        pool.getConnection(async (error, connection) => {
            try {
                if (error) {
                    console.log(
                        ' 에러 > DB > Query >  CreateConsultantProfileTemp  : error1',
                        error
                    );
                    throw error;
                }
                connection.beginTransaction(function (error) {
                    if (error) throw error;
                });

                sql = `INSERT INTO consultant_profile_temp (consultant_user_id, consultant_introduce) VALUES (?, ?)`;
                arg = [email, introduce];
                await connection.query(sql, arg, (error, results, filelds) => {
                    if (error) {
                        console.log(
                            ' 에러 > DB > Query >  CreateConsultantProfileTemp  : error2',
                            error
                        );
                        throw error;
                    }
                });
                sql = `SELECT * FROM consultant_profile_temp WHERE consultant_user_id=?`;
                arg = [email];
                connection.query(sql, arg, (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                    console.log(
                        ' 응답 > DB > Query >  CreateConsultantProfileTemp  : results',
                        results
                    );
                    let consultantProfileTempId =
                        results[0]['consultant_profile_temp_id'];
                    // console.log('~~~~~~~~~~', consultantProfileTempId);

                    // 수행가능인증 - 여러개 : 아이디/인증명 가져오기
                    sql = `INSERT INTO temp_profile_ability_certifications (consultant_profile_temp_id, certification_id, certification_name) VALUES (?, ?, ?)`;

                    for (let i = 0; i < abilityCertifications.length; i++) {
                        arg = [
                            consultantProfileTempId,
                            abilityCertifications[i].certificationId,
                            abilityCertifications[i].certificationName,
                        ];
                        connection.query(
                            sql,
                            arg,
                            (error, results, filelds) => {
                                if (error) throw error;
                                console.log(
                                    'abilityCertifications 결과 : ',
                                    results
                                );
                            }
                        );
                    }

                    // 수행가능업종 - 여러개 : 추후 정책 확인 후 완료
                    sql = `INSERT INTO temp_profile_ability_industries (consultant_profile_temp_id, industry_id, industry_name) VALUES (?, ?, ?)`;
                    for (let i = 0; i < abilityIndustries.length; i++) {
                        arg = [
                            consultantProfileTempId,
                            abilityIndustries[i].industryId,
                            abilityIndustries[i].industryName,
                        ];
                        connection.query(
                            sql,
                            arg,
                            (error, results, filelds) => {
                                if (error) throw error;
                                console.log(
                                    'abilityIndustries 결과 : ',
                                    results
                                );
                            }
                        );
                    }

                    // 수행가능 세부과제 - 여러개 : 세부과제 id/과제명/분류id/분류명
                    sql = `INSERT INTO temp_profile_ability_tasks (consultant_profile_temp_id, task_id, task_name, task_group_id, task_group_name) VALUES (?, ?, ?, ?, ?)`;
                    for (let i = 0; i < abilityTasks.length; i++) {
                        arg = [
                            consultantProfileTempId,
                            abilityTasks[i].taskId,
                            abilityTasks[i].taskName,
                            abilityTasks[i].taskGroupId,
                            abilityTasks[i].taskGroupName,
                        ];
                        connection.query(
                            sql,
                            arg,
                            (error, results, filelds) => {
                                if (error) throw error;
                                console.log('abilityTasks 결과 : ', results);
                            }
                        );
                    }

                    //학력 - 최종학력 1개 academicCertificationFilePath - 지정
                    sql = `INSERT INTO temp_profile_academic_background (consultant_profile_temp_id, final_academic_type, school_name, major_name, graduation_classification_type, admission_date, graduate_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    arg = [
                        consultantProfileTempId,
                        academicBackground.finalAcademicType,
                        academicBackground.schoolName,
                        academicBackground.majorName,
                        academicBackground.graduationClassificationType,
                        // academicBackground.academicCertificationFile,
                        // academicBackground.academicCertificationFilePath,
                        academicBackground.admissionDate,
                        academicBackground.graduateDate,
                    ];
                    connection.query(sql, arg, (error, results, filelds) => {
                        if (error) throw error;
                        console.log('academicBackground 결과 : ', results);
                    });

                    //경력 : 여러개 careerCertificationFilePath - 지정!!
                    sql = `INSERT INTO temp_profile_career (consultant_profile_temp_id, company_name, position, assigned_work, joining_date, resignation_date) VALUES (?, ?, ?, ?, ?, ?)`;
                    for (let i = 0; i < career.length; i++) {
                        arg = [
                            consultantProfileTempId,
                            career[i].companyName,
                            career[i].position,
                            career[i].assignedWork,
                            // career[i].careerCertificationFile,
                            // career[i].careerCertificationFilePath,
                            career[i].joiningDate,
                            career[i].resignationDate,
                        ];
                        connection.query(
                            sql,
                            arg,
                            (error, results, filelds) => {
                                if (error) throw error;
                                console.log('career 결과 : ', results);
                            }
                        );
                    }
                    //자격증 : 여러개 licenseFilePath- 지정!!
                    sql = `INSERT INTO temp_profile_license (consultant_profile_temp_id, license_name, license_num, issue_institution, issued_date) VALUES (?, ?, ?, ?, ?)`;
                    for (let i = 0; i < license.length; i++) {
                        arg = [
                            consultantProfileTempId,
                            license[i].licenseName,
                            license[i].licenseNum,
                            license[i].issueInstitution,
                            // license[i].licenseFile,
                            // license[i].licenseFilePath,
                            license[i].issuedDate,
                        ];
                        connection.query(
                            sql,
                            arg,
                            (error, results, filelds) => {
                                if (error) throw error;
                                console.log('license 결과 : ', results);
                            }
                        );
                    }
                    // 수행이력 : 여러개
                    sql = `INSERT INTO temp_profile_project_history (consultant_profile_temp_id, project_name, assigned_task, industry_category_id, industry_category_name, project_start_date, project_end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    for (let i = 0; i < projectHistory.length; i++) {
                        arg = [
                            consultantProfileTempId,
                            projectHistory[i].projectName,
                            projectHistory[i].assignedTask,
                            projectHistory[i].industryCategoryId,
                            projectHistory[i].industryCategoryName,
                            projectHistory[i].projectStartDate,
                            projectHistory[i].projectEndDate,
                        ];
                        connection.query(
                            sql,
                            arg,
                            (error, results, filelds) => {
                                if (error) throw error;
                                console.log('projectHistory 결과 : ', results);
                            }
                        );
                    }

                    // 기타 : 기타 수행가능 업종/인증 (input 작성) - 추후 정책 처리 된 후 수정
                    sql = `INSERT INTO temp_profile_ability_etc (consultant_profile_temp_id, etc_certifications, etc_industries) VALUES (?, ?, ?)`;
                    arg = [
                        consultantProfileTempId,
                        etc.etcCertifications,
                        etc.etcIndustries,
                    ];
                    connection.query(sql, arg, (error, results, filelds) => {
                        if (error) throw error;
                    });

                    // 업로드 파일들 처리
                    sql = `INSERT INTO temp_upload_files (consultant_profile_temp_id, file_category_type, file_name, file_path) VALUES (?, ?, ?, ?)`;
                    let fileCategoryType;

                    for (let i = 0; i < uploadData.length; i++) {
                        if (uploadData[i]['fieldname'] === 'academic') {
                            fileCategoryType = 0;
                        } else if (uploadData[i]['fieldname'] === 'career') {
                            fileCategoryType = 1;
                        } else if (uploadData[i]['fieldname'] === 'license') {
                            fileCategoryType = 2;
                        } else {
                            // 타입 에러 예외처리
                        }
                        arg = [
                            consultantProfileTempId,
                            fileCategoryType,
                            uploadData[i].originalname,
                            uploadData[i].location,
                        ];

                        connection.query(sql, arg, (error, results, fields) => {
                            if (error) throw error;
                            console.log('upload 처리 결과 : ', results);
                        });
                    }

                    connection.commit(function (error) {
                        if (error) throw error;
                    });
                    console.log('임시저장 success!!!');
                });
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
    createConsultingCompanyProfileTemp(
        { companyId, introduce, projectHistory },
        uploadData
    ) {
        let result, sql, arg;
        console.log(
            '요청 > DB > Query >  createConsultingCompanyProfileTemp  : parameter',
            { companyId, introduce, projectHistory },
            uploadData
        );

        pool.getConnection(async (error, connection) => {
            try {
                if (error) {
                    console.log(
                        ' 에러 > DB > Query >  createConsultingCompanyProfileTemp  : error1',
                        error
                    );
                    throw error;
                }
                connection.beginTransaction(function (error) {
                    if (error) throw error;
                });
                // 기업 프로필 임시저장 데이터 저장
                sql = `INSERT INTO consulting_company_profile_temp (consulting_company_id, company_introduce, business_license_file, business_license_file_path) VALUES (?, ?, ?, ?)`;
                arg = [
                    companyId,
                    introduce,
                    uploadData[0]['originalname'],
                    uploadData[0]['location'],
                ];
                connection.query(sql, arg, (error, results, fields) => {
                    if (error) throw error;
                    // 기업 프로필 임시저장 아이디 가져오기
                    sql = `SELECT consulting_company_profile_temp_id FROM consulting_company_profile_temp WHERE consulting_company_id=?`;
                    arg = companyId;
                    connection.query(sql, arg, (error, results, fields) => {
                        if (error) throw error;
                        let profileTempId =
                            results[0]['consulting_company_profile_temp_id'];
                        console.log('프로필 임시 아이디', profileTempId);
                        // 기업 수행이력 임시저장 데이터 저장
                        sql = `INSERT INTO temp_consulting_company_profile_project_history (consulting_company_profile_temp_id, project_name, assigned_task, industry_category_id, industry_category_name, project_start_date, project_end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                        for (let i = 0; i < projectHistory.length; i++) {
                            console.log(
                                '-------------------------',
                                projectHistory[i]
                            );
                            arg = [
                                // companyId,
                                profileTempId,
                                projectHistory[i].projectName,
                                projectHistory[i].assignedTask,
                                projectHistory[i].industryCategoryId,
                                projectHistory[i].industryCategoryName,
                                projectHistory[i].projectStartDate,
                                projectHistory[i].projectEndDate,
                            ];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) throw error;
                                }
                            );
                        }
                        connection.commit(function (error) {
                            if (error) throw error;
                        });
                        console.log('임시저장 success!!!');
                    });
                });
            } catch (error) {
                console.log('fail!!');
                return connection.rollback(() => {
                    throw error;
                });
            } finally {
                connection.release();
                return result;
            }
        });
    }
    getConsultantProfileTemp({ email }) {
        let result, sql, arg;
        console.log(
            '요청 > DB > Query >  createConsultingCompanyProfileTemp  : parameter',
            email
        );

        return new Promise((resolve, reject) => {
            try {
                pool.getConnection((error, connection) => {
                    if (error) reject(error);
                    // 프로필 임시저장 기본 정보
                    sql = `SELECT * FROM consultant_profile_temp WHERE consultant_user_id=?`;
                    arg = [email];

                    connection.query(
                        sql,
                        arg,
                        async (error, results, fields) => {
                            if (error) reject(error);
                            let consultantProfileTempInfo = {
                                consultantProfileTempId:
                                    results[0]['consultant_profile_temp_id'],
                                consultantIntroduce:
                                    results[0]['consultant_introduce'],
                            };
                            let consultantProfileTempId =
                                results[0]['consultant_profile_temp_id'];
                            // console.log(
                            //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 1',
                            //     consultantProfileTempInfo,
                            //     consultantProfileTempId
                            // );
                            // 인증
                            sql = `SELECT * FROM temp_profile_ability_certifications WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let abilityCertificationTemp = [];
                                    for (let i = 0; i < results.length; i++) {
                                        let abilityCertificationTempItems = {
                                            certificationId:
                                                results[i]['certification_id'],
                                            certificationName:
                                                results[i][
                                                    'certification_name'
                                                ],
                                        };
                                        abilityCertificationTemp.push(
                                            abilityCertificationTempItems
                                        );
                                    }
                                    consultantProfileTempInfo.abilityCertifications = abilityCertificationTemp;
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 2',
                                    //     consultantProfileTempInfo
                                    //     // results
                                    // );
                                }
                            );
                            // 세부과제
                            sql = `SELECT * FROM temp_profile_ability_tasks WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let abilityTasksTemp = [];
                                    for (let i = 0; i < results.length; i++) {
                                        let abilityTasksTempItems = {
                                            taskId: results[i]['task_id'],
                                            taskName: results[i]['task_name'],
                                            taskGroupId:
                                                results[i]['task_group_id'],
                                            taskGroupName:
                                                results[i]['task_group_name'],
                                        };
                                        abilityTasksTemp.push(
                                            abilityTasksTempItems
                                        );
                                    }
                                    consultantProfileTempInfo.abilityTasks = abilityTasksTemp;
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 3',
                                    //     consultantProfileTempInfo
                                    //     // results
                                    // );
                                }
                            );
                            // 업종
                            sql = `SELECT * FROM temp_profile_ability_industries WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let abilityIndustriesTemp = [];
                                    for (let i = 0; i < results.length; i++) {
                                        let abilityIndustriesTempItems = {
                                            industryId:
                                                results[i]['industry_id'],
                                            industryName:
                                                results[i]['industry_name'],
                                        };
                                        abilityIndustriesTemp.push(
                                            abilityIndustriesTempItems
                                        );
                                    }
                                    consultantProfileTempInfo.abilityIndustries = abilityIndustriesTemp;
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 4',
                                    //     consultantProfileTempInfo
                                    // );
                                }
                            );
                            // 학력
                            sql = `SELECT * FROM temp_profile_academic_background WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    consultantProfileTempInfo.academicBackground = {
                                        finalAcademicType:
                                            results[0]['final_academic_type'],
                                        schoolName: results[0]['school_name'],
                                        majorName: results[0]['major_name'],
                                        graduationClassificationType:
                                            results[0][
                                                'graduation_classification_type'
                                            ],
                                        admissionDate:
                                            results[0]['admission_date'],
                                        graduateDate:
                                            results[0]['graduate_date'],
                                    };
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 5',
                                    //     consultantProfileTempInfo
                                    // );
                                }
                            );
                            // 경력
                            sql = `SELECT * FROM temp_profile_career WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let careerTemp = [];
                                    for (let i = 0; i < results.length; i++) {
                                        let careerTempItem = {
                                            companyName:
                                                results[i]['company_name'],
                                            position: results[i]['position'],
                                            assignedWork:
                                                results[i]['assigned_work'],
                                            joiningDate:
                                                results[i]['joining_date'],
                                            resignationDate:
                                                results[i]['resignation_date'],
                                        };
                                        careerTemp.push(careerTempItem);
                                    }
                                    consultantProfileTempInfo.career = careerTemp;
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 6',
                                    //     consultantProfileTempInfo
                                    // );
                                }
                            );
                            // 자격증
                            sql = `SELECT * FROM temp_profile_license WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let licenseTemp = [];
                                    for (let i = 0; i < results.length; i++) {
                                        let licenseTempItem = {
                                            licenseName:
                                                results[i]['license_name'],
                                            licenseNum:
                                                results[i]['license_num'],
                                            issueInstitution:
                                                results[i]['issue_institution'],
                                            issuedDate:
                                                results[i]['issued_date'],
                                        };
                                        licenseTemp.push(licenseTempItem);
                                    }
                                    consultantProfileTempInfo.license = licenseTemp;
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 7',
                                    //     consultantProfileTempInfo
                                    // );
                                }
                            );
                            // 수행이력
                            sql = `SELECT * FROM temp_profile_project_history WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let projectHistoryTemp = [];
                                    for (let i = 0; i < results.length; i++) {
                                        let projectHistoryTempItem = {
                                            projectName:
                                                results[i]['project_name'],
                                            assignedTask:
                                                results[i]['assigned_task'],
                                            industryCategoryId:
                                                results[i][
                                                    'industry_category_id'
                                                ],
                                            industryCategoryName:
                                                results[i][
                                                    'industry_category_name'
                                                ],
                                            projectStartDate:
                                                results[i][
                                                    'project_start_date'
                                                ],
                                            projectEndDate:
                                                results[i]['project_end_date'],
                                        };
                                        projectHistoryTemp.push(
                                            projectHistoryTempItem
                                        );
                                    }
                                    consultantProfileTempInfo.projectHistory = projectHistoryTemp;
                                    // console.log(
                                    //     'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 8',
                                    //     consultantProfileTempInfo
                                    // );
                                }
                            );
                            //기타
                            sql = `SELECT * FROM temp_profile_ability_etc WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let etcTemp = {
                                        etcCertifications:
                                            results[0]['etc_certifications'],
                                        etcIndustries:
                                            results[0]['etc_industries'],
                                    };
                                    consultantProfileTempInfo.etc = etcTemp;
                                    console.log(
                                        'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 9',
                                        consultantProfileTempInfo
                                    );
                                }
                            );
                            // 업로드 파일
                            sql = `SELECT * FROM temp_upload_files WHERE consultant_profile_temp_id = ? AND consultant_user_id = ?`;
                            arg = [consultantProfileTempId, email];
                            connection.query(
                                sql,
                                arg,
                                (error, results, fields) => {
                                    if (error) reject(error);
                                    let uploadFilesTemp = {
                                        academic: [],
                                        career: [],
                                        license: [],
                                    };
                                    for (let i = 0; i < results.length; i++) {
                                        let uploadFilesTempItem = {
                                            fileCategoryType:
                                                results[i][
                                                    'file_category_type'
                                                ],
                                            fileName: results[i]['file_name'],
                                            filePath: results[i]['file_path'],
                                        };

                                        if (
                                            uploadFilesTempItem.fileCategoryType ===
                                            0
                                        ) {
                                            uploadFilesTemp.academic.push(
                                                uploadFilesTempItem
                                            );
                                        } else if (
                                            uploadFilesTempItem.fileCategoryType ===
                                            1
                                        ) {
                                            uploadFilesTemp.career.push(
                                                uploadFilesTempItem
                                            );
                                        } else if (
                                            uploadFilesTempItem.fileCategoryType ===
                                            2
                                        ) {
                                            uploadFilesTemp.license.push(
                                                uploadFilesTempItem
                                            );
                                        }
                                    }
                                    consultantProfileTempInfo.uploadFiles = uploadFilesTemp;
                                    console.log(
                                        'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 10',
                                        consultantProfileTempInfo
                                    );
                                    result = consultantProfileTempInfo;
                                    resolve(result);
                                }
                            );
                        }
                    );
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    getConsultingCompanyProfileTemp({ email, userType }) {
        let result, sql, arg;
        let self = this;

        return new Promise((resolve, reject) => {
            try {
                pool.getConnection(async (error, connection) => {
                    if (error) {
                        reject(error);
                    } else {
                        let consultingCompanyInfo = await self.getUserBelongingCompanyInfo(
                            {
                                email,
                                userType,
                            }
                        );
                        console.log(
                            'DB > Query > getConsultingCompanyProfileTemp > getUserBelongingCompanyInfo',
                            consultingCompanyInfo
                        );
                        let consultingCompanyId =
                            consultingCompanyInfo['consulting_company_id'];
                        let consultingCompanyProfileTempInfo = {
                            consultingCompanyId: consultingCompanyId,
                        };

                        sql = `SELECT * FROM consulting_company_profile_temp WHERE consulting_company_id = ?`;
                        arg = [consultingCompanyId];
                        connection.query(sql, arg, (error, results, fields) => {
                            if (error) {
                                reject(error);
                            } else {
                                consultingCompanyProfileTempInfo.companyIntroduce =
                                    results[0]['company_introduce'];
                                consultingCompanyProfileTempInfo.businessLicenseFile =
                                    results[0]['business_license_file'];
                                consultingCompanyProfileTempInfo.businessLicenseFilePath =
                                    results[0]['business_license_file_path'];

                                let consultingCompanyProfileTempId =
                                    results[0][
                                        'consulting_company_profile_temp_id'
                                    ];

                                sql = `SELECT * FROM temp_consulting_company_profile_project_history WHERE consulting_company_profile_temp_id = ? AND consulting_company_id = ?`;
                                arg = [
                                    consultingCompanyProfileTempId,
                                    consultingCompanyId,
                                ];
                                connection.query(
                                    sql,
                                    arg,
                                    (error, results, fields) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            let consultingCompanyProjectHistoryTemp = [];
                                            for (
                                                let i = 0;
                                                i < results.length;
                                                i++
                                            ) {
                                                let consultingCompanyProjectHistoryTempItem = {
                                                    projectName:
                                                        results[i][
                                                            'project_name'
                                                        ],
                                                    assignedTask:
                                                        results[i][
                                                            'assigned_task'
                                                        ],
                                                    industryCategoryId:
                                                        results[i][
                                                            'industry_category_id'
                                                        ],
                                                    industryCategoryName:
                                                        results[i][
                                                            'industry_category_name'
                                                        ],
                                                    projectStartDate:
                                                        results[i][
                                                            'project_start_date'
                                                        ],
                                                    projectEndDate:
                                                        results[i][
                                                            'project_end_date'
                                                        ],
                                                };
                                                consultingCompanyProjectHistoryTemp.push(
                                                    consultingCompanyProjectHistoryTempItem
                                                );
                                            }
                                            consultingCompanyProfileTempInfo.projectHistoty = consultingCompanyProjectHistoryTemp;

                                            result = consultingCompanyProfileTempInfo;
                                            resolve(result);
                                        }
                                    }
                                );
                            }
                        });
                    }
                });
            } catch (error) {
                throw error;
            }
        });
    }
    deleteProfileTemp({ email, userType }) {
        let sql, arg;

        // userType = 1; // 테스트용
        pool.getConnection((error, connection) => {
            try {
                connection.beginTransaction(function (error) {
                    if (error) throw error;
                });

                if (error) throw error;
                if (userType === 1) {
                    sql = `DELETE FROM a, b, c, d, e, f, g, h, i, j 
                    USING consultant_profile_temp AS a 
                    LEFT JOIN temp_profile_ability_certifications AS b 
                    ON a.consultant_profile_temp_id = b.consultant_profile_temp_id
                    LEFT JOIN temp_profile_ability_tasks AS c
                    ON a.consultant_profile_temp_id = c.consultant_profile_temp_id
                    LEFT JOIN temp_profile_ability_industries AS d
                    ON a.consultant_profile_temp_id = d.consultant_profile_temp_id
                    LEFT JOIN temp_profile_academic_background AS e
                    ON a.consultant_profile_temp_id = e.consultant_profile_temp_id
                    LEFT JOIN temp_profile_career AS f
                    ON a.consultant_profile_temp_id = f.consultant_profile_temp_id
                    LEFT JOIN temp_profile_license AS g
                    ON a.consultant_profile_temp_id = g.consultant_profile_temp_id
                    LEFT JOIN temp_profile_project_history AS h
                    ON a.consultant_profile_temp_id = h.consultant_profile_temp_id
                    LEFT JOIN temp_profile_ability_etc AS i
                    ON a.consultant_profile_temp_id = i.consultant_profile_temp_id
                    LEFT JOIN temp_upload_files AS j
                    ON a.consultant_profile_temp_id = j.consultant_profile_temp_id
                    WHERE a.consultant_user_id = ?`;
                } else if (userType === 2) {
                    sql = `DELETE FROM a, b
                    USING consulting_company_profile_temp AS a LEFT JOIN temp_consulting_company_profile_project_history AS b
                    ON a.consulting_company_profile_temp_id = b.consulting_company_profile_temp_id
                    WHERE a.consulting_company_id = (SELECT consulting_company_id FROM consultant_user_and_company WHERE consultant_user_id = ?)`;
                }
                arg = [email];

                connection.query(sql, arg, (error, results, fields) => {
                    if (error) throw error;
                    console.log(
                        'DB > query > deleteProfileTemp > 삭제결과 : ',
                        results
                    );
                    connection.commit(function (error) {
                        if (error) throw error;
                    });
                    console.log('임시저장 success!!!');
                });
            } catch (error) {
                console.log('fail!!');
                return connection.rollback(() => {
                    throw error;
                });
            } finally {
                connection.release();
            }
        });
    }
};
/*
sql = `INSERT INTO consultant_profile_temp 
                    (consultant_user_id, certification_id, certification_name, task_id, task_name, task_group_id, task_group_name, industry_id, industry_name, final_academic_type, school_name, major_name, graduation_classification_type, certification_file, admission_date, graduate_date, company_name, position, career_certificate_file, joining_date, resignation_date, license_name, license_num, issue_institution, license_file, issued_date, project_name, assigned_task, project_industry_name, project_start_date, project_end_date, etc_certifications, etc_industries) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    arg = [
                        email,
                        certificationId,
                        certificationName,
                        taskId,
                        taskName,
                        taskGroupId,
                        taskGroupName,
                        industryId,
                        industryName,
                        finalAcademicType,
                        schoolName,
                        majorName,
                        graduationClassificationType,
                        certificationFile,
                        admissionDate,
                        graduateDate,
                        companyName,
                        position,
                        assignedWork
                        careerCertificateFile,
                        joiningDate,
                        resignationDate,
                        licenseName,
                        license_num,
                        issueInstitution,
                        licenseFile,
                        issuedDate,
                        projectName,
                        assignedTask,
                        projectIndustryName,
                        projectStartDate,
                        projectEndDate,
                        etcCertifications,
                        etcIndustries,
                    ];
*/

//------------------------------------------------------코드 리뷰 이후 삭제처리 ---------------------------
// SignUp에서 모두 처리함  - 트랜잭션
// // 사용자 정보 생성 - 공통
// createUser({ email, name, userType, phoneNum }) {
//     console.log('DB > Query : createclienttantUser!!');

//     let tableName, idColumn;
//     if (userType === 3) {
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
//     if (userType === 3) {
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
//                 result.isManager = 1; // 처음가입이므로 관리자 처리
//                 resolve(result);
//             });
//         });
//     });
// }
// // 기업-사업자 연결 생성
// createCompanyAndUserRelation({ userType, companyId, userId, isManager }) {
//     let tableName, companyIdColumn, userIdColumn;
//     if (userType === 3) {
//         tableName = 'client_user_and_company';
//         companyIdColumn = 'clientCompany_id';
//         userIdColumn = 'client_user_id';
//     } else {
//         tableName = 'consultant_user_and_company';
//         companyIdColumn = 'consulting_company_id';
//         userIdColumn = 'consultant_user_id';
//     }
//     let sql = `INSERT INTO ${tableName} (${companyIdColumn}, ${userIdColumn}, belonging_type) VALUES (?, ?, ?)`;
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
