//TODO : 예외처리 - new Exception(err.statusCode, err.message, err) 추가
const pool = require('./index');
const { logger } = require('../../../adapters/middleware');
const { authService } = require('../../../adapters/outbound/auth'); // 같은 layer - 의존성에 문제 없는지 확인
const { ConnectContactLens } = require('aws-sdk');

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

    // GET
    // 사용자 가져오기 : 클라이언트 / 컨설턴트 공통
    getUserInfo({ email, userType }) {
        console.log('---------------------------------사용자정보 : ', {
            email,
            userType,
        });
        let sql, arg;
        let tableName, idColumn;

        sql = `SELECT * FROM ${tableName} WHERE ${idColumn}=?`;
        arg = [email];
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (userType === '3') {
                    tableName = 'client_users';
                    idColumn = 'client_user_id';
                } else {
                    tableName = 'consultant_users';
                    idColumn = 'consultant_user_id';
                }

                if (error) {
                    reject(error);
                } else {
                    connection.query(
                        sql,
                        arg,
                        function (error, results, fields) {
                            if (error) {
                                console.log(
                                    '에러 응답 > DB > Query >  getConsultantUserInfo  : error',
                                    error
                                );
                                reject(error);
                            }
                            console.log(
                                '응답 > DB > Query > :  getConsultantUserInfo  : result',
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
        if (userType === '3') {
            idColumn = 'client_company_id';
        } else if (userType === '2') {
            idColumn = 'consulting_company_id';
        }
        let companyInfo = await this.getRelationInfo({ email, userType });
        let companyId = companyInfo[`${idColumn}`];

        result = await this.getCompanyInfo({ userType }, companyId);
        console.log('사용자 소속기업정보 가져오기 result', result);
        return result;
        // } catch (error) {
        //     console.log('사용자 소속 기업정보 가져오기 err: ', error);
        //     throw error;
        // }
    }

    // UPDATE
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
                    logger.log(
                        'error',
                        `[DB 오류] > ${email} > /`,
                        `**SQL : ${error.sql} / **MESSAGE :  ${error.sqlMessage}`
                    );
                    reject(error);
                } else {
                    console.log(
                        '응답 > DB > Query >  updateClientUserInfo  : results',
                        results
                    );
                    resolve(results);
                    logger.log(
                        'info',
                        `[DB 성공] > ${email} / `,
                        '연락처 변경 완료'
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
        if (userType === '1') {
            result = await this.updateUserBankInfo;
        } else if (userType === '2') {
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

                if (userType === '2' || userType === '3') {
                    if (userType === '3') {
                        tableName = 'client_user_and_company';
                        userIdColumn = 'client_user_id';
                        companyIdColumn = 'client_company_id';
                    } else {
                        tableName = 'consultant_user_and_company';
                        userIdColumn = 'consultant_user_id';
                        companyIdColumn = 'consulting_company_id';
                    }
                    sql = `
                        SELECT ${companyIdColumn}, is_manager FROM ${tableName} WHERE ${userIdColumn} = ?`;
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
                            sql = `SELECT ${companyIdColumn}, is_manager FROM ${tableName} WHERE ${userIdColumn} = ?`;
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
    getCompanyList(userData) {
        let sql;
        let tableName, idColumn;

        if (userData.userType === '2') {
            tableName = 'consulting_companies';
            idColumn = 'consulting_company_id';
        } else if (userData.userType === '3') {
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
                    sql = `SELECT ${idColumn}, company_name, president_name from ${tableName}`;
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
    getCompanyInfo({ userType }, companyId) {
        let sql, arg;
        let tableName, idColumn;

        if (userType === '3') {
            tableName = 'client_companies';
            idColumn = 'client_companies';
        } else if (userType === '2') {
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
                                ' 기업 정보 가져오기 ------------------- : ',
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
    getCompanyBelongedUsersInfo({ userType }, companyId) {
        // console.log('--------------------', userType, companyId);
        let result = [];
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn, userTypeForGetInfo;

        if (userType === '2') {
            tableName = 'consultant_user_and_company';
            companyIdColumn = 'consulting_company_id';
            userIdColumn = 'consultant_user_id';
            userTypeForGetInfo = '1';
        } else if (userType === '3') {
            tableName = 'client_user_and_company';
            companyIdColumn = 'client_company_id';
            userIdColumn = 'client_user_id';
            userTypeForGetInfo = '3';
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
        let tableName, userIdColumn, companyIdColumn, status;

        if (userType === '3') {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
            companyIdColumn = 'client_company_id';
            status = '2'; // 클라이언트 사용자는 바로 소속처리 : 상황변경에 따라 기본값 변경
        } else if (userType === '2' || userType === '1') {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
            status = '1'; // 컨설턴트 사용자는 소속요청 중 처리
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
                        sql = `INSERT INTO ${tableName} (${userIdColumn}, ${companyIdColumn}, active_type) VALUES (?, ?, ?);`;
                        arg = [email, companyId, status];

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
                            status: status,
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

        if (userType === '3') {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
        } else if (userType === '2') {
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
    // 기업이 사용자 소속 요청에 대한 상태 업데이트
    /* 
    1. 사용자 소속 요청 시 레코드 생성 (승인요청되지 않은 상태로)
    2. 사용자 취소 시 레코드 삭제
    3. 업체 소속요청 후 거절 시 레코드 삭제
    4. 업체 소속요청 후 승인 시 상태변경
    */
    // async updateRegistrationStatus(  //다른 함수로 삭제 / 수정 처리함
    //     { email, userType },
    //     { selectUserId, belongingStatus }
    // ) {
    //     let sql, arg;
    //     let tableName, companyIdColumn, userIdColumn;

    //     if (userType === '3') {
    //         tableName = 'client_user_and_company';
    //         companyIdColumn = 'client_company_id';
    //         userIdColumn = 'client_user_id';
    //     } else if (userType === '2') {
    //         tableName = 'consultant_user_and_company';
    //         companyIdColumn = 'consulting_company_id';
    //         userIdColumn = 'consultant_user_id';
    //     }

    //     let companyInfo = await this.getUserBelongingCompanyInfo({
    //         email,
    //         userType,
    //     });
    //     let companyId = companyInfo[companyIdColumn];

    //     return new Promise((resolve, reject) => {
    //         pool.getConnection((error, connection) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 if (belongingStatus === '0') {
    //                     // 기업에서 거절처리했을 때
    //                     sql = `DELETE FROM ${tableName} WHERE ${companyIdColumn} = ${companyId} AND ${userIdColumn} = ?`;
    //                     arg = [selectUserId];
    //                 } else if (belongingStatus === '1')
    //                     // 기업에서 승인처리했을 때
    //                     sql = `UPDATE ${tableName} SET is_active = ? WHERE ${companyIdColumn} = ${companyId} AND ${userIdColumn} = ?`;
    //                 arg = [belongingStatus, selectUserId];
    //                 connection.query(sql, arg, (error, results, filelds) => {
    //                     if (error) {
    //                         reject(error);
    //                     } else {
    //                         resolve(results);
    //                         // 여기서 소속 컨설턴트 정보 리스트 가져오기 함수처리
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // }
    // 업체 - 소속 상태변경(승인, 거절, 삭제)처리
    updateBelongingStatus({ userType, companyId, email, status }) {
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            '요청 > DB > Query >  updateBelongingStatus : ',
            email,
            userType,
            companyId
        );

        if (userType === '2') {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
        } else if (userType === '3') {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
            companyIdColumn = 'client_company_id';
        }
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `UPDATE ${tableName} SET active_type = ? WHERE ${companyIdColumn} = '${companyId}' AND ${userIdColumn}= '${email}';`;
                    arg = [status];
                    connection.query(sql, arg, (error, results, filelds) => {
                        if (error) {
                            console.log(
                                '에러 > DB > Query >  updateBelongingStatus  : error',
                                error
                            );
                            reject(error);
                        } else {
                            console.log(
                                ' 응답 > DB > Query >  updateBelongingStatus  : results',
                                results
                            );
                            resolve(results);
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

        if (userType === '3') {
            tableName = 'client_user_and_company';
            userIdColumn = 'client_user_id';
            companyIdColumn = 'client_company_id';
        } else if (userType === '2') {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
        } else if (userType === '1') {
            tableName = 'consultant_user_and_company';
            userIdColumn = 'consultant_user_id';
            companyIdColumn = 'consulting_company_id';
        }

        return new Promise((resolve, reject) => {
            pool.getConnection(async (error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    sql = `DELETE FROM ${tableName} WHERE ${userIdColumn} = ? AND ${companyIdColumn} = ?`;
                    arg = [email, companyId];

                    await connection.query(
                        sql,
                        arg,
                        (error, results, fields) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        }
                    );
                }
            });
        });
    }
};
//------------------------------------------------------코드 리뷰 이후 삭제처리 ---------------------------
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
