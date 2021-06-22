const pool = require('./index');
const { DatabaseError } = require('../../error');
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
        // phoneNum,
        businessLicenseNum,
        companyName,
        presidentName,
    }) {
        let result, sql, arg;
        let usersTableName,
            companiesTableName,
            relationTableName,
            userIdColumn,
            companyIdColumn,
            profileState,
            companyInfo,
            companyId,
            belongingType,
            isManager,
            successMessage;

        let userEntity = {
            email: email,
            password: password,
            name: name,
            userType: userType,
        };
        // 사용자 테이블 변수명 지정
        if (userType === 3) {
            usersTableName = 'client_users';
            userIdColumn = 'client_user_id';
        } else {
            // userType === 2 || userType === 1
            usersTableName = 'consultant_users';
            userIdColumn = 'consultant_user_id';
        }
        // 기업 테이블 변수명 지정
        if (userType === 3) {
            companiesTableName = 'client_companies';
            userIdColumn = 'client_company_id';
        } else {
            // userType === 2
            companiesTableName = 'consulting_companies';
            userIdColumn = 'consulting_company_id';
        }
        // 사용자-기업 연결 테이블 변수명 지정
        if (userType === 3) {
            relationTableName = 'client_user_and_company';
            companyIdColumn = 'client_company_id';
            userIdColumn = 'client_user_id';
        } else {
            // userType === 2 || userType === 1
            relationTableName = 'consultant_user_and_company';
            companyIdColumn = 'consulting_company_id';
            userIdColumn = 'consultant_user_id';
        }
        // 사용자 프로필 인증 변수명 지정
        if (userType === 1) {
            profileState = 1;
        } else {
            // 클라이언트와 컨설팅 기업의 경우 기업인증상태로 처리
            profileState = 0;
        }

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            //사용자 정보 생성 - 휴대폰 번호 삭제
            sql = `INSERT INTO ${usersTableName} (${userIdColumn}, name, user_type, profile_state) VALUES (?, ?, ?, ?, ?)`;
            arg = [email, name, userType, profileState];
            let a = await conn.query(sql, arg);
            successMessage = 'success! 개인 컨설턴트!!';

            // 기업사용자 처리 : 개인컨설턴트(userType === 1)는 다 처리했으므로 마지막에 공통처리
            if (userType === 2 || userType === 3) {
                // 기업 사용자 (userType === 2 || userType === 3) 회원 가입 처리

                // 등록 기업 사업자 유무
                sql = `SELECT EXISTS (SELECT * FROM ${companiesTableName} WHERE business_license_num = ?) AS companyExist`;
                arg = [businessLicenseNum];
                let companyExist = await conn.query(sql, arg);
                let isCompanyExist = companyExist[0][0]['companyExist'];

                // 등록된 기업 없음
                if (!isCompanyExist) {
                    //기업 정보 생성
                    console.log('DB > Query : createClientCompany!!');

                    sql = `INSERT INTO ${companiesTableName} (business_license_num, company_name, president_name, approval_state) VALUES (?, ?, ?, ?)`;
                    arg = [businessLicenseNum, companyName, presidentName, 0];
                    const createCompany = await conn.query(sql, arg);
                    console.log('!!!!!!!!!!!!!!!!!!!2', createCompany);

                    // 생성한 기업id 가져오기
                    sql = `SELECT ${companyIdColumn} FROM ${companiesTableName} WHERE business_license_num =?`;
                    arg = [businessLicenseNum];
                    companyInfo = await conn.query(sql, arg);
                    console.log('!!!!!!!!!!!!!!!!!!!2', companyInfo);
                    companyId = companyInfo[0][0][companyIdColumn];
                    belongingType = 2;
                    isManager = 1; // 처음 등록된 기업이므로 관리자 처리

                    // 생성한 기업과 사용자 연결
                    sql = `INSERT INTO ${relationTableName} (${companyIdColumn}, ${userIdColumn}, belonging_type, manager_type) VALUES (?, ?, ?, ?)`;
                    arg = [companyId, email, belongingType, isManager];
                    let connectUserAndCompany = await conn.query(sql, arg);
                    console.log('!!!!!!!!!!!!!!!!!!!3', connectUserAndCompany);
                    successMessage = 'success! 최초 등록 기업!!';

                    //등록된 기업 있음
                } else {
                    //기업id 가져오기
                    sql = `SELECT ${companyIdColumn} FROM ${companiesTableName} WHERE business_license_num =?`;
                    arg = [businessLicenseNum];
                    const regiCompanyInfo = await conn.query(sql, arg);
                    console.log('!!!!!!!!!!!!!!!!!!!5', regiCompanyInfo);
                    companyId = regiCompanyInfo[0][0][companyIdColumn];

                    // 등록된 사업자 & 관리자인 사용자 유무 확인 ? 있으면 관리자 처리 : 없다면 요청상태로 처리
                    sql = `SELECT EXISTS (SELECT * FROM ${relationTableName} WHERE ${companyIdColumn} = ? AND belonging_type = 2 AND manager_type = 1) AS managerExist`;
                    arg = [companyId];
                    let managerExistInCompany = await conn.query(sql, arg);
                    let managerExist =
                        managerExistInCompany[0][0]['managerExist'];

                    // 관리자 유무에 따라 가입자 소속/관리자 상태 달리 등록
                    if (!managerExist) {
                        belongingType = 2; // 관리자가 없으므로 자동 소속 등록
                        isManager = 1; // 관리자가 없으므로 관리자로 등록
                        // 아랫 줄 테스트용 : 삭제
                        successMessage =
                            'success! 이미 등록된 기업!! > 관리자 없음';
                    } else {
                        userEntity.userType = 1; // 관리자가 있으므로 가입자 사용자 타입을 2 > 1로 변경
                        belongingType = 1; // 관리자가 없으므로 소속 요청 중으로 처리
                        isManager = 0; // 관리자가 있으므로 관리자 아님
                        // 아랫 줄 테스트용 : 삭제
                        successMessage =
                            'success! 이미 등록된 기업!! > 관리자 있음';
                    }

                    // 등록된 기업과 사용자 연결
                    sql = `INSERT INTO ${relationTableName} (${companyIdColumn}, ${userIdColumn}, belonging_type, manager_type) VALUES (?, ?, ?, ?)`;
                    arg = [companyId, email, belongingType, isManager];
                    let connectUserAndCompany = await conn.query(sql, arg);
                    console.log('!!!!!!!!!!!!!!!!!!!6', connectUserAndCompany);
                }
            }
            result = await authService.signUp(userEntity);
            if (!successMessage) {
                successMessage = 'success! 개인 컨설턴트!!';
            }
            console.log('****************', successMessage);
            await conn.commit();
            conn.release();
            return result;
        } catch (error) {
            await conn.rollback();
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }

    //사용자-기업 관계 데이터 생성
    async createUserAndCompanyRelation({ userType, email, companyId }) {
        let result, sql, arg;
        let tableName, userIdColumn, companyIdColumn, belongingType;

        try {
            const conn = await pool.getConnection();
            if (userType === 3) {
                tableName = 'client_user_and_company';
                userIdColumn = 'client_user_id';
                companyIdColumn = 'client_company_id';
                belongingType = 2; // 클라이언트 사용자는 바로 소속처리 : 상황변경에 따라 기본값 변경
            } else {
                // userType === 2 || userType === 1
                tableName = 'consultant_user_and_company';
                userIdColumn = 'consultant_user_id';
                companyIdColumn = 'consulting_company_id';
                belongingType = 1; // 컨설턴트 사용자는 소속요청 중 처리
            }
            let checkBelongingCompany = await this.getRelationInfo({
                email,
                userType,
            });
            if (checkBelongingCompany === undefined) {
                // 기업에 처음 소속요청을 하는 경우
                sql = `INSERT INTO ${tableName} (${userIdColumn}, ${companyIdColumn}, belonging_type) VALUES (?, ?, ?);`;
                arg = [email, companyId, belongingType];
                result = await conn.query(sql, arg);
                return result[0][0];
            } else if (
                checkBelongingCompany[companyIdColumn] === Number(companyId)
            ) {
                // 현재 기업에 소속된 적 있었던 사용자의 경우
                let updateData = {
                    userType: userType,
                    companyId: companyId,
                    email: email,
                    belongingType: belongingType,
                };
                result = await this.updateUserBelongingStatus(updateData);
                return result[0][0];
            } else {
                // if ( checkBelongingCompany[companyIdColumn] !==Number(companyId) // 이미 타기업에 소속된 사용자의 경우)
                throw new Error(
                    '타 기업에 소속된 사용자는 중복 소속요청을 할 수 없습니다.'
                );
            }
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // GET
    // 사용자 가져오기 : 클라이언트 / 컨설턴트 공통
    async getUserInfo({ email, userType }) {
        console.log('---------------------------------사용자정보 : ', {
            email,
            userType,
        });
        let result, sql, arg;
        let tableName, idColumn;
        try {
            const conn = await pool.getConnection();
            // 사용자 정보 가져오기
            if (userType === 3) {
                tableName = 'client_users';
                idColumn = 'client_user_id';
            } else {
                // userType === 2 || userType === 1
                tableName = 'consultant_users';
                idColumn = 'consultant_user_id';
            }
            sql = `SELECT * FROM ${tableName} WHERE ${idColumn}=?`;
            arg = [email];
            result = await conn.query(sql, arg);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(error.message, error.code, error.stack);
        }
    }
    // 사용자 소속 기업정보 가져오기
    async getUserBelongingCompanyInfo({ email, userType }) {
        let result;
        let idColumn;
        try {
            if (userType === 3) {
                idColumn = 'client_company_id';
            } else {
                // userType === 2
                idColumn = 'consulting_company_id';
            }
            let companyInfo = await this.getRelationInfo({ email, userType });
            let companyId = companyInfo[`${idColumn}`];
            console.log('사용자 소속기업정보 가져오기 result', companyId);

            result = await this.getCompanyInfo({ userType, companyId });
            console.log('$$$$$$$$$$$$$$$$$$ : ', result);
            return result;
        } catch (error) {
            console.log('사용자 소속 기업정보 가져오기 err: ', error);
            throw error;
        }
    }
    // 사용자-기업 연결정보 가져오기
    async getRelationInfo({ email, userType }) {
        let result, sql, arg;
        let tableName, userIdColumn;
        console.log('요청 > DB > Query >  getRelationInfo : ', email, userType);
        const conn = await pool.getConnection();
        try {
            if (userType === 3) {
                tableName = 'client_user_and_company';
                userIdColumn = 'client_user_id';
            } else {
                // userType === 2
                tableName = 'consultant_user_and_company';
                userIdColumn = 'consultant_user_id';
            }

            sql = `SELECT * FROM ${tableName} WHERE ${userIdColumn} = ?`;
            arg = [email];
            result = await conn.query(sql, arg);
            console.log(result);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // UPDATE
    // 사용자 정보 변경 - 공통 : 연락처
    async updatePhoneNum({ email, userType, phoneNum }) {
        let result;
        let sql, arg, tableName, idColumn;
        try {
            const conn = await pool.getConnection();
            if (userType === 3) {
                tableName = 'client_users';
                idColumn = 'client_user_id';
            } else {
                //userType === 1 || userType === 2
                tableName = 'consultant_users';
                idColumn = 'consultant_user_id';
            }
            // 휴대폰 번호 업데이트
            sql = `UPDATE ${tableName} SET phone_num = ? WHERE ${idColumn} = ?`;
            arg = [phoneNum, email];
            await conn.query(sql, arg);
            // 업데이트한 휴대폰 번호 가져오기
            sql = `SELECT phone_num FROM ${tableName} WHERE ${idColumn} = ?`;
            arg = [email];
            result = await conn.query(sql, arg);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
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
        try {
            if (userType === 1) {
                result = await this.updateUserBankInfo({
                    email,
                    bankName,
                    bankAccountNum,
                    bankAccountOwner,
                });
            } else {
                // userType === 2
                result = await this.updateCompanyBankInfo({
                    email,
                    bankName,
                    bankAccountNum,
                    bankAccountOwner,
                });
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자 정보 변경 - 개인컨설턴트 입금정보
    async updateUserBankInfo({
        email,
        bankName,
        bankAccountNum,
        bankAccountOwner,
    }) {
        let result, sql, arg;
        console.log('요청 > DB > Query : updateUserBankInfo!! : Parameter', {
            email,
            bankName,
            bankAccountNum,
            bankAccountOwner,
        });
        try {
            const conn = await pool.getConnection();
            // 사용자 입금정보 업데이트
            sql = `UPDATE consultant_users SET bank_name = ?, bank_account_num = ?, bank_account_owner = ? WHERE consultant_user_id = ?`;
            arg = [bankName, bankAccountNum, bankAccountOwner, email];
            await conn.query(sql, arg);
            //사용자 입금정보 가져오기
            sql = `SELECT bank_name, bank_account_num, bank_account_owner FROM consultant_users WHERE consultant_user_id = ?`;
            arg = [email];
            result = await conn.query(sql, arg);
            console.log('응답 > DB > updateUserBankInfo > 결과 : ', result);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 사용자 정보 변경 - 컨설팅 업체 입금정보
    async updateCompanyBankInfo({
        email,
        bankName,
        bankAccountNum,
        bankAccountOwner,
    }) {
        let result, sql, arg;

        console.log('요청 > DB > Query : updateCompanyBankInfo!! : Parameter', {
            email,
            bankName,
            bankAccountNum,
            bankAccountOwner,
        });
        try {
            const conn = await pool.getConnection();
            // 컨설팅 기업 아이디 가져오기
            sql = `SELECT consulting_company_id FROM consultant_user_and_company where consultant_user_id = ?`;
            arg = [email];
            let consultingCompanyInfo = await conn.query(sql, arg);
            let consultingCompanyId =
                consultingCompanyInfo[0][0]['consulting_company_id'];
            //컨설팅 기업 입금정보 업데이트
            sql = `UPDATE consulting_companies SET bank_name = ?, bank_account_num =?, bank_account_owner = ? WHERE consulting_company_id = ?`;
            arg = [
                bankName,
                bankAccountNum,
                bankAccountOwner,
                consultingCompanyId,
            ];
            await conn.query(sql, arg);
            // 컨설팅 기업 업데이트 된 입금정보 가져오기
            sql = `SELECT bank_name, bank_account_num, bank_account_owner FROM consulting_companies WHERE consulting_company_id = ?`;
            arg = [consultingCompanyId];
            result = await conn.query(sql, arg);
            console.log('응답 > DB > updateCompanyBankInfo > 결과 : ', result);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 사용자 - 소속 상태변경(취소, 해제)처리
    async updateUserBelongingStatus({
        userType,
        companyId,
        email,
        belongingType,
    }) {
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            '요청 > DB > Query >  updateBelongingStatus : ',
            email,
            userType,
            companyId
        );
        try {
            const conn = await pool.getConnection();
            // 추가 사용자 있을 시 사용자 타입확인 필요 - ex) 클라이언트 사용자(userType: 4) 구분 시(현재 구분않음)
            // if (userType === 1) {
            //     tableName = 'consultant_user_and_company';
            //     userIdColumn = 'consultant_user_id';
            //     companyIdColumn = 'consulting_company_id';
            // } else if (userType === 4) {
            //     tableName = 'client_user_and_company';
            //     userIdColumn = 'client_user_id';
            //     companyIdColumn = 'client_company_id';
            // } else {
            //     return new Exception('사용자 타입오류');
            // }

            // 사용자-기업 연결 상태 업데이트
            sql = `UPDATE consultant_user_and_company SET belonging_type = ? WHERE consulting_company_id = ? AND consultant_user_id = ?;`;
            arg = [belongingType, companyId, email];
            await conn.query(sql, arg);
            // 사용자-기업 연결 정보 가져오기
            sql = `SELECT consultant_user_id ,belonging_type FROM consultant_user_and_company WHERE consulting_company_id = ? AND consultant_user_id = ?`;
            arg = [companyId, email];
            let result = await conn.query(sql, arg);
            // console.log('11111 : ', result);
            if (result[0][0].length === 0) {
                throw new Error('소속 기업이 없는 사용자 입니다.');
            }
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    //DELETE
    //회원 탈퇴 - 나중에 (처리하기 테스트 필요)
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
        // flow 다시확인 필요
        let result, sql, arg;
        let tableName,
            idColumn,
            companyIdColumn,
            userIdColumn,
            companyId,
            isManager;
        try {
            const conn = await pool.getConnection();
            await conn.beginTransaction();
            // 탈퇴 정보 생성
            sql = `INSERT INTO withdrawal_info (user_type, withdrawal_type) VALUES (?, ?)`;
            arg = [userType, withdrawalType];
            await conn.query(sql, arg);

            if (userType === 2 || userType === 3) {
                if (userType === 3) {
                    tableName = 'client_user_and_company';
                    userIdColumn = 'client_user_id';
                    companyIdColumn = 'client_company_id';
                } else {
                    // userType === 2
                    tableName = 'consultant_user_and_company';
                    userIdColumn = 'consultant_user_id';
                    companyIdColumn = 'consulting_company_id';
                }
                // 사용자-기업 연결정보 가져오기
                sql = `SELECT ${companyIdColumn}, belonging_type FROM ${tableName} WHERE ${userIdColumn} = ?`;
                arg = [email];
                await conn.query(sql, arg);
                // 사용자-기업 연결정보 수정
                // 사용자-정보 삭제
                // cognito 사용자 정보 삭제
            }
            await connection.commit(function (error) {
                if (error)
                    throw new DatabaseError(
                        error.code,
                        error.errno,
                        error.message,
                        error.stack,
                        error.sql
                    );
            });
            console.log('success! 회원탈퇴처리완료!!');
        } catch (error) {
            console.log('fail!');
            return connection.rollback(function () {
                throw new DatabaseError(
                    error.code,
                    error.errno,
                    error.message,
                    error.stack,
                    error.sql
                );
            });
        } finally {
            connection.release();
            return result;
        }
    }
    // DELETE
    //사용자-기업 관계 데이터 삭제 - 테스트 필요
    // ** 추후 확인 사항 : 사용자 프로젝트 진행 시 삭제 불가!! 프로젝트 서비스 작성 시 고려해 코드추가!!!!!!!!
    async deleteUserAndCompanyRelation({ userType, email, companyId }) {
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
        try {
            const conn = pool.getConnection();
            if (userType === 3) {
                tableName = 'client_user_and_company';
                userIdColumn = 'client_user_id';
                companyIdColumn = 'client_company_id';
            } else {
                //  userType === 1 || userType === 2
                tableName = 'consultant_user_and_company';
                userIdColumn = 'consultant_user_id';
                companyIdColumn = 'consulting_company_id';
            }
            sql = `DELETE FROM ${tableName} WHERE ${userIdColumn} = ? AND ${companyIdColumn} = ?`;
            arg = [email, companyId];
            result = await conn.query(sql, arg);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 기업--------------------------------------------------------------------
    // CREATE

    // GET
    // 기업 리스트 가져오기 : 기업(클/컨) 공통
    async getCompanyList({ userType }) {
        let result, sql;
        let tableName, idColumn;
        try {
            const conn = await pool.getConnection();
            if (userType === 3) {
                tableName = 'client_companies';
                idColumn = 'client_company_id';
            } else {
                //userType === 1 || userType === 2
                tableName = 'consulting_companies';
                idColumn = 'consulting_company_id';
            }
            sql = `SELECT ${idColumn}, company_name, president_name from ${tableName} WHERE approval_state IN (2, 3);`;
            result = await conn.query(sql);
            console.log('요청 > DB > getCompanyList 결과: ', result);
            return result[0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 기업 정보 가져오기
    async getCompanyInfo({ userType, companyId }) {
        let result, sql, arg;
        let tableName, idColumn;
        console.log(
            ' 요청 > DB > getCompanyInfo > 기업 정보 가져오기 -------------------!! : ',
            { userType, companyId }
        );
        try {
            const conn = await pool.getConnection();
            if (userType === 3) {
                tableName = 'client_companies';
                idColumn = 'client_company_id';
            } else {
                //userType === 1 || userType === 2
                tableName = 'consulting_companies';
                idColumn = 'consulting_company_id';
            }
            sql = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;
            arg = [companyId];
            result = await conn.query(sql, arg);
            console.log('응답 > DB > getCompanyInfo : ', result);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 기업 소속 사용자들 정보 가져오기 : 기업 (클라이언트/컨설턴트) 공통
    async getCompanyBelongedUsersInfo({ userType, companyId }) {
        console.log('--------------------', userType, companyId);
        let result = [];
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn, userTypeForGetInfo;
        try {
            const conn = await pool.getConnection();
            if (userType === 2) {
                tableName = 'consultant_user_and_company';
                companyIdColumn = 'consulting_company_id';
                userIdColumn = 'consultant_user_id';
                userTypeForGetInfo = 1; // 소속 사용자 타입
            } else {
                //userType === 3
                tableName = 'client_user_and_company';
                companyIdColumn = 'client_company_id';
                userIdColumn = 'client_user_id';
                userTypeForGetInfo = 3; // 소속 사용자 타입
            }
            sql = `SELECT ${userIdColumn} FROM ${tableName} WHERE ${companyIdColumn} = ? AND belonging_type= 2`;
            arg = [companyId];
            const belongingInfo = await conn.query(sql, arg);
            const belongingUsers = belongingInfo[0];
            const belongingUsersId = belongingUsers.map(
                (user) => user[userIdColumn]
            );
            for (let i = 0; i < belongingUsersId.length; i++) {
                let userData = {
                    email: belongingUsersId[i],
                    userType: userTypeForGetInfo,
                };
                let userInfo = await this.getUserInfo(userData);
                result.push(userInfo);
            }
            return result;
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // UPDATE
    // 기업 - 사용자 소속요청 승인, 거부/ 소속사용자 삭제 처리
    async updateRegistrationStatus({
        userType,
        companyId,
        email,
        belongingType,
    }) {
        let result, sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            '요청 > DB > Query >  updateBelongingStatus : ',
            email,
            userType,
            companyId
        );
        try {
            const conn = await pool.getConnection();
            if (userType === 3) {
                tableName = 'client_user_and_company';
                userIdColumn = 'client_user_id';
                companyIdColumn = 'client_company_id';
            } else {
                // userType === 2
                tableName = 'consultant_user_and_company';
                userIdColumn = 'consultant_user_id';
                companyIdColumn = 'consulting_company_id';
            }
            // 사용자 상태 업데이트
            sql = `UPDATE ${tableName} SET belonging_type = ? WHERE ${companyIdColumn} = ? AND ${userIdColumn}= ?;`;
            arg = [belongingType, companyId, email];
            await conn.query(sql, arg);
            // 사용자 정보 가져오기
            sql = `SELECT ${userIdColumn},belonging_type FROM ${tableName} WHERE ${companyIdColumn} = ? AND ${userIdColumn}= ?`;
            arg = [companyId, email];
            result = await conn.query(sql, arg);
            // if (result[0].length === 0) {
            //     throw new Error('소속 기업이 없는 사용자 입니다.');
            // } // usecase에서 예외처리
            console.log('응답 > DB > updateRegistrationStatus : ', result);
            return result[0][0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // DELETE

    // 프로필 -------------------------------------------------------------------------------------
    // CREATE
    // 개인 컨설턴트 프로필 정보 생성 - 휴대폰 입력 추가
    async createConsultantProfile(
        {
            email,
            phoneNum,
            introduce,
            abilityCertifications, // 수행가능 인증들 데이터 - 여러개이므로 배열형태로 받기
            // certificationId,
            // certificationName,
            abilityTasks, // 수행가능 세부과제들 데이터 - 여러개이므로 배열형태로 받기
            // taskId,
            // taskName,
            // taskGroupType
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
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // 인증된 휴대폰 번호 사용자 정보 업데이트
            sql = `UPDATE consultant_users SET phone_num=? WHERE consultant_user_id = ?`;
            arg = [phoneNum, email];
            await conn.query(sql, arg);
            // 프로필 정보 생성 (자기소개)
            sql = `UPDATE consultant_users SET profile_state = ?, user_introduce=? WHERE consultant_user_id = ?`;
            arg = [1, introduce, email];
            await conn.query(sql, arg);

            // 수행가능인증 - 여러개 : 아이디/인증명 가져오기
            sql = `INSERT INTO profile_ability_certifications (consultant_user_id, certification_id, certification_name) VALUES (?, ?, ?)`;

            for (let i = 0; i < abilityCertifications.length; i++) {
                arg = [
                    email,
                    abilityCertifications[i].certificationId,
                    abilityCertifications[i].certificationName,
                ];
                await conn.query(sql, arg);
            }
            // 수행가능업종 - 여러개 : 추후 정책 확인 후 완료
            sql = `INSERT INTO profile_ability_industries (consultant_user_id, industry_id, industry_name) VALUES (?, ?, ?)`;
            for (let i = 0; i < abilityIndustries.length; i++) {
                arg = [
                    email,
                    abilityIndustries[i].industryId,
                    abilityIndustries[i].industryName,
                ];
                await conn.query(sql, arg);
            }
            // 수행가능 세부과제 - 여러개 : 세부과제 id/과제명/분류id/분류명
            sql = `INSERT INTO profile_ability_tasks (consultant_user_id, task_id, task_name, task_group_type) VALUES (?, ?, ?, ?)`;
            for (let i = 0; i < abilityTasks.length; i++) {
                arg = [
                    email,
                    abilityTasks[i].taskId,
                    abilityTasks[i].taskName,
                    abilityTasks[i].taskGroupType,
                ];
                await conn.query(sql, arg);
            }
            // 학력 - 최종학력 1개 academicCertificationFilePath - 지정
            sql = `INSERT INTO profile_academic_background (consultant_user_id, final_academic_type, school_name, major_name, graduation_classification_type, admission_date, graduate_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            arg = [
                email,
                academicBackground.finalAcademicType,
                academicBackground.schoolName,
                academicBackground.majorName,
                academicBackground.graduationClassificationType,
                academicBackground.admissionDate,
                academicBackground.graduateDate,
            ];
            await conn.query(sql, arg);
            //경력 : 여러개 careerCertificationFilePath - 지정!!
            sql = `INSERT INTO profile_career (consultant_user_id, company_name, position, assigned_work, joining_date, resignation_date) VALUES (?, ?, ?, ?, ?, ?)`;
            for (let i = 0; i < career.length; i++) {
                arg = [
                    email,
                    career[i].companyName,
                    career[i].position,
                    career[i].assignedWork,
                    career[i].joiningDate,
                    career[i].resignationDate,
                ];
                await conn.query(sql, arg);
            }
            //자격증 : 여러개 licenseFilePath- 지정!!
            sql = `INSERT INTO profile_license (consultant_user_id, license_name, license_num, issue_institution, issued_date) VALUES (?, ?, ?, ?, ?)`;
            for (let i = 0; i < license.length; i++) {
                arg = [
                    email,
                    license[i].licenseName,
                    license[i].licenseNum,
                    license[i].issueInstitution,
                    license[i].issuedDate,
                ];
                await conn.query(sql, arg);
            }
            // 수행이력 : 여러개
            sql = `INSERT INTO profile_project_history (consultant_user_id, project_name, assigned_task, industry_category_id, industry_category_name, project_start_date, project_end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            for (let i = 0; i < projectHistory.length; i++) {
                arg = [
                    email,
                    projectHistory[i].projectName,
                    projectHistory[i].assignedTask,
                    projectHistory[i].industryCategoryId,
                    projectHistory[i].industryCategoryName,
                    projectHistory[i].projectStartDate,
                    projectHistory[i].projectEndDate,
                ];
                await conn.query(sql, arg);
            }
            // 기타 : 기타 수행가능 업종/인증 (input 작성) - 추후 정책 처리 된 후 수정
            sql = `INSERT INTO profile_ability_etc (consultant_user_id, etc_certifications, etc_industries) VALUES (?, ?, ?)`;
            arg = [email, etc.etcCertifications, etc.etcIndustries];
            await conn.query(sql, arg);
            // 업로드 파일들 처리
            sql = `INSERT INTO profile_upload_files (consultant_user_id, file_category_type, file_name, file_path) VALUES (?, ?, ?, ?)`;
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
                    email,
                    fileCategoryType,
                    uploadData[i].originalname,
                    uploadData[i].location,
                ];
                await conn.query(sql, arg);
            }
            // 프로필 임시저장 데이터 있는지 여부 확인
            sql = `SELECT * FROM consultant_profile_temp WHERE consultant_user_id= ?`;
            arg = [email];
            let profileTempResults = await conn.query(sql, arg);
            //임시저장 데이터 삭제
            if (profileTempResults[0].length !== 0) {
                let profileTempId =
                    profileTempResults[0][0]['consultant_profile_temp_id'];
                sql = `DELETE FROM consultant_profile_temp WHERE consultant_profile_temp_id =? `;
                arg = [profileTempId];
                await conn.query(sql, arg);
            }
            await conn.commit();
            console.log('개인 컨설턴트 프로필 등록 성공!!');
            conn.release();
        } catch (error) {
            console.log('fail!', error);
            await conn.rollback();
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 개인 컨설턴트 프로필 임시저장 정보 생성
    async createConsultantProfileTemp(
        {
            email,
            phoneNum,
            introduce,
            abilityCertifications, // 수행가능 인증들 데이터 - 여러개이므로 배열형태로 받기
            // certificationId,
            // certificationName,
            abilityTasks, // 수행가능 세부과제들 데이터 - 여러개이므로 배열형태로 받기
            // taskId,
            // taskName,
            // taskGroupType
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
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 임시저장 정보 생성 (자기소개)
            sql = `INSERT INTO consultant_profile_temp (consultant_user_id, phone_num, consultant_introduce) VALUES (?, ?, ?)`;
            arg = [email, phoneNum, introduce];
            await conn.query(sql, arg);
            // 임시저장 id 정보 가져오기
            sql = `SELECT * FROM consultant_profile_temp WHERE consultant_user_id=?`;
            arg = [email];
            let profileTempInfo = await conn.query(sql, arg);
            let consultantProfileTempId =
                profileTempInfo[0][0]['consultant_profile_temp_id'];
            console.log('~~~~~~~~~~', consultantProfileTempId);
            // 수행가능인증 - 여러개 : 아이디/인증명 가져오기
            sql = `INSERT INTO temp_profile_ability_certifications (consultant_profile_temp_id, certification_id, certification_name) VALUES (?, ?, ?)`;

            for (let i = 0; i < abilityCertifications.length; i++) {
                arg = [
                    consultantProfileTempId,
                    abilityCertifications[i].certificationId,
                    abilityCertifications[i].certificationName,
                ];
                await conn.query(sql, arg);
            }
            // 수행가능업종 - 여러개 : 추후 정책 확인 후 완료
            sql = `INSERT INTO temp_profile_ability_industries (consultant_profile_temp_id, industry_id, industry_name) VALUES (?, ?, ?)`;
            for (let i = 0; i < abilityIndustries.length; i++) {
                arg = [
                    consultantProfileTempId,
                    abilityIndustries[i].industryId,
                    abilityIndustries[i].industryName,
                ];
                await conn.query(sql, arg);
            }
            // 수행가능 세부과제 - 여러개 : 세부과제 id/과제명/분류id/분류명
            sql = `INSERT INTO temp_profile_ability_tasks (consultant_profile_temp_id, task_id, task_name, task_group_type) VALUES (?, ?, ?, ?)`;
            for (let i = 0; i < abilityTasks.length; i++) {
                arg = [
                    consultantProfileTempId,
                    abilityTasks[i].taskId,
                    abilityTasks[i].taskName,
                    abilityTasks[i].taskGroupType,
                ];
                await conn.query(sql, arg);
            }
            // 학력 - 최종학력 1개 academicCertificationFilePath - 지정
            sql = `INSERT INTO temp_profile_academic_background (consultant_profile_temp_id, final_academic_type, school_name, major_name, graduation_classification_type, admission_date, graduate_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            arg = [
                consultantProfileTempId,
                academicBackground.finalAcademicType,
                academicBackground.schoolName,
                academicBackground.majorName,
                academicBackground.graduationClassificationType,
                academicBackground.admissionDate,
                academicBackground.graduateDate,
            ];
            await conn.query(sql, arg);
            //경력 : 여러개 careerCertificationFilePath - 지정!!
            sql = `INSERT INTO temp_profile_career (consultant_profile_temp_id, company_name, position, assigned_work, joining_date, resignation_date) VALUES (?, ?, ?, ?, ?, ?)`;
            for (let i = 0; i < career.length; i++) {
                arg = [
                    consultantProfileTempId,
                    career[i].companyName,
                    career[i].position,
                    career[i].assignedWork,
                    career[i].joiningDate,
                    career[i].resignationDate,
                ];
                await conn.query(sql, arg);
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
                await conn.query(sql, arg);
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
                await conn.query(sql, arg);
            }
            // 기타 : 기타 수행가능 업종/인증 (input 작성) - 추후 정책 처리 된 후 수정
            sql = `INSERT INTO temp_profile_ability_etc (consultant_profile_temp_id, etc_certifications, etc_industries) VALUES (?, ?, ?)`;
            arg = [
                consultantProfileTempId,
                etc.etcCertifications,
                etc.etcIndustries,
            ];
            await conn.query(sql, arg);
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
                await conn.query(sql, arg);
            }
            await conn.commit();
            console.log('임시저장 데이터 생성 성공!!');
            conn.release();
        } catch (error) {
            console.log('fail!', error);
            await conn.rollback();
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }

    // 컨설팅 기업 프로필 정보 생성
    async createConsultingCompanyProfile(
        { email, userType, phoneNum, introduce, projectHistory },
        uploadData
    ) {
        let result, sql, arg;
        let self = this;
        console.log(
            '요청 > DB > Query >  createConsultingCompanyProfile  : parameter',
            { email, userType, introduce, projectHistory },
            uploadData
        );
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // 인증된 휴대폰 번호 & 승인요청상태 사용자 정보 업데이트
            sql = `UPDATE consultant_users SET phone_num=? approval_state = ? WHERE consultant_user_id = ?`;
            arg = [phoneNum, 1, email];
            await conn.query(sql, arg);

            // 소속 기업 정보(id) 가져오기
            let companyInfoResults = await self.getUserBelongingCompanyInfo({
                email,
                userType,
            });
            let companyId = companyInfoResults['consulting_company_id'];
            // 기업 데이터 저장
            sql = `UPDATE consulting_companies SET company_introduce = ?, business_license_file = ?, business_license_file_path = ? WHERE consulting_company_id = ?`;
            arg = [
                introduce,
                uploadData[0]['originalname'],
                uploadData[0]['location'],
                companyId,
            ];
            await conn.query(sql, arg);

            // 기업 프로필 수행이력 정보 저장
            sql = `INSERT INTO profile_consulting_company_project_history (consulting_company_id, project_name, assigned_task, industry_category_id, industry_category_name, project_start_date, project_end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            for (let i = 0; i < projectHistory.length; i++) {
                console.log('-------------------------', projectHistory[i]);
                arg = [
                    companyId,
                    projectHistory[i].projectName,
                    projectHistory[i].assignedTask,
                    projectHistory[i].industryCategoryId,
                    projectHistory[i].industryCategoryName,
                    projectHistory[i].projectStartDate,
                    projectHistory[i].projectEndDate,
                ];
                await conn.query(sql, arg);
            }

            // 기업 프로필 임시저장 데이터 있는지 여부 확인
            sql = `SELECT * FROM consulting_company_profile_temp WHERE consulting_company_id= ?`;
            arg = [companyId];
            let companyProfileTempResults = await conn.query(sql, arg);
            // 임시저장 데이터 삭제
            if (companyProfileTempResults[0].length !== 0) {
                let companyProfileTempId =
                    companyProfileTempResults[0][0][
                        'consulting_company_profile_temp_id'
                    ];
                sql = `DELETE FROM consulting_company_profile_temp WHERE consulting_company_profile_temp_id =? `;
                arg = [companyProfileTempId];
                await conn.query(sql, arg);
            }
            console.log('기업 프로필 저장 성공!!');
            await conn.commit();
            await conn.release();
        } catch (error) {
            console.log('fail!!');
            await conn.rollback();
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }

    // 컨설팅 기업 임시저장 정보 생성
    async createConsultingCompanyProfileTemp(
        { email, userType, introduce, projectHistory },
        uploadData
    ) {
        let result, sql, arg;
        let self = this;
        console.log(
            '요청 > DB > Query >  createConsultingCompanyProfileTemp  : parameter',
            { email, userType, introduce, projectHistory },
            uploadData
        );
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // 소속 기업 정보(id) 가져오기
            let companyInfoResults = await self.getUserBelongingCompanyInfo({
                email,
                userType,
            });
            let companyId = companyInfoResults['consulting_company_id'];
            // 기업 프로필 임시저장 데이터 저장
            sql = `INSERT INTO consulting_company_profile_temp (consulting_company_id, company_introduce, business_license_file, business_license_file_path) VALUES (?, ?, ?, ?)`;
            arg = [
                companyId,
                introduce,
                uploadData[0]['originalname'],
                uploadData[0]['location'],
            ];
            await conn.query(sql, arg);
            // 기업 프로필 임시저장 아이디 가져오기
            sql = `SELECT consulting_company_profile_temp_id FROM consulting_company_profile_temp WHERE consulting_company_id=?`;
            arg = companyId;
            let profileTempInfo = await conn.query(sql, arg);
            let profileTempId =
                profileTempInfo[0][0]['consulting_company_profile_temp_id'];
            console.log('프로필 임시 아이디', profileTempId);
            // 기업 수행이력 임시저장 데이터 저장
            sql = `INSERT INTO temp_consulting_company_profile_project_history (consulting_company_profile_temp_id, project_name, assigned_task, industry_category_id, industry_category_name, project_start_date, project_end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            for (let i = 0; i < projectHistory.length; i++) {
                console.log('-------------------------', projectHistory[i]);
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
                await conn.query(sql, arg);
            }
            console.log('기업 임시저장 성공!!');
            await conn.commit();
            await conn.release();
        } catch (error) {
            console.log('fail!!');
            await conn.rollback();
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 임시저장 데이터 존재유무 확인
    async checkProfileTempExist({ email, userType }) {
        let result, sql, arg, companyId;
        let tableName, idColumn;
        let self = this;

        let conn = await pool.getConnection();
        try {
            if (userType === 2) {
                let companyInfoResults = await self.getUserBelongingCompanyInfo(
                    { email, userType }
                );
                companyId = companyInfoResults['consulting_company_id'];
            }
            if (userType === 1) {
                tableName = 'consultant_profile_temp';
                idColumn = 'consultant_user_id';
                arg = [email];
            } else {
                // userType === 1
                tableName = 'consulting_company_profile_temp';
                idColumn = 'consulting_company_id';
                arg = [companyId];
            }
            sql = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;
            result = await conn.query(sql, arg);
            // console.log('#####################', result);
            return result[0];
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
    // 컨설턴트 임시저장 정보 가져오기
    async getConsultantProfileTemp({ email }) {
        let result, sql, arg;
        console.log(
            '요청 > DB > Query >  createConsultantProfileTemp  : parameter',
            email
        );
        const conn = await pool.getConnection();
        try {
            // 프로필 임시저장 기본 정보
            sql = `SELECT * FROM consultant_profile_temp WHERE consultant_user_id=?`;
            arg = [email];
            let tempResults = await conn.query(sql, arg);

            let consultantProfileTempInfo = {
                consultantProfileTempId:
                    tempResults[0][0]['consultant_profile_temp_id'],
                consultantIntroduce: tempResults[0][0]['consultant_introduce'],
            };
            let consultantProfileTempId =
                tempResults[0][0]['consultant_profile_temp_id'];
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 1',
                consultantProfileTempInfo,
                consultantProfileTempId
            );

            // 인증;
            sql = `SELECT * FROM temp_profile_ability_certifications WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let certificationTempResults = await conn.query(sql, arg);

            let abilityCertificationTemp = [];
            for (let i = 0; i < certificationTempResults[0].length; i++) {
                let abilityCertificationTempItems = {
                    certificationId:
                        certificationTempResults[0][i]['certification_id'],
                    certificationName:
                        certificationTempResults[0][i]['certification_name'],
                };
                abilityCertificationTemp.push(abilityCertificationTempItems);
            }
            consultantProfileTempInfo.abilityCertifications = abilityCertificationTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 2',
                consultantProfileTempInfo
                // results
            );

            // 세부과제
            sql = `SELECT * FROM temp_profile_ability_tasks WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let taskTempResults = await conn.query(sql, arg);

            let abilityTasksTemp = [];
            for (let i = 0; i < taskTempResults[0].length; i++) {
                let abilityTasksTempItems = {
                    taskId: taskTempResults[0][i]['task_id'],
                    taskName: taskTempResults[0][i]['task_name'],
                    taskGroupType: taskTempResults[0][i]['task_group_type'],
                };
                abilityTasksTemp.push(abilityTasksTempItems);
            }
            consultantProfileTempInfo.abilityTasks = abilityTasksTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 3',
                consultantProfileTempInfo
                // results
            );

            // 업종
            sql = `SELECT * FROM temp_profile_ability_industries WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let industryTempResults = await conn.query(sql, arg);

            let abilityIndustriesTemp = [];
            for (let i = 0; i < industryTempResults[0].length; i++) {
                let abilityIndustriesTempItems = {
                    industryId: industryTempResults[0][i]['industry_id'],
                    industryName: industryTempResults[0][i]['industry_name'],
                };
                abilityIndustriesTemp.push(abilityIndustriesTempItems);
            }
            consultantProfileTempInfo.abilityIndustries = abilityIndustriesTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 4',
                consultantProfileTempInfo
            );

            // 학력
            sql = `SELECT * FROM temp_profile_academic_background WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let academicTempResults = await conn.query(sql, arg);

            consultantProfileTempInfo.academicBackground = {
                finalAcademicType:
                    academicTempResults[0][0]['final_academic_type'],
                schoolName: academicTempResults[0][0]['school_name'],
                majorName: academicTempResults[0][0]['major_name'],
                graduationClassificationType:
                    academicTempResults[0][0]['graduation_classification_type'],
                admissionDate: academicTempResults[0][0]['admission_date'],
                graduateDate: academicTempResults[0][0]['graduate_date'],
            };
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 5',
                consultantProfileTempInfo
            );

            // 경력
            sql = `SELECT * FROM temp_profile_career WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let careerTempResults = await conn.query(sql, arg);

            let careerTemp = [];
            for (let i = 0; i < careerTempResults[0].length; i++) {
                let careerTempItem = {
                    companyName: careerTempResults[0][i]['company_name'],
                    position: careerTempResults[0][i]['position'],
                    assignedWork: careerTempResults[0][i]['assigned_work'],
                    joiningDate: careerTempResults[0][i]['joining_date'],
                    resignationDate:
                        careerTempResults[0][i]['resignation_date'],
                };
                careerTemp.push(careerTempItem);
            }
            consultantProfileTempInfo.career = careerTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 6',
                consultantProfileTempInfo
            );

            // 자격증
            sql = `SELECT * FROM temp_profile_license WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let licenseTempResults = await conn.query(sql, arg);

            let licenseTemp = [];
            for (let i = 0; i < licenseTempResults[0].length; i++) {
                let licenseTempItem = {
                    licenseName: licenseTempResults[0][i]['license_name'],
                    licenseNum: licenseTempResults[0][i]['license_num'],
                    issueInstitution:
                        licenseTempResults[0][i]['issue_institution'],
                    issuedDate: licenseTempResults[0][i]['issued_date'],
                };
                licenseTemp.push(licenseTempItem);
            }
            consultantProfileTempInfo.license = licenseTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 7',
                consultantProfileTempInfo
            );

            // 수행이력
            sql = `SELECT * FROM temp_profile_project_history WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let historyTempResults = await conn.query(sql, arg);

            let projectHistoryTemp = [];
            for (let i = 0; i < historyTempResults[0].length; i++) {
                let projectHistoryTempItem = {
                    projectName: historyTempResults[0][i]['project_name'],
                    assignedTask: historyTempResults[0][i]['assigned_task'],
                    industryCategoryId:
                        historyTempResults[0][i]['industry_category_id'],
                    industryCategoryName:
                        historyTempResults[0][i]['industry_category_name'],
                    projectStartDate:
                        historyTempResults[0][i]['project_start_date'],
                    projectEndDate:
                        historyTempResults[0][i]['project_end_date'],
                };
                projectHistoryTemp.push(projectHistoryTempItem);
            }
            consultantProfileTempInfo.projectHistory = projectHistoryTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 8',
                consultantProfileTempInfo
            );

            // 기타
            sql = `SELECT * FROM temp_profile_ability_etc WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let etcTempResults = await conn.query(sql, arg);

            let etcTemp = {
                etcCertifications: etcTempResults[0][0]['etc_certifications'],
                etcIndustries: etcTempResults[0][0]['etc_industries'],
            };
            consultantProfileTempInfo.etc = etcTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 9',
                consultantProfileTempInfo
            );

            // 업로드 파일
            sql = `SELECT * FROM temp_upload_files WHERE consultant_profile_temp_id = ?`;
            arg = [consultantProfileTempId];
            let uploadFilesTempResults = await conn.query(sql, arg);

            let uploadFilesTemp = {
                academic: [],
                career: [],
                license: [],
            };
            for (let i = 0; i < uploadFilesTempResults[0].length; i++) {
                let uploadFilesTempItem = {
                    fileCategoryType:
                        uploadFilesTempResults[0][i]['file_category_type'],
                    fileName: uploadFilesTempResults[0][i]['file_name'],
                    filePath: uploadFilesTempResults[0][i]['file_path'],
                };

                if (uploadFilesTempItem.fileCategoryType === 0) {
                    uploadFilesTemp.academic.push(uploadFilesTempItem);
                } else if (uploadFilesTempItem.fileCategoryType === 1) {
                    uploadFilesTemp.career.push(uploadFilesTempItem);
                } else if (uploadFilesTempItem.fileCategoryType === 2) {
                    uploadFilesTemp.license.push(uploadFilesTempItem);
                }
            }
            consultantProfileTempInfo.uploadFiles = uploadFilesTemp;
            console.log(
                'DB > Query > getConsultantProfileTemp > result1 : consultantProfileTempInfo 10',
                consultantProfileTempInfo
            );
            result = consultantProfileTempInfo;
            return result;
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }

    // 컨설팅 기업 임시저장 정보 가져오기
    async getConsultingCompanyProfileTemp({ email, userType }) {
        let result, sql, arg;
        let self = this;
        let conn = await pool.getConnection();
        try {
            // 기업 정보 가져오기
            let consultingCompanyInfo = await self.getUserBelongingCompanyInfo({
                email,
                userType,
            });
            let consultingCompanyId =
                consultingCompanyInfo['consulting_company_id'];
            let consultingCompanyProfileTempInfo = {
                consultingCompanyId: consultingCompanyId,
            };
            // 기업 임시저장 정보 가져오기
            sql = `SELECT * FROM consulting_company_profile_temp WHERE consulting_company_id = ?`;
            arg = [consultingCompanyId];
            let companyTempResults = await conn.query(sql, arg);
            consultingCompanyProfileTempInfo.companyIntroduce =
                companyTempResults[0][0]['company_introduce'];
            consultingCompanyProfileTempInfo.businessLicenseFile =
                companyTempResults[0][0]['business_license_file'];
            consultingCompanyProfileTempInfo.businessLicenseFilePath =
                companyTempResults[0][0]['business_license_file_path'];

            let consultingCompanyProfileTempId =
                companyTempResults[0][0]['consulting_company_profile_temp_id'];

            sql = `SELECT * FROM temp_consulting_company_profile_project_history WHERE consulting_company_profile_temp_id = ?`;
            arg = [consultingCompanyProfileTempId];
            let companyHistoryTempResults = await conn.query(sql, arg);
            let consultingCompanyProjectHistoryTemp = [];
            for (let i = 0; i < companyHistoryTempResults[0].length; i++) {
                let consultingCompanyProjectHistoryTempItem = {
                    projectName:
                        companyHistoryTempResults[0][i]['project_name'],
                    assignedTask:
                        companyHistoryTempResults[0][i]['assigned_task'],
                    industryCategoryId:
                        companyHistoryTempResults[0][i]['industry_category_id'],
                    industryCategoryName:
                        companyHistoryTempResults[0][i][
                            'industry_category_name'
                        ],
                    projectStartDate:
                        companyHistoryTempResults[0][i]['project_start_date'],
                    projectEndDate:
                        companyHistoryTempResults[0][i]['project_end_date'],
                };
                consultingCompanyProjectHistoryTemp.push(
                    consultingCompanyProjectHistoryTempItem
                );
            }
            consultingCompanyProfileTempInfo.projectHistoty = consultingCompanyProjectHistoryTemp;

            result = consultingCompanyProfileTempInfo;
            return result;
        } catch (error) {
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }

    // 프로필 임시저장 정보 삭제
    async deleteProfileTemp({ email, userType }) {
        let sql, arg;
        console.log('--------------', userType);
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
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
            } else {
                // userType === 2
                sql = `DELETE FROM a, b
                    USING consulting_company_profile_temp AS a LEFT JOIN temp_consulting_company_profile_project_history AS b
                    ON a.consulting_company_profile_temp_id = b.consulting_company_profile_temp_id
                    WHERE a.consulting_company_id = (SELECT consulting_company_id FROM consultant_user_and_company WHERE consultant_user_id = ?)`;
            }
            arg = [email];
            await conn.query(sql, arg);
            console.log('success!!');
            await conn.commit();
            await conn.release();
        } catch (error) {
            console.log('fail!!');
            await conn.rollback();
            throw new DatabaseError(
                error.code,
                error.errno,
                error.message,
                error.stack,
                error.sql
            );
        }
    }
};
