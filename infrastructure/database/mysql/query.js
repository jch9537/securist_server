const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

const { authService } = require('../../../adapters/outbound/auth'); // 같은 layer - 의존성에 문제 없는지 확인
const storageService = require('../../webService/storageService');
const { DatabaseError } = require('../../../adapters/error');

module.exports = class Mysql {
    constructor() {
        this.pool = mysql.createPool(dbConfig);
    }
    // // 기업 공통 처리 =============================
    // async checkExistCompany({ userType, businessLicenseNum }) {
    //     let sql, arg;
    //     let companiesTableName;
    //     const conn = await this.pool.getConnection();
    //     try {
    //         // 기업 테이블 변수명 지정
    //         if (userType === 3) {
    //             companiesTableName = 'client_companies';
    //         } else {
    //             // userType === 2
    //             companiesTableName = 'consulting_companies';
    //         }

    //         // // 등록 기업 사업자 유무
    //         // sql = `SELECT EXISTS (SELECT * FROM ${companiesTableName} WHERE businessLicenseNum = ?) AS isExist`;
    //         // arg = [businessLicenseNum];
    //         // let companyExist = await conn.query(sql, arg);
    //         // let isCompanyExist = companyExist[0][0].isExist;
    //         // return isCompanyExist;
    //     } catch (error) {
    //         console.error('DB에러 : ', error);
    //         await conn.rollback();
    //         throw new DatabaseError(error.message, error.errno);
    //     } finally {
    //         conn.release();
    //     }
    // }
    // 클라이언트 ==============================================================================
    // 개인 --------------------------------------------------------------------------------
    async createClientUser(
        authEntity,
        clientUserEntity,
        clientCompaniesEntity, // { businessLicenseNum, companyName, presidentName }
        clientUserAndCompanyEntity
    ) {
        console.log(
            ' =====',
            authEntity,
            clientUserEntity,
            clientCompaniesEntity,
            clientUserAndCompanyEntity
        );
        let sql, arg;
        let { clientUserId, name, userType, profileStatus } = clientUserEntity;
        let {
            businessLicenseNum,
            companyName,
            presidentName,
        } = clientCompaniesEntity;
        let { belongingStatus, managerType } = clientUserAndCompanyEntity;

        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            //사용자 정보 생성
            sql = `INSERT INTO client_users (clientUserId, name, userType, profileStatus) VALUES (?, ?, ?, ?)`;
            arg = [clientUserId, name, userType, profileStatus];
            await conn.query(sql, arg);

            // 기업 정보 생성
            let clientCompanyId;
            if (clientCompaniesEntity.clientCompanyId === undefined) {
                console.log('도착 : ', clientCompaniesEntity);
                sql = `INSERT INTO client_companies (businessLicenseNum, companyName, presidentName) VALUES (?, ?, ?)`;
                arg = [businessLicenseNum, companyName, presidentName];
                const companyCreateResult = await conn.query(sql, arg);

                clientCompanyId = companyCreateResult[0].insertId;
            } else {
                clientCompanyId = clientCompaniesEntity.clientCompanyId;
            }

            // 기업-사용자 연결 정보 생성
            sql = `INSERT INTO client_user_and_company (clientUserId, clientCompanyId, belongingStatus,managerType ) VALUES (?, ?, ?, ?)`;
            arg = [clientUserId, clientCompanyId, belongingStatus, managerType];
            await conn.query(sql, arg);

            // cognito 사용자 등록
            await authService.signUp(authEntity);

            await conn.commit();
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            if (error.location === 'AuthService') {
                throw error;
            } else {
                throw new DatabaseError(error.message, error.errno);
            }
        } finally {
            conn.release();
        }
    }
    // 클라이언트 사용자 리스트 가져오기
    async getClientUsers() {
        let sql;

        const conn = await this.pool.getConnection();
        try {
            //기업 정보 생성
            console.log('DB > Query : createClientCompany!!');

            sql = `SELECT * from client_users`;
            const clientUsersInfo = await conn.query(sql);

            await conn.commit();
            return clientUsersInfo[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 클라이언트 사용자 정보 가져오기
    async getClientUser({ clientUserId }) {
        let sql, arg;

        const conn = await this.pool.getConnection();
        try {
            //기업 정보 생성
            console.log('DB > Query : createClientCompany!!');

            sql = `SELECT * from client_users WHERE clientUserId = ?`;
            arg = [clientUserId];
            const clientUserInfo = await conn.query(sql, arg);

            await conn.commit();
            return clientUserInfo[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 클라이언트 사용자 정보 수정하기
    async updateClientUser({
        clientUserId,
        phoneNum,
        profileStatus,
        withdrawalDate,
    }) {
        console.log(
            '수정하기 데이터 : ',
            clientUserId,
            phoneNum,
            profileStatus,
            withdrawalDate
        );
        let sql, arg;
        let condition = '';

        const conn = await this.pool.getConnection();
        try {
            arg = [];
            //기업 정보 생성
            console.log('DB > Query : createClientCompany!!');

            if (phoneNum !== undefined) {
                if (arg.length === 0) {
                    condition += 'phoneNum = ?';
                } else {
                    condition += ', phoneNum = ?';
                }
                arg.push(phoneNum);
            }
            if (profileStatus !== undefined) {
                if (arg.length === 0) {
                    condition += 'profileStatus = ?';
                } else {
                    condition += ', profileStatus = ?';
                }
                arg.push(profileStatus);
            }
            if (withdrawalDate !== undefined) {
                if (arg.length === 0) {
                    condition += 'withdrawalDate = ?';
                } else {
                    condition += ', withdrawalDate = ?';
                }
                arg.push(withdrawalDate);
            }

            sql = `UPDATE client_users SET ${condition} WHERE clientUserId = ?`;

            arg.push(clientUserId);

            await conn.query(sql, arg);
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // 클라이언트 등급 정보 ----------------------------------------------------
    /**
     * @description 사용자 id들로 클라이언트 등급 정보들 가져오기
     * @param {number[]} clientUserIds - 클라이언트 사용자 id 배열
     * @returns {Promise} tempAbilityCertificationsResult[0] 임시저장 인증 정보 배열
     */
    async getClientGradeInfoListByUserIds(clientUserIds) {
        const conn = await this.pool.getConnection();
        try {
            let conditionString = '';
            const arg = [];
            for (let i = 0; i < clientUserIds.length; i++) {
                if (i === 0) {
                    conditionString += '?';
                } else {
                    conditionString += ', ?';
                }
                arg.push(clientUserIds[i]);
            }
            const sql = `SELECT * FROM client_grade_info WHERE clientUserId IN (${conditionString})`;
            const clientGradeInfoListResults = await conn.query(sql, arg);

            return clientGradeInfoListResults[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // 클라이언트 바우처 정보 --------------------------------------------
    /**
     * @description 바우처 정보 생성하기
     * @param {number} voucherAmount - 바우처 금액 (+/-)
     * @param {string} projectCode - 바우처 지급 프로젝트 금액
     * @param {string} description - 바우처 지금/사용 사유 설명
     * @param {string} clientUserId - 바우처의 사용자 id(이메일)
     */
    async createVoucher({
        voucherAmount,
        projectCode,
        descrption,
        expirationDate,
        clientUserId,
    }) {
        const conn = await this.pool.getConnection();
        try {
            const sql = `INSERT INTO vouchers (voucherAmount, projectCode, description, expirationDate, clientUserId) VALUES (?, ?, ?, ?, ?)`;
            const arg = [
                voucherAmount,
                projectCode,
                descrption,
                expirationDate,
                clientUserId,
            ];
            await conn.query(sql, arg);

            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    /**
     * @description 사용자 id로 클라이언트 사용자의 바우처 리스트 가져오기
     * @param {string} clientUserId - 클라이언트 사용자 id
     * @returns {Promise} voucherResult[0] - 바우처 정보 리스트 배열
     */
    async getVouchersByClient({ clientUserId }) {
        const conn = await this.pool.getConnection();
        try {
            const sql = `SELECT *, CONVERT_TZ(createdAt,'UTC','Asia/Seoul') AS createdAt, CONVERT_TZ(expirationDate,'UTC','Asia/Seoul') AS expirationDate FROM vouchers WHERE clientUserId = ?`;
            const arg = [clientUserId];
            const voucherResult = await conn.query(sql, arg);
            return voucherResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    /**
     * @description 클라이언트 사용자 id로 사용자의 바우처 합계금액 가져오기
     * @param {string} clientUserId - 클라이언트 사용자 id
     * @returns {Promise} voucherResult[0][0] - 바우처 합계금액(totalVoucherAmount)을 포함한 객체
     */
    async getVoucherTotalAmountByClientUser({ clientUserId }) {
        const conn = await this.pool.getConnection();
        try {
            const sql = `SELECT SUM(voucherAmount) AS totalVoucherAmount FROM vouchers WHERE clientUserId = ?`;
            const arg = [clientUserId];
            const voucherResult = await conn.query(sql, arg);
            console.log('바우처~~~~~~~', voucherResult[0]);
            return voucherResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // 클라이언트 기업 ---------------------------------------------------------------------
    async getClientCompanies() {
        let sql, arg;

        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            //기업 정보 생성
            console.log('DB > Query : createClientCompany!!');

            sql = `SELECT * from client_companies`;
            const clientCompaniesResults = await conn.query(sql);

            await conn.commit();
            return clientCompaniesResults[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    async getClientCompany({ clientCompanyId }) {
        let sql, arg;

        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            //기업 정보 생성
            console.log('DB > Query : createClientCompany!!');

            sql = `SELECT * from client_companies WHERE clientCompanyId = ?`;
            arg = [clientCompanyId];
            const companyInfoResult = await conn.query(sql, arg);

            await conn.commit();
            return companyInfoResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 클라이언트 기업정보 수정
    async updateClientCompany({
        clientCompanyId,
        industryId,
        industryName,
        address,
        presidentName,
        approvalStatus,
    }) {
        let sql, arg;
        let condition = '';

        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            console.log('DB > Query : createClientCompany!!');
            arg = [];

            if (industryId !== undefined) {
                if (arg.length === 0) {
                    condition += 'industryId = ?';
                } else {
                    condition += ', industryId = ?';
                }
                arg.push(industryId);
            }
            if (industryName !== undefined) {
                if (arg.length === 0) {
                    condition += 'industryName = ?';
                } else {
                    condition += ', industryName = ?';
                }
                arg.push(industryName);
            }
            if (address !== undefined) {
                if (arg.length === 0) {
                    condition += 'address = ?';
                } else {
                    condition += ', address = ?';
                }
                arg.push(address);
            }
            if (presidentName !== undefined) {
                if (arg.length === 0) {
                    condition += 'presidentName = ?';
                } else {
                    condition += ', presidentName = ?';
                }
                arg.push(presidentName);
            }

            if (approvalStatus !== undefined) {
                if (arg.length === 0) {
                    condition += 'approvalStatus = ?';
                } else {
                    condition += ', approvalStatus = ?';
                }
                arg.push(approvalStatus);
            }

            sql = `UPDATE client_companies SET ${condition} WHERE clientCompanyId = ?`;
            arg.push(clientCompanyId);
            console.log('sql, ', sql, ' arg ', arg);
            await conn.query(sql, arg);

            await conn.commit();
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 클라이언트 기업-사용자 연결 정보-------------------------------------------------
    async checkExistClientCompanyManager({
        clientCompanyId,
        belongingStatus,
        managerType,
    }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            sql = `SELECT EXISTS (SELECT * FROM client_user_and_company WHERE clientCompanyId = ? AND belongingStatus = ? AND managerType = ?) AS isExistManager`;
            arg = [clientCompanyId, belongingStatus, managerType];
            let managerExistInCompanyResult = await conn.query(sql, arg);
            let isExistManager =
                managerExistInCompanyResult[0][0].isExistManager;

            return isExistManager;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 소속된 사용자들의 연결정보 가져오기
    async getLinkedInfoByBelongingClientUsers({
        clientUserIds,
        belongingStatus,
    }) {
        const conn = await this.pool.getConnection();
        try {
            let conditionString = '';
            let arg = [belongingStatus];
            for (let i = 0; i < clientUserIds.length; i++) {
                if (i === 0) {
                    conditionString += '?';
                    arg.push(clientUserIds[i]);
                } else {
                    conditionString += ', ?';
                    arg.push(clientUserIds[i]);
                }
            }
            const sql = `SELECT * FROM linked_client_users_companies WHERE belongingStatus = ? AND clientUserId IN (${conditionString})`;
            const linkedInfoResult = await conn.query(sql, arg);
            return linkedInfoResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);

            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 사용자의 연결정보 가져오기
    async getLinkedInfoByClientUser({ clientUserId }) {
        const conn = await this.pool.getConnection();
        try {
            const sql = `SELECT * FROM linked_client_users_companies WHERE clientUserId = ?`;
            const arg = [clientUserId];
            const linkedInfoResult = await conn.query(sql, arg);
            return linkedInfoResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);

            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // 컨설턴트 =============================================================================
    // 개인 ---------------------------------------

    async createConsultantUser(
        authEntity,
        consultantUsersEntity,
        consultingCompaniesEntity,
        consultantUserAndCompanyEntity
    ) {
        let sql, arg;
        let {
            consultantUserId,
            name,
            userType,
            profileStatus,
        } = consultantUsersEntity;

        console.log(
            '요청데이터 ',
            authEntity,
            consultantUsersEntity,
            consultingCompaniesEntity,
            consultantUserAndCompanyEntity
        );

        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            //사용자 정보 생성 - 휴대폰 번호 삭제
            sql = `INSERT INTO consultant_users (consultantUserId, name, userType, profileStatus) VALUES (?, ?, ?, ?)`;
            arg = [consultantUserId, name, userType, profileStatus];
            await conn.query(sql, arg);

            // // 컨설팅 업체인 경우 처리 - 컨설팅 업체 우선 배제
            // if (
            //     userType === 3 || // 컨설팅 업체인 경우
            //     (userType === 2 && // 컨설팅 업체 소속 요청 개인 컨설턴트인 경우
            //         consultantUserAndCompanyEntity !== undefined)
            // ) {
            //     let consultingCompanyId;
            //     let {
            //         businessLicenseNum,
            //         companyName,
            //         presidentName,
            //     } = consultingCompaniesEntity;
            //     let {
            //         belongingStatus,
            //         managerType,
            //     } = consultantUserAndCompanyEntity;

            //     // 기업 정보 생성
            //     if (
            //         consultingCompaniesEntity.consultingCompanyId === undefined
            //     ) {
            //         console.log('도착 : ', consultingCompaniesEntity);
            //         sql = `INSERT INTO consulting_companies (businessLicenseNum, companyName, presidentName) VALUES (?, ?, ?)`;
            //         arg = [businessLicenseNum, companyName, presidentName];
            //         const companyCreateResult = await conn.query(sql, arg);

            //         consultingCompanyId = companyCreateResult[0].insertId;
            //     } else {
            //         consultingCompanyId =
            //             consultingCompaniesEntity.consultingCompanyId;
            //     }

            //     // 기업-사용자 연결 정보 생성
            //     sql = `INSERT INTO consultant_user_and_company (consultantUserId, consultingCompanyId, belongingStatus,managerType ) VALUES (?, ?, ?, ?)`;
            //     arg = [
            //         consultantUserId,
            //         consultingCompanyId,
            //         belongingStatus,
            //         managerType,
            //     ];
            //     await conn.query(sql, arg);
            // }

            // cognito 사용자 등록
            await authService.signUp(authEntity);

            await conn.commit();
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            if (error.location === 'AuthService') {
                throw error;
            } else {
                throw new DatabaseError(error.message, error.errno);
            }
        } finally {
            conn.release();
        }
    }
    // 컨설턴트 사용자 리스트 가져오기
    async getConsultantUsers() {
        let sql;

        const conn = await this.pool.getConnection();
        try {
            //기업 정보 생성
            console.log('DB > Query : createConsultantCompany!!');

            sql = `SELECT * from consultant_users`;
            const consultantUsersInfo = await conn.query(sql);

            await conn.commit();
            return consultantUsersInfo[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 컨설턴트 사용자 정보 가져오기
    async getConsultantUser({ consultantUserId }) {
        let sql, arg;

        const conn = await this.pool.getConnection();
        try {
            //기업 정보 생성
            console.log('DB > Query : createConsultantCompany!!');

            sql = `SELECT * from consultant_users WHERE consultantUserId = ?`;
            arg = [consultantUserId];
            const consultantUserInfo = await conn.query(sql, arg);

            await conn.commit();
            return consultantUserInfo[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 컨설턴트 사용자 정보 수정하기
    async updateConsultantUser({
        consultantUserId,
        phoneNum,
        profileStatus,
        profileGrade,
        bankName,
        bankAccountNum,
        bankAccountOwner,
        // userIntroduce,
        applicationState,
    }) {
        let sql, arg;
        let condition = '';

        const conn = await this.pool.getConnection();
        try {
            arg = [];
            //기업 정보 생성
            console.log('DB > Query : createClientCompany!!');

            if (phoneNum !== undefined) {
                if (arg.length === 0) {
                    condition += 'phoneNum = ?';
                } else {
                    condition += ', phoneNum = ?';
                }
                arg.push(phoneNum);
            }
            if (profileStatus !== undefined) {
                if (arg.length === 0) {
                    condition += 'profileStatus = ?';
                } else {
                    condition += ', profileStatus = ?';
                }
                arg.push(profileStatus);
            }
            if (profileGrade !== undefined) {
                if (arg.length === 0) {
                    condition += 'profileGrade = ?';
                } else {
                    condition += ', profileGrade = ?';
                }
                arg.push(profileGrade);
            }
            if (bankName !== undefined) {
                if (arg.length === 0) {
                    condition += 'bankName = ?';
                } else {
                    condition += ', bankName = ?';
                }
                arg.push(bankName);
            }
            if (bankAccountNum !== undefined) {
                if (arg.length === 0) {
                    condition += 'bankAccountNum = ?';
                } else {
                    condition += ', bankAccountNum = ?';
                }
                arg.push(bankAccountNum);
            }
            if (bankAccountOwner !== undefined) {
                if (arg.length === 0) {
                    condition += 'bankAccountOwner = ?';
                } else {
                    condition += ', bankAccountOwner = ?';
                }
                arg.push(bankAccountOwner);
            }
            // if (userIntroduce !== undefined) {
            //     if (arg.length === 0) {
            //         condition += 'userIntroduce = ?';
            //     } else {
            //         condition += ', userIntroduce = ?';
            //     }
            //     arg.push(userIntroduce);
            // }
            if (applicationState !== undefined) {
                if (arg.length === 0) {
                    condition += 'applicationState = ?';
                } else {
                    condition += ', applicationState = ?';
                }
                arg.push(applicationState);
            }

            sql = `UPDATE consultant_users SET ${condition} WHERE consultantUserId = ?`;

            // !condition && arg.length === 0 (id값 말고 다른 parameter 없는 경우 파라미터 오류 처리)
            arg.push(consultantUserId);

            await conn.query(sql, arg);
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // 컨설턴트 기업 -----------------------------
    async getConsultingCompany({ businessLicenseNum }) {
        let sql, arg;

        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            //기업 정보 생성
            sql = `SELECT * from consulting_companies WHERE businessLicenseNum = ?`;
            arg = [businessLicenseNum];
            const companyInfoResult = await conn.query(sql, arg);

            await conn.commit();
            return companyInfoResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // 컨설턴트 기업-사용자
    async checkExistConsultantCompanyManager({
        consultingCompanyId,
        belongingStatus,
        managerType,
    }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            sql = `SELECT EXISTS (SELECT * FROM consultant_user_and_company WHERE consultingCompanyId = ? AND belongingStatus = ? AND managerType = ?) AS isExistManager`;
            arg = [consultingCompanyId, belongingStatus, managerType];
            let managerExistInCompanyResult = await conn.query(sql, arg);
            let isExistManager =
                managerExistInCompanyResult[0][0].isExistManager;

            return isExistManager;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
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
        const conn = await pool.getConnection();
        try {
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
            let userInfoResults = await conn.query(sql, arg);

            result = userInfoResults[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
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
                // userType === 2 || userType === 1
                idColumn = 'consulting_company_id';
            }
            let companyInfo = await this.getRelationInfo({ email, userType });
            console.log('회사정보 ', companyInfo);
            let companyId = companyInfo[`${idColumn}`];
            console.log('사용자 소속기업정보 가져오기 result', companyId);

            let companyInfoResult = await this.getCompanyInfo({
                userType,
                companyId,
            });

            result = companyInfoResult;
            return result;
        } catch (error) {
            console.error('DB에러 (사용자 소속 기업정보 가져오기): ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
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
            let relationInfoResult = await conn.query(sql, arg);

            result = relationInfoResult[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // UPDATE
    // 사용자 정보 변경 - 공통 : 연락처
    async updatePhoneNum({ email, userType, phoneNum }) {
        let result;
        let sql, arg, tableName, idColumn;
        const conn = await pool.getConnection();
        try {
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
            let updatePhoneNumResult = await conn.query(sql, arg);

            result = updatePhoneNumResult[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // // 사용자 정보 변경 - 컨설턴트 입금정보 : 사용자 타입별 분할 - repository에서 분할
    // async updateBankInfo({
    //     email,
    //     userType,
    //     bankName,
    //     bankAccountNum,
    //     bankAccountOwner,
    // }) {
    //     let result;
    //     try {
    //         if (userType === 1) {
    //             result = await this.updateUserBankInfo({
    //                 email,
    //                 bankName,
    //                 bankAccountNum,
    //                 bankAccountOwner,
    //             });
    //         } else {
    //             // userType === 2
    //             result = await this.updateCompanyBankInfo({
    //                 email,
    //                 bankName,
    //                 bankAccountNum,
    //                 bankAccountOwner,
    //             });
    //         }
    //         return result;
    //     } catch (error) {
    //         console.error('DB에러 : ', error);
    // throw new DatabaseError(
    //     error.message,
    //     error.errno,
    //     error.sqlMessage
    // );
    //     }
    // }

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
        const conn = await pool.getConnection();
        try {
            // 사용자 입금정보 업데이트
            sql = `UPDATE consultant_users SET bank_name = ?, bank_account_num = ?, bank_account_owner = ? WHERE consultant_user_id = ?`;
            arg = [bankName, bankAccountNum, bankAccountOwner, email];
            await conn.query(sql, arg);
            //사용자 입금정보 가져오기
            sql = `SELECT bank_name, bank_account_num, bank_account_owner FROM consultant_users WHERE consultant_user_id = ?`;
            arg = [email];
            let userBankInfoResult = await conn.query(sql, arg);
            console.log('응답 > DB > updateUserBankInfo > 결과 : ', result);

            result = userBankInfoResult[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
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
        const conn = await pool.getConnection();
        try {
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
            let companyBankInfoResult = await conn.query(sql, arg);
            console.log('응답 > DB > updateCompanyBankInfo > 결과 : ', result);

            result = companyBankInfoResult[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // 사용자 - 소속 상태변경(취소, 해제)처리
    async updateUserBelongingStatus({
        userType,
        companyId,
        email,
        belongingStatus,
    }) {
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            '요청 > DB > Query >  updateBelongingStatus : ',
            email,
            userType,
            companyId
        );
        const conn = await pool.getConnection();
        try {
            // 추가 사용자 있을 시 사용자 타입확인 필요 - ex) 클라이언트 사용자 또는 관리자 (userType: 4) 구분 시(현재 구분않음)
            // if (userType === 1) {
            //     tableName = 'consultant_user_and_company';
            //     userIdColumn = 'consultant_user_id';
            //     companyIdColumn = 'consulting_company_id';
            // } else {
            //     //userType === 4)
            //     tableName = 'client_user_and_company';
            //     userIdColumn = 'client_user_id';
            //     companyIdColumn = 'client_company_id';
            // }

            // 사용자-기업 연결 상태 업데이트
            sql = `UPDATE consultant_user_and_company SET belonging_type = ? WHERE consulting_company_id = ? AND consultant_user_id = ?;`;
            arg = [belongingStatus, companyId, email];
            await conn.query(sql, arg);
            // 사용자-기업 연결 정보 가져오기
            sql = `SELECT consultant_user_id ,belonging_type FROM consultant_user_and_company WHERE consulting_company_id = ? AND consultant_user_id = ?`;
            arg = [companyId, email];
            let relataionInfoResult = await conn.query(sql, arg);

            result = relataionInfoResult[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
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
            managerType;

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // 탈퇴 정보 생성
            sql = `INSERT INTO withdrawal_info (userType, withdrawal_type) VALUES (?, ?)`;
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
            await connection.commit();
            console.log('success! 회원탈퇴처리완료!!');

            return;
        } catch (error) {
            console.log('fail!');
            connection.rollback();
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
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
        const conn = pool.getConnection();
        try {
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
            await conn.query(sql, arg);

            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // 기업--------------------------------------------------------------------
    // CREATE

    // GET
    // 기업 리스트 가져오기 : 기업(클/컨) 공통
    async getCompanyList({ userType }) {
        let result, sql;
        let tableName, idColumn;
        const conn = await pool.getConnection();
        try {
            if (userType === 3) {
                tableName = 'client_companies';
                idColumn = 'client_company_id';
            } else {
                //userType === 1 || userType === 2
                tableName = 'consulting_companies';
                idColumn = 'consulting_company_id';
            }
            sql = `SELECT ${idColumn}, company_name, president_name from ${tableName} WHERE approval_state = 2`;
            result = await conn.query(sql);
            console.log('요청 > DB > getCompanyList 결과: ', result);

            return result[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // 기업 정보 가져오기
    async getCompanyInfo({ userType, companyId }) {
        let result;
        let sql, arg;
        let tableName, idColumn;
        console.log(
            ' 요청 > DB > getCompanyInfo > 기업 정보 가져오기 -------------------!! : ',
            { userType, companyId }
        );
        const conn = await pool.getConnection();
        try {
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
            let companyInfoResults = await conn.query(sql, arg);
            // console.log('응답 > DB > getCompanyInfo : ', companyInfoResults);

            result = companyInfoResults[0][0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // 기업 소속 사용자들 정보 가져오기 : 기업 (클라이언트/컨설턴트) 공통
    async getCompanyBelongedUsersInfo({ userType, companyId }) {
        console.log('--------------------', userType, companyId);
        let result = [];
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn, userTypeForGetInfo;
        const conn = await pool.getConnection();
        try {
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
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // UPDATE
    // 기업 - 사용자 소속요청 승인, 거부/ 소속사용자 삭제 처리
    async updateRegistrationStatus({
        userType,
        companyId,
        email,
        belongingStatus,
    }) {
        let result;
        let sql, arg;
        let tableName, userIdColumn, companyIdColumn;
        console.log(
            '요청 > DB > Query >  updateBelongingStatus : ',
            email,
            userType,
            companyId
        );
        const conn = await pool.getConnection();
        try {
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
            arg = [belongingStatus, companyId, email];
            await conn.query(sql, arg);
            // 사용자 정보 가져오기
            sql = `SELECT ${userIdColumn},belonging_type FROM ${tableName} WHERE ${companyIdColumn} = ? AND ${userIdColumn}= ?`;
            arg = [companyId, email];
            let belongingInfoResults = await conn.query(sql, arg);
            // if (result[0].length === 0) {
            //     throw new Error('소속 기업이 없는 사용자 입니다.');
            // } // usecase에서 예외처리
            console.log(
                '응답 > DB > updateRegistrationStatus : ',
                belongingInfoResults
            );
            result = belongingInfoResults[0];
            return result;
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(
                error.message,
                error.errno,
                error.sqlMessage
            );
        } finally {
            conn.release();
        }
    }
    // DELETE

    // ---------------------------------- 프로필 임시저장 -------------------------------//
    /**
     * @description 임시저장 정보 생성 : 기존 임시저장 정보 삭제 후 생성
     * @param {Object} consultantUsersEntity - 사용자(컨설턴트) 정보 객체
     * @param {Object} tempProfilesEntity - 임시저장 정보 객체
     * @param {number[]} [tempProfileAbilityCertificationIds] - 임시저장 선택 인증 id 배열
     * @param {number[]} [tempAbilityTaskIds] - 임시저장 선택 과제 id 배열
     * @param {Object} [tempEtcCertificationsEntity] - 임시저장 기타 수행 인증/업종 객체
     * @param {Object} [tempAcademicBackgroundEntity] - 임시저장 최종 학력 정보 객체
     * @param {Object[]} [tempCareerEntities] - 임시저장 경력 정보 객체들의 배열
     * @param {Object[]} [tempLicenseEntities] - 임시저장 자격증 정보 객체들의 배열
     * @param {Object[]} [tempProjectHistoryEntities] - 경력 정보 객체들의 배열
     * @param {Object[]} tempUploadFilesEntities - 업로드 파일 정보 객체들의 배열
     */
    async createTempProfile(
        tempProfilesEntity,
        tempProfileAbilityCertificationIds,
        tempAbilityTaskIds,
        tempEtcCertificationsEntity,
        tempAcademicBackgroundEntity,
        tempCareerEntities,
        tempLicenseEntities,
        tempProjectHistoryEntities,
        tempUploadFilesEntities
    ) {
        console.log('도착 : ', tempEtcCertificationsEntity);
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            let { introduce, phoneNum, consultantUserId } = tempProfilesEntity;
            await conn.beginTransaction();

            // 이전 임시저장 id가 있다면 기존 임시저장 데이터 삭제
            if (!!tempProfilesEntity.tempProfileId) {
                let preTempProfileId = tempProfilesEntity.tempProfileId;
                // 기존 프로필 정보 삭제
                sql = `DELETE FROM temp_profiles WHERE tempProfileId = ?`;
                arg = [preTempProfileId];
                await conn.query(sql, arg);
            }

            // 임시저장 데이터 생성
            sql =
                'INSERT INTO temp_profiles (introduce, phoneNum, consultantUserId) VALUES (?, ?, ?)';
            arg = [introduce, phoneNum, consultantUserId];
            const tempProfileResults = await conn.query(sql, arg);
            const tempProfileId = tempProfileResults[0].insertId; // 임시저장 id

            // 선택한 인증이 있다면 - 인증 임시저장 데이터 생성
            if (
                tempProfileAbilityCertificationIds &&
                tempProfileAbilityCertificationIds.length
            ) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                tempProfileAbilityCertificationIds.forEach(
                    (certificationId) => {
                        if (!arg.length) {
                            insertValuesSting += '(?, ?)';
                        } else {
                            insertValuesSting += ', (?, ?)';
                        }
                        arg.push(certificationId, tempProfileId);
                    }
                );

                sql = `INSERT INTO temp_ability_certifications (certificationId, tempProfileId) VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 선택한 과제가 있다면 - 과제 임시저장 데이터 생성
            if (tempAbilityTaskIds && tempAbilityTaskIds.length) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                tempAbilityTaskIds.forEach((taskId) => {
                    if (!arg.length) {
                        insertValuesSting += '(?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?)';
                    }
                    arg.push(taskId, tempProfileId);
                });

                sql = `INSERT INTO temp_ability_tasks (taskId, tempProfileId) VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 작성한 기타 정보(인증/업종)가 있다면 - 기타 임시저장 데이터 생성
            if (
                tempEtcCertificationsEntity &&
                tempEtcCertificationsEntity.etcCertifications
            ) {
                let { etcCertifications } = tempEtcCertificationsEntity;
                sql = `INSERT INTO temp_etc_certifications 
                (etcCertifications, tempProfileId) 
                VALUES (?, ?)`;
                arg = [etcCertifications, etcIndustry, tempProfileId];
                await conn.query(sql, arg);
            }

            // 작성한 학력 정보가 있다면 - 학력 임시저장 데이터 생성
            if (
                tempAcademicBackgroundEntity &&
                Object.keys(tempAcademicBackgroundEntity).length
            ) {
                let {
                    finalAcademicType,
                    schoolName,
                    majorName,
                    admissionDate,
                    graduateDate,
                } = tempAcademicBackgroundEntity;
                sql = `INSERT INTO temp_academic_background 
                (finalAcademicType, schoolName, majorName, admissionDate, graduateDate, tempProfileId)
                VALUES (?, ?, ?, ?, ?, ?)`;
                arg = [
                    finalAcademicType,
                    schoolName,
                    majorName,
                    admissionDate,
                    graduateDate,
                    tempProfileId,
                ];
                await conn.query(sql, arg);
            }

            // 작성한 경력 정보가 있다면 - 경력 임시저장 데이터 생성
            if (tempCareerEntities && tempCareerEntities.length) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                tempCareerEntities.forEach((careerData) => {
                    let {
                        companyName,
                        position,
                        assignedWork,
                        joiningDate,
                        resignationDate,
                    } = careerData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        companyName,
                        position,
                        assignedWork,
                        joiningDate,
                        resignationDate,
                        tempProfileId
                    );
                });

                sql = `INSERT INTO temp_career 
                 (companyName, position, assignedWork, joiningDate, resignationDate, tempProfileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 작성한 자격증 정보가 있다면 - 자격증 임시저장 데이터 생성
            if (tempLicenseEntities && tempLicenseEntities.length) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                tempLicenseEntities.forEach((licenseData) => {
                    let {
                        licenseName,
                        licenseNum,
                        issueInstitution,
                        issuedDate,
                    } = licenseData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        licenseName,
                        licenseNum,
                        issueInstitution,
                        issuedDate,
                        tempProfileId
                    );
                });

                sql = `INSERT INTO temp_license 
                 (licenseName, licenseNum, issueInstitution, issuedDate, tempProfileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 작성한 수행 정보가 있다면 - 수행 정보 임시저장 데이터 생성
            if (
                tempProjectHistoryEntities &&
                tempProjectHistoryEntities.length
            ) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                tempProjectHistoryEntities.forEach((projectHistoryData) => {
                    let {
                        certificationId,
                        certificationName,
                        industryId,
                        industryName,
                        companyName,
                        taskType,
                        taskTypeName,
                        projectStartDate,
                        projectEndDate,
                    } = projectHistoryData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        certificationId,
                        certificationName,
                        industryId,
                        industryName,
                        companyName,
                        taskType,
                        taskTypeName,
                        projectStartDate,
                        projectEndDate,
                        tempProfileId
                    );
                });

                sql = `INSERT INTO temp_project_history 
                 (certificationId, certificationName, industryId, industryName, companyName, taskType, taskTypeName, projectStartDate, projectEndDate, tempProfileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 작성한 업로드 파일 정보가 있다면 - 업로드 파일 정보 임시저장 데이터 생성
            if (tempUploadFilesEntities && tempUploadFilesEntities.length) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                tempUploadFilesEntities.forEach((uploadFileData) => {
                    let { fileType, fileName, filePath } = uploadFileData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?)';
                    }
                    arg.push(fileType, fileName, filePath, tempProfileId);
                });

                sql = `INSERT INTO temp_upload_files 
                (fileType, fileName, filePath, tempProfileId)
                VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            await conn.commit();
            return;
        } catch (error) {
            console.error('오류 ;', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 임시저장 정보 삭제
     * @param {number} tempProfileId - 임시저장 프로필 id
     */
    async deleteTempProfile({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            // 업로드 파일 가져오기
            sql = `SELECT * FROM temp_upload_files WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempUploadFilesResult = await conn.query(sql, arg);
            const tempUploadFilesInfo = tempUploadFilesResult[0];
            console.log('업로드 파일 정보 ', tempUploadFilesInfo);

            // 임시저장 정보들 모두 삭제
            sql = `DELETE FROM temp_profiles WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            await conn.query(sql, arg);

            // S3 파일 삭제
            // 이미 업로드한 파일이 있다면 파일 경로들이 있는 배열로 가공
            let tempUploadFilesPath;
            if (tempUploadFilesInfo && !!tempUploadFilesInfo.length) {
                tempUploadFilesPath = tempUploadFilesInfo.map(
                    (fileInfo) => fileInfo.filePath
                );
            }
            if (!!tempUploadFilesPath) {
                await storageService.deleteUploadFilesInStorage(
                    tempUploadFilesPath
                );
            }

            await conn.commit();
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            await conn.release();
        }
    }

    /**
     * @description 임시저장 프로필 정보 가져오기
     * @param {string} consultantUserId - 사용자(컨설턴트) id
     * @returns {Promise} tempProfileResult[0][0] - 임시저장 프로필 정보 객체
     */
    async getTempProfile({ consultantUserId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT * FROM temp_profiles WHERE consultantUserId = ?`;
            // 크기 : 1.68kb, 속도 : 306 > 77 > 64 > 120 ms (가공한 크기, 속도)

            // sql = `SELECT A.*, B.*, C.*, D.*, E.*, F.*, G.*, H.*, I.*, J.*
            // FROM temp_profiles AS A
            // LEFT JOIN temp_ability_certifications AS B ON A.tempProfileId = B.tempProfileId
            // LEFT JOIN temp_ability_tasks AS C ON A.tempProfileId = C.tempProfileId
            // LEFT JOIN temp_ability_industries AS D ON A.tempProfileId = D.tempProfileId
            // LEFT JOIN temp_etc_certifications AS E ON A.tempProfileId = E.tempProfileId
            // LEFT JOIN temp_academic_background AS F ON A.tempProfileId = F.tempProfileId
            // LEFT JOIN temp_career AS G ON A.tempProfileId = G.tempProfileId
            // LEFT JOIN temp_license AS H ON A.tempProfileId = H.tempProfileId
            // LEFT JOIN temp_project_history AS I ON A.tempProfileId = I.tempProfileId
            // LEFT JOIN temp_upload_files AS J ON A.tempProfileId = J.tempProfileId
            // WHERE consultantUserId = ?`;
            // 크기 : 1.6kb, 속도 : 342 >  240 > 73 > 64 ms (데이터 가공 전 크기, 속도)
            arg = [consultantUserId];
            const tempProfileResult = await conn.query(sql, arg);

            return tempProfileResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            await conn.release();
        }
    }

    /**
     * @description 임시저장 인증 리스트 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempAbilityCertificationsResult[0] 임시저장 인증 정보 배열
     */
    async getTempAbilityCertifications({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT * FROM temp_ability_certifications WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempAbilityCertificationsResult = await conn.query(sql, arg);

            return tempAbilityCertificationsResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 임시저장 과제 리스트 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempAbilityTasksResult[0] 임시저장 과제 정보 배열
     */
    async getTempAbilityTasks({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT * FROM temp_ability_tasks WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempAbilityTasksResult = await conn.query(sql, arg);

            return tempAbilityTasksResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // /**
    //  * @description 임시저장 업종 리스트 가져오기
    //  * @param {number} tempProfileId - 임시저장 프로필 id
    //  * @returns {Promise} tempAbilityIndustriesResult[0] 임시저장 업종 정보 배열
    //  */
    // async getTempAbilityIndustries({ tempProfileId }) {
    //     let sql, arg;
    //     const conn = await this.pool.getConnection();
    //     try {
    //         sql = `SELECT * FROM temp_ability_industries WHERE tempProfileId = ?`;
    //         arg = [tempProfileId];
    //         const tempAbilityIndustriesResult = await conn.query(sql, arg);

    //         return tempAbilityIndustriesResult[0];
    //     } catch (error) {
    //         console.error('DB에러 : ', error);
    //         throw new DatabaseError(error.message, error.errno);
    //     } finally {
    //         conn.release();
    //     }
    // }

    /**
     * @description 임시저장 기타 정보 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempEtcCertificationsResult[0][0] 임시저장 기타 정보 객체
     */
    async gettempEtcCertifications({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT etcCertification FROM temp_etc_certifications WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempEtcCertificationsResult = await conn.query(sql, arg);

            return tempEtcCertificationsResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 임시저장 최종 학력 정보 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempAcademicBackgroundResult[0][0] 임시저장 최종 학력 정보 객체
     */
    async getTempAcademicBackground({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT finalAcademicType, schoolName, majorName,  admissionDate, graduateDate 
            FROM temp_academic_background
            WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempAcademicBackgroundResult = await conn.query(sql, arg);

            return tempAcademicBackgroundResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 임시저장 경력 정보 리스트 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempCareerResult[0] 임시저장 경력 정보 배열
     */
    async getTempCareer({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT companyName, position, assignedWork, joiningDate, resignationDate
            FROM temp_career
            WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempCareerResult = await conn.query(sql, arg);

            return tempCareerResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 임시저장 자격증 정보 리스트 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempLicenseResult[0] 임시저장 자격증 정보 리스트 배열
     */
    async getTempLicense({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT licenseName, licenseNum, issueInstitution, issuedDate
            FROM temp_license
            WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempLicenseResult = await conn.query(sql, arg);

            return tempLicenseResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 임시저장 수행이력 정보 리스트 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempProjectHistoryResult[0] 임시저장 수행이력 정보 리스트 배열
     */
    async getTempProjectHistory({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT certificationId, certificationName, industryId, industryName, companyName, taskType, taskTypeName, projectStartDate, projectEndDate
            FROM temp_project_history
            WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempProjectHistoryResult = await conn.query(sql, arg);

            return tempProjectHistoryResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 임시저장 업로드 파일 리스트 가져오기
     * @param {number} tempProfileId - 임시저장 프로필 id
     * @returns {Promise} tempUploadFilesResults[0] 업로드 파일 정보 배열
     */
    async getTempUploadFiles({ tempProfileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT tempUploadFileId, fileType, fileName, filePath FROM temp_upload_files WHERE tempProfileId = ?`;
            arg = [tempProfileId];
            const tempUploadFilesResults = await conn.query(sql, arg);

            return tempUploadFilesResults[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    /**
     * @description 임시저장 업로드 파일 리스트 삭제하기
     * @param {number} tempUploadFileId - 임시저장 업로드 파일 id
     */
    async deleteTempUploadFiles(tempUploadFilesEntities) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            let conditionString = '';
            arg = [];
            if (tempUploadFilesEntities.length === 1) {
                conditionString += 'tempUploadFileId = ?';
                arg.push(tempUploadFilesEntities[0]);
            } else {
                for (let i = 0; i < tempUploadFilesEntities.length; i++) {
                    if (i === 0) {
                        conditionString += 'tempUploadFileId IN (?';
                    } else if (i === tempUploadFilesEntities.length - 1) {
                        conditionString += ', ?)';
                    } else {
                        conditionString += ', ?';
                    }
                    arg.push(tempUploadFilesEntities[i]);
                }
            }
            sql = `SELECT * FROM temp_upload_files WHERE ${conditionString}`;
            const tempUploadFilesResult = await conn.query(sql, arg);
            const tempUploadFilesInfo = tempUploadFilesResult[0];

            sql = `DELETE FROM temp_upload_files WHERE ${conditionString}`;
            await conn.query(sql, arg);

            // S3 파일 삭제
            // 이미 업로드한 파일이 있다면 파일 경로들이 있는 배열로 가공
            let tempUploadFilesPath;
            if (tempUploadFilesInfo && !!tempUploadFilesInfo.length) {
                tempUploadFilesPath = tempUploadFilesInfo.map(
                    (fileInfo) => fileInfo.filePath
                );
            }
            if (!!tempUploadFilesPath) {
                await storageService.deleteUploadFilesInStorage(
                    tempUploadFilesPath
                );
            }

            await conn.commit();
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // ------------------------------ 프로필 -----------------------------------
    /**
     * @description 프로필 생성 : 임시저장 정보 삭제 후 생성
     * @param {Object} consultantUsersEntity - 사용자(컨설턴트) 정보 객체
     * @param {Object} profilesEntity - 프로필 정보 객체
     * @param {number[]} profileAbilityCertificationIds - 선택 인증 id 배열
     * @param {number[]} profileAbilityTaskIds - 선택 과제 id 배열
     * @param {Object} profileEtcCertificationsEntity - 기타 수행 인증/업종 객체
     * @param {Object} profileAcademicBackgroundEntity - 최종 학력 정보 객체
     * @param {Object[]} profileCareerEntities - 경력 정보 객체들의 배열
     * @param {Object[]} profileLicenseEntities - 자격증 정보 객체들의 배열
     * @param {Object[]} profileProjectHistoryEntities - 경력 정보 객체들의 배열
     * @param {Object[]} profileUploadFilesEntities - 업로드 파일 정보 객체들의 배열
     */
    async createProfile(
        consultantUsersEntity,
        profilesEntity,
        profileAbilityCertificationIds,
        profileAbilityTaskIds,
        profileEtcCertificationsEntity,
        profileAcademicBackgroundEntity,
        profileCareerEntities,
        profileLicenseEntities,
        profileProjectHistoryEntities,
        profileUploadFilesEntities
    ) {
        console.log('도착 : ', profileEtcCertificationsEntity);
        let sql, arg, insertValuesSting;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            // 사용자 정보 업데이트
            const {
                phoneNum,
                profileStatus,
                consultantUserId,
            } = consultantUsersEntity;
            sql = `UPDATE consultant_users SET phoneNum = ?, profileStatus = ? WHERE consultantUserId = ?`;
            arg = [phoneNum, profileStatus, consultantUserId];

            // 프로필 생성
            const { introduce } = profilesEntity;
            sql =
                'INSERT INTO profiles (introduce, consultantUserId) VALUES (?, ?)';
            arg = [introduce, consultantUserId];
            const profileResults = await conn.query(sql, arg);
            const profileId = profileResults[0].insertId; // 임시저장 id

            // 인증 생성
            insertValuesSting = '';
            arg = []; // 배열 초기화
            // query 가공
            profileAbilityCertificationIds.forEach((certificationId) => {
                if (!arg.length) {
                    // 배열이 빈 경우 > 처음인 경우
                    insertValuesSting += '(?, ?)';
                } else {
                    insertValuesSting += ', (?, ?)';
                }
                arg.push(certificationId, profileId);
            });
            sql = `INSERT INTO profile_ability_certifications (certificationId, profileId) VALUES ${insertValuesSting}`;
            await conn.query(sql, arg);

            // 과제 생성
            insertValuesSting = '';
            arg = []; // 배열 초기화
            // query 가공
            profileAbilityTaskIds.forEach((taskId) => {
                if (!arg.length) {
                    insertValuesSting += '(?, ?)';
                } else {
                    insertValuesSting += ', (?, ?)';
                }
                arg.push(taskId, profileId);
            });
            sql = `INSERT INTO profile_ability_tasks (taskId, profileId) VALUES ${insertValuesSting}`;
            await conn.query(sql, arg);

            // 기타(인증, 업종) 생성
            if (
                profileEtcCertificationsEntity &&
                Object.keys(profileEtcCertificationsEntity).length
            ) {
                let { etcCertifications } = profileEtcCertificationsEntity;
                sql = `INSERT INTO profile_etc_certifications 
                (etcCertifications, profileId) 
                VALUES (?, ?)`;
                arg = [etcCertifications, profileId];
                await conn.query(sql, arg);
            }

            // 최종 학력 생성
            if (
                profileAcademicBackgroundEntity &&
                Object.keys(profileAcademicBackgroundEntity).length
            ) {
                let {
                    finalAcademicType,
                    schoolName,
                    majorName,
                    admissionDate,
                    graduateDate,
                } = profileAcademicBackgroundEntity;
                sql = `INSERT INTO profile_academic_background 
                (finalAcademicType, schoolName, majorName, admissionDate, graduateDate, profileId)
                VALUES (?, ?, ?, ?, ?, ?)`;
                arg = [
                    finalAcademicType,
                    schoolName,
                    majorName,
                    admissionDate,
                    graduateDate,
                    profileId,
                ];
                await conn.query(sql, arg);
            }

            // 경력 정보 생성
            if (profileCareerEntities && profileCareerEntities.length) {
                insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileCareerEntities.forEach((careerData) => {
                    let {
                        companyName,
                        position,
                        assignedWork,
                        joiningDate,
                        resignationDate,
                    } = careerData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        companyName,
                        position,
                        assignedWork,
                        joiningDate,
                        resignationDate,
                        profileId
                    );
                });

                sql = `INSERT INTO profile_career 
                 (companyName, position, assignedWork, joiningDate, resignationDate, profileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 자격증 정보 생성
            if (profileLicenseEntities && profileLicenseEntities.length) {
                insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileLicenseEntities.forEach((licenseData) => {
                    let {
                        licenseName,
                        licenseNum,
                        issueInstitution,
                        issuedDate,
                    } = licenseData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        licenseName,
                        licenseNum,
                        issueInstitution,
                        issuedDate,
                        profileId
                    );
                });

                sql = `INSERT INTO profile_license 
                 (licenseName, licenseNum, issueInstitution, issuedDate, profileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 수행 정보 생성
            if (
                profileProjectHistoryEntities &&
                profileProjectHistoryEntities.length
            ) {
                insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileProjectHistoryEntities.forEach((projectHistoryData) => {
                    let {
                        certificationId,
                        certificationName,
                        industryId,
                        industryName,
                        companyName,
                        taskType,
                        taskTypeName,
                        projectStartDate,
                        projectEndDate,
                    } = projectHistoryData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        certificationId,
                        certificationName,
                        industryId,
                        industryName,
                        companyName,
                        taskType,
                        taskTypeName,
                        projectStartDate,
                        projectEndDate,
                        profileId
                    );
                });

                sql = `INSERT INTO profile_project_history 
                 (certificationId, certificationName, industryId, industryName, companyName, taskType,taskTypeName, projectStartDate, projectEndDate, profileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 업로드 파일 정보 생성
            if (
                profileUploadFilesEntities &&
                profileUploadFilesEntities.length
            ) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileUploadFilesEntities.forEach((uploadFileData) => {
                    let { fileType, fileName, filePath } = uploadFileData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?)';
                    }
                    arg.push(fileType, fileName, filePath, profileId);
                });

                sql = `INSERT INTO profile_upload_files 
                (fileType, fileName, filePath, profileId)
                VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 기존 프로필 임시저장 정보 삭제
            sql = `DELETE FROM temp_profiles WHERE consultantUserId = ?`;
            arg = [consultantUserId];
            await conn.query(sql, arg);

            await conn.commit();
            return;
        } catch (error) {
            console.error('오류 ;', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    /**
     * @description 프로필 업데이트 : 프로필 삭제 후 수정
     * @param {Object} consultantUsersEntity - 사용자(컨설턴트) 정보 객체
     * @param {Object} profilesEntity - 프로필 정보 객체
     * @param {number[]} profileAbilityCertificationIds - 선택 인증 id 배열
     * @param {number[]} profileAbilityTaskIds - 선택 과제 id 배열
     * @param {Object} profileEtcCertificationsEntity - 기타 수행 인증/업종 객체
     * @param {Object} profileAcademicBackgroundEntity - 최종 학력 정보 객체
     * @param {Object[]} profileCareerEntities - 경력 정보 객체들의 배열
     * @param {Object[]} profileLicenseEntities - 자격증 정보 객체들의 배열
     * @param {Object[]} profileProjectHistoryEntities - 경력 정보 객체들의 배열
     * @param {Object[]} profileUploadFilesEntities - 업로드 파일 정보 객체들의 배열
     */
    async updateProfile(
        consultantUsersEntity,
        profilesEntity,
        profileAbilityCertificationIds,
        profileAbilityTaskIds,
        profileEtcCertificationsEntity,
        profileAcademicBackgroundEntity,
        profileCareerEntities,
        profileLicenseEntities,
        profileProjectHistoryEntities,
        profileUploadFilesEntities
    ) {
        console.log('도착 : ');
        let sql, arg, insertValuesSting;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            console.log('ㅏ이러니ㅏㅇ러', profileAbilityCertificationIds);

            // 사용자 정보 업데이트
            const { profileStatus, consultantUserId } = consultantUsersEntity;
            sql = `UPDATE consultant_users SET profileStatus = ? WHERE consultantUserId = ?`;
            arg = [profileStatus, consultantUserId];

            let {
                profileId,
                introduce,
                academicScore,
                careerScore,
                licenseScore,
                profileGrade,
                confirmRequestDate,
                confirmCompleteDate,
                confirmComment,
                confirmManagerName,
            } = profilesEntity;

            // 기존 프로필 정보 삭제
            sql = `DELETE FROM profiles WHERE profileId = ?`;
            arg = [profileId];
            await conn.query(sql, arg);

            // 프로필 생성
            sql =
                'INSERT INTO profiles (introduce, academicScore, careerScore, licenseScore, profileGrade, confirmRequestDate, confirmCompleteDate, confirmComment, confirmManagerName, consultantUserId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            arg = [
                introduce,
                academicScore,
                careerScore,
                licenseScore,
                profileGrade,
                confirmRequestDate,
                confirmCompleteDate,
                confirmComment,
                confirmManagerName,
                consultantUserId,
            ];
            const profileResults = await conn.query(sql, arg);
            profileId = profileResults[0].insertId; // 임시저장 id

            // 인증 생성
            insertValuesSting = '';
            arg = []; // 배열 초기화
            // query 가공
            profileAbilityCertificationIds.forEach((certificationId) => {
                if (!arg.length) {
                    // 배열이 빈 경우 > 처음인 경우
                    insertValuesSting += '(?, ?)';
                } else {
                    insertValuesSting += ', (?, ?)';
                }
                arg.push(certificationId, profileId);
            });
            sql = `INSERT INTO profile_ability_certifications (certificationId, profileId) VALUES ${insertValuesSting}`;
            await conn.query(sql, arg);

            // 과제 생성
            insertValuesSting = '';
            arg = []; // 배열 초기화
            // query 가공
            profileAbilityTaskIds.forEach((taskId) => {
                if (!arg.length) {
                    insertValuesSting += '(?, ?)';
                } else {
                    insertValuesSting += ', (?, ?)';
                }
                arg.push(taskId, profileId);
            });
            sql = `INSERT INTO profile_ability_tasks (taskId, profileId) VALUES ${insertValuesSting}`;
            await conn.query(sql, arg);

            // 기타(인증, 업종) 생성
            if (
                profileEtcCertificationsEntity &&
                Object.keys(profileEtcCertificationsEntity).length
            ) {
                let { etcCertifications } = profileEtcCertificationsEntity;
                sql = `INSERT INTO profile_etc_certifications 
                (etcCertifications, profileId) 
                VALUES (?, ?)`;
                arg = [etcCertifications, profileId];
                await conn.query(sql, arg);
            }

            // 최종 학력 생성
            if (
                profileAcademicBackgroundEntity &&
                Object.keys(profileAcademicBackgroundEntity).length
            ) {
                let {
                    finalAcademicType,
                    schoolName,
                    majorName,
                    admissionDate,
                    graduateDate,
                } = profileAcademicBackgroundEntity;
                sql = `INSERT INTO profile_academic_background 
                (finalAcademicType, schoolName, majorName, admissionDate, graduateDate, profileId)
                VALUES (?, ?, ?, ?, ?, ?)`;
                arg = [
                    finalAcademicType,
                    schoolName,
                    majorName,
                    admissionDate,
                    graduateDate,
                    profileId,
                ];
                await conn.query(sql, arg);
            }

            // 경력 정보 생성
            if (profileCareerEntities && profileCareerEntities.length) {
                insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileCareerEntities.forEach((careerData) => {
                    let {
                        companyName,
                        position,
                        assignedWork,
                        joiningDate,
                        resignationDate,
                    } = careerData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        companyName,
                        position,
                        assignedWork,
                        joiningDate,
                        resignationDate,
                        profileId
                    );
                });

                sql = `INSERT INTO profile_career 
                 (companyName, position, assignedWork, joiningDate, resignationDate, profileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 자격증 정보 생성
            if (profileLicenseEntities && profileLicenseEntities.length) {
                insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileLicenseEntities.forEach((licenseData) => {
                    let {
                        licenseName,
                        licenseNum,
                        issueInstitution,
                        issuedDate,
                    } = licenseData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        licenseName,
                        licenseNum,
                        issueInstitution,
                        issuedDate,
                        profileId
                    );
                });

                sql = `INSERT INTO profile_license 
                 (licenseName, licenseNum, issueInstitution, issuedDate, profileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 수행 정보 생성
            if (
                profileProjectHistoryEntities &&
                profileProjectHistoryEntities.length
            ) {
                insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileProjectHistoryEntities.forEach((projectHistoryData) => {
                    let {
                        certificationId,
                        certificationName,
                        industryId,
                        industryName,
                        companyName,
                        taskType,
                        taskTypeName,
                        projectStartDate,
                        projectEndDate,
                    } = projectHistoryData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    }
                    arg.push(
                        certificationId,
                        certificationName,
                        industryId,
                        industryName,
                        companyName,
                        taskType,
                        taskTypeName,
                        projectStartDate,
                        projectEndDate,
                        profileId
                    );
                });

                sql = `INSERT INTO profile_project_history 
                 (certificationId, certificationName, industryId, industryName, companyName, taskType, taskTypeName, projectStartDate, projectEndDate, profileId)
                 VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            // 업로드 파일 정보 생성
            if (
                profileUploadFilesEntities &&
                profileUploadFilesEntities.length
            ) {
                let insertValuesSting = '';
                arg = []; // 배열 초기화
                // query 가공
                profileUploadFilesEntities.forEach((uploadFileData) => {
                    let { fileType, fileName, filePath } = uploadFileData;
                    if (!arg.length) {
                        insertValuesSting += '(?, ?, ?, ?)';
                    } else {
                        insertValuesSting += ', (?, ?, ?, ?)';
                    }
                    arg.push(fileType, fileName, filePath, profileId);
                });

                sql = `INSERT INTO profile_upload_files 
                (fileType, fileName, filePath, profileId)
                VALUES ${insertValuesSting}`;
                await conn.query(sql, arg);
            }

            await conn.commit();
            return;
        } catch (error) {
            console.error('오류 ;', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 사용자 프로필 리스트 가져오기 : 인증 요청일 기준 최신
     * @param {string} consultantUserId - 사용자(컨설턴트) id
     * @returns {Promise} consultantProfilesResult[0] - 프로필 정보 배열
     */
    async getProfiles({ consultantUserId }) {
        console.log('도착 ========', consultantUserId);
        const conn = await this.pool.getConnection();
        try {
            const sql = `SELECT * FROM profiles WHERE consultantUserId = ? AND confirmCompleteDate IS NOT NULL`;
            const arg = [consultantUserId];

            const consultantProfilesResult = await conn.query(sql, arg);
            return consultantProfilesResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            await conn.release();
        }
    }
    /**
     * @description 내 최신 프로필 정보 가져오기 : 인증 요청일 기준 최신
     * @param {string} consultantUserId - 사용자(컨설턴트) id
     * @returns {Promise} myProfileResult[0][0] - 프로필 정보 객체
     */
    async getMyProfile({ consultantUserId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT *, CONVERT_TZ(confirmRequestDate,'UTC','Asia/Seoul') AS confirmRequestDate FROM profiles WHERE consultantUserId = ? ORDER BY confirmRequestDate DESC`;
            arg = [consultantUserId];

            const myProfileResult = await conn.query(sql, arg);
            return myProfileResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            await conn.release();
        }
    }
    /**
     * @description 프로필 정보 가져오기
     * @param {string} profileId - 프로필 id
     * @returns {Promise} profileResult[0][0] - 프로필 정보 객체
     */
    async getProfile({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT * FROM profiles WHERE profileId = ?`;
            arg = [profileId];

            const profileResult = await conn.query(sql, arg);
            return profileResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            await conn.release();
        }
    }

    /**
     * @description 프로필 인증 리스트 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} ProfileAbilityCertificationsResult[0] 인증 정보 배열
     */
    async getProfileAbilityCertifications({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT * FROM profile_ability_certifications WHERE profileId = ?`;
            arg = [profileId];
            const profileAbilityCertificationsResult = await conn.query(
                sql,
                arg
            );

            return profileAbilityCertificationsResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 과제 리스트 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} ProfileAbilityTasksResult[0] 과제 정보 배열
     */
    async getProfileAbilityTasks({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT * FROM profile_ability_tasks WHERE profileId = ?`;
            arg = [profileId];
            const profileAbilityTasksResult = await conn.query(sql, arg);

            return profileAbilityTasksResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    // /**
    //  * @description 프로필 업종 리스트 가져오기
    //  * @param {number} profileId - 프로필 id
    //  * @returns {Promise} ProfileAbilityIndustriesResult[0] 업종 정보 배열
    //  */
    // async getProfileAbilityIndustries({ profileId }) {
    //     let sql, arg;
    //     const conn = await this.pool.getConnection();
    //     try {
    //         sql = `SELECT * FROM profile_ability_industries WHERE profileId = ?`;
    //         arg = [profileId];
    //         const profileAbilityIndustriesResult = await conn.query(sql, arg);

    //         return profileAbilityIndustriesResult[0];
    //     } catch (error) {
    //         console.error('DB에러 : ', error);
    //         throw new DatabaseError(error.message, error.errno);
    //     } finally {
    //         conn.release();
    //     }
    // }

    /**
     * @description 프로필 기타 정보 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} profileEtcCertificationsResult[0][0] 기타 정보 객체
     */
    async getProfileEtcCertifications({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT etcCertifications FROM profile_etc_certifications WHERE profileId = ?`;
            arg = [profileId];
            const profileEtcCertificationsResult = await conn.query(sql, arg);

            return profileEtcCertificationsResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 최종 학력 정보 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} profileAcademicBackgroundResult[0][0] 최종 학력 정보 객체
     */
    async getProfileAcademicBackground({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT finalAcademicType, schoolName, majorName, admissionDate, graduateDate 
            FROM profile_academic_background
            WHERE profileId = ?`;
            arg = [profileId];
            const profileAcademicBackgroundResult = await conn.query(sql, arg);

            return profileAcademicBackgroundResult[0][0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 경력 정보 리스트 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} profileCareerResult[0] 경력 정보 배열
     */
    async getProfileCareer({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT companyName, position, assignedWork, joiningDate, resignationDate
            FROM profile_career
            WHERE profileId = ?`;
            arg = [profileId];
            const profileCareerResult = await conn.query(sql, arg);

            return profileCareerResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 자격증 정보 리스트 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} profileLicenseResult[0] 자격증 정보 리스트 배열
     */
    async getProfileLicense({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT licenseName, licenseNum, issueInstitution, issuedDate
            FROM profile_license
            WHERE profileId = ?`;
            arg = [profileId];
            const profileLicenseResult = await conn.query(sql, arg);

            return profileLicenseResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 수행이력 정보 리스트 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} profileProjectHistoryResult[0] 수행이력 정보 리스트 배열
     */
    async getProfileProjectHistory({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT certificationId, certificationName, industryId, industryName, companyName, taskType, taskTypeName, projectStartDate, projectEndDate
            FROM profile_project_history
            WHERE profileId = ?`;
            arg = [profileId];
            const profileProjectHistoryResult = await conn.query(sql, arg);

            return profileProjectHistoryResult[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }

    /**
     * @description 프로필 업로드 파일 리스트 가져오기
     * @param {number} profileId - 프로필 id
     * @returns {Promise} profileUploadFilesResults[0] 업로드 파일 정보 배열
     */
    async getProfileUploadFiles({ profileId }) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            sql = `SELECT ProfileUploadFileId, fileType, fileName, filePath FROM profile_upload_files WHERE profileId = ?`;
            arg = [profileId];
            const profileUploadFilesResults = await conn.query(sql, arg);

            return profileUploadFilesResults[0];
        } catch (error) {
            console.error('DB에러 : ', error);
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    /**
     * @description 프로필 업로드 파일 리스트 삭제하기
     * @param {number} profileUploadFileId - 프로필 업로드 파일 id
     */
    async deleteProfileUploadFiles(profileUploadFilesEntities) {
        let sql, arg;
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            let conditionString = '';
            arg = [];
            if (profileUploadFilesEntities.length === 1) {
                conditionString += 'profileUploadFileId = ?';
                arg.push(profileUploadFilesEntities[0]);
            } else {
                for (let i = 0; i < profileUploadFilesEntities.length; i++) {
                    if (i === 0) {
                        conditionString += 'profileUploadFileId IN (?';
                    } else if (i === profileUploadFilesEntities.length - 1) {
                        conditionString += ', ?)';
                    } else {
                        conditionString += ', ?';
                    }
                    arg.push(profileUploadFilesEntities[i]);
                }
            }
            sql = `SELECT * FROM profile_upload_files WHERE ${conditionString}`;
            const profileUploadFilesResult = await conn.query(sql, arg);
            const profileUploadFilesInfo = profileUploadFilesResult[0];

            sql = `DELETE FROM profile_upload_files WHERE ${conditionString}`;
            await conn.query(sql, arg);

            // S3 파일 삭제
            // 이미 업로드한 파일이 있다면 파일 경로들이 있는 배열로 가공
            let profileUploadFilesPath;
            if (profileUploadFilesInfo && !!profileUploadFilesInfo.length) {
                profileUploadFilesPath = profileUploadFilesInfo.map(
                    (fileInfo) => fileInfo.filePath
                );
            }
            if (!!profileUploadFilesPath) {
                await storageService.deleteUploadFilesInStorage(
                    profileUploadFilesPath
                );
            }

            await conn.commit();
            return;
        } catch (error) {
            console.error('DB에러 : ', error);
            await conn.rollback();
            throw new DatabaseError(error.message, error.errno);
        } finally {
            conn.release();
        }
    }
    // // 클라이언트 인증 요청 : 인증 휴대폰 & 사업자 등록증 정보 수정
    // async requestClientAuth({ email, userType, phoneNum }, uploadData) {
    //     let result, sql, arg;
    //     let self = this;
    //     console.log(
    //         '요청 > DB > Query >  requestClientAuth  : parameter',
    //         { email, userType, phoneNum },
    //         uploadData
    //     );
    //     const conn = await pool.getConnection();
    //     try {
    //         await conn.beginTransaction();
    //         // 인증된 휴대폰 번호 & 승인요청상태 사용자 정보 업데이트
    //         sql = `UPDATE client_users SET phone_num=?, profileStatus = ? WHERE client_user_id = ?`;
    //         arg = [phoneNum, 0, email];
    //         await conn.query(sql, arg);

    //         // 소속 기업 정보(id) 가져오기
    //         let companyInfoResults = await self.getUserBelongingCompanyInfo({
    //             email,
    //             userType,
    //         });
    //         let companyId = companyInfoResults['client_company_id'];
    //         // 기업 데이터 저장
    //         sql = `UPDATE client_companies SET approval_state = ?, business_license_file = ?, business_license_file_path = ? WHERE client_company_id = ?`;
    //         arg = [
    //             1,
    //             uploadData[0]['originalname'],
    //             uploadData[0]['location'],
    //             companyId,
    //         ];
    //         await conn.query(sql, arg);
};
