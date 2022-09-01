// TODO : 사용자 토큰 응답 유효성 확인 보완
const Joi = require('joi');
const idReg = /^[0-9]+$/;
const passwordReg = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
const stateReg = /^[0-1]$/;
const examTypeReg = /^[12]$/; // 시험 타입 유효성 체크 : 1, 2 만 사용
const nameReg = /^[a-zA-Z가-힣]{0,20}$/;
const nameAndNumReg = /^[0-9a-zA-Z가-힣]{0,20}$/;
const nameAndNumAndSpaceReg = /^[0-9a-zA-Z가-힣\s]{0,20}$/;
const nameAndNumAndSpecialStringReg = /^[0-9a-zA-Z가-힣!@#$%^&=_\+\-\(\)]+$/;
// const nameAndNumAndSpecialStringReg = /^[\w\W]{0,20}$/;
const nameAndNumAndSpecialStringAndSpaceReg = /^[\w\W\s]{0,20}$/;
const textReg = /[^<>]+$/;
const dateReg = /^([0-9]{4})[-/]?([0-9]{2})[-/]?([0-9]{2})$/;
// const dateReg = /^([0-9]{4})[-/]?([0-9]{2})[-/]?([0-9]{2})$/;
// ex. 20210725, 2021-07-25, 2021/07/25 등
const timeReg = /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/;
const phoneNumReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
//특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식
const emailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!
const licenseNumReg = /^[0-9a-zA-Z]+$/; // 영문/숫자 하나 이상
//type
const taskGroupTypeReg = /^[0-3]$/;
const academicTypeReg = /^[0-1]$/;
const graduationTypeReg = /^[0-7]$/;

module.exports = {
    // ============================== 인증 처리 유효성 확인 ===================================

    // 사용자 토큰 APIs-------------------------------------------------
    // 기가입 확인
    checkEmailSchema: Joi.object({
        email: Joi.string().email().required(),
    }),
    // 로그인
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordReg).required(),
    }),
    // 회원가입
    signupSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordReg).required(),
        userType: Joi.number().min(1).max(3).required(),
        name: Joi.string().max(20).required(),
        businessLicenseNum: Joi.string().alphanum().length(10), // 패턴으로 수정
        companyName: Joi.string().max(20),
        presidentName: Joi.string().max(20),
    }),
    // 새 비밀번호 설정
    firstPasswordSettingSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordReg).required(), // 비밀번호 길이 수정 : 현재 8이상 20미만
        session: Joi.string().required(),
    }),
    // 비밀번호 찾기 코드 받기
    findPasswordSchema: Joi.object({
        email: Joi.string().email().required(),
    }),
    // 비밀번호 찾기 비밀번호 설정
    findPasswordSettingSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordReg).required(),
        code: Joi.string().length(6).required(),
    }),
    // 사용자 재인증
    userReAuthSchema: Joi.object({
        password: Joi.string().pattern(passwordReg).required(),
    }),
    // 비밀번호 변경
    changePasswordSchema: Joi.object({
        prePassword: Joi.string().pattern(passwordReg).required(),
        newPassword: Joi.string().pattern(passwordReg).required(),
    }),

    // ============================== 사용자 정보 유효성 확인 ===================================
    // 사용자 토큰 APIs-------------------------------------------------
    // id token 으로 가져온 사용자 정보 유효성 확인 : 유효성 보완하기!!
    getUserDataByIdTokenSchema: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(20),
        passwordUpdateDate: Joi.string(),
        id: Joi.string(),
        authTime: Joi.number(),
        expTime: Joi.number(),
        issueTime: Joi.number(),
    }),
    //   idTokenData example =  {
    //   sub: 'e3d1c295-24df-4aca-a533-cfac42114fbf',
    //   email_verified: true,
    //   iss: 'https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_D6Lo4PKAw',
    //   'cognito:username': 'e3d1c295-24df-4aca-a533-cfac42114fbf',
    //   aud: '2f08t7o3akobabb7l5i5unie0g',
    //   event_id: 'f10d33ea-085d-4eb8-9c8a-8475f84b7012',
    //   token_use: 'id',
    //   auth_time: 1645601561,
    //   name: '정치훈',
    //   'custom:passwordUpdateDate': '1645101093',
    //   'custom:custom:retryCount': '0',
    //   exp: 1645687961,
    //   iat: 1645601561,
    //   email: 'ch.jung@aegisecu.com'
    // }

    // 내 정보 --------------------------------------------------
    updateMyInfoSchema: Joi.object({
        phoneNum: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(10)
            .max(12),
        profileStatus: Joi.number().min(1).max(4),
        bankName: Joi.string().max(20),
        bankAccountNum: Joi.string().pattern(/^[0-9]+$/),
        bankAccountOwner: Joi.string().max(20),
        applicationState: Joi.number().min(0).max(1),
    }),
    // ---------------------- 클라이언트 -------------------

    // ------------------컨설턴트 --------------------
    getConsultantUserSchema: Joi.object({
        consultantUserId: Joi.string().email().required(),
    }),
    updateConsultantUserSchema: Joi.object({
        consultantUserId: Joi.string().email().required(),
    }), // 현재 관리자가 수정해야하는 정보는 없음

    // ======================== 임시저장 =============================
    createTempProfileSchema: Joi.object({
        phoneNum: Joi.string().pattern(phoneNumReg),
        introduce: Joi.string(),
        // abilityIndustryIds: Joi.array()
        //     .items(Joi.number().positive().required())
        //     .min(1), // 필수 여부 확인!!, 수행이력의 업종과 다름이 있는지 여부 확인!!
        abilityCertificationIds: Joi.array()
            .items(Joi.number().positive().required())
            .min(1),
        etcCertification: Joi.string().max(10),
        abilityTaskIds: Joi.array()
            .items(Joi.number().positive().required())
            .min(1),
        academicBackground: Joi.object({
            finalAcademicType: Joi.number().min(0).max(3),
            schoolName: Joi.string().max(20),
            majorName: Joi.string().max(20),
            admissionDate: Joi.string().pattern(dateReg),
            graduateDate: Joi.string().pattern(dateReg),
        }),
        career: Joi.array()
            .items(
                Joi.object({
                    companyName: Joi.string().max(20),
                    position: Joi.string().max(20),
                    assignedWork: Joi.string().max(20),
                    joiningDate: Joi.string().pattern(dateReg),
                    resignationDate: Joi.string().pattern(dateReg),
                })
            )
            .min(1),
        license: Joi.array()
            .items(
                Joi.object({
                    licenseName: Joi.string().max(20),
                    licenseNum: Joi.string().max(20),
                    issueInstitution: Joi.string().max(20),
                    issuedDate: Joi.string().pattern(dateReg),
                })
            )
            .min(1),
        projectHistory: Joi.array()
            .items(
                Joi.object({
                    certificationId: Joi.number().positive(),
                    certificationName: Joi.string().max(20),
                    // projectName: Joi.string().max(20),
                    industryId: Joi.number().positive(),
                    industryName: Joi.string().max(20),
                    companyName: Joi.string().max(20),
                    projectStartDate: Joi.string().pattern(dateReg),
                    projectEndDate: Joi.string().pattern(dateReg),
                    taskType: Joi.number().min(0).max(6),
                    taskTypeName: Joi.string().max(20),
                    // assignedTask: Joi.string().max(20).required(),
                })
            )
            .min(1),
        // abilityEtc: Joi.object({
        //     etcCertification: Joi.string().max(10),
        //     etcIndustry: Joi.string().max(10), // 기타업종은 없는지 확인!!(이전에는 있었음), 수행이력의 업종과 중복여부 확인!!
        // }),
        //
    }),

    // ======================== 프로필 =============================
    getProfilesSchema: Joi.object({
        consultantUserId: Joi.string().email().required(),
    }),
    getProfileSchema: Joi.object({
        consultantUserId: Joi.string().email().required(),
        profileId: Joi.number().positive().required(),
    }),
    createProfileSchema: Joi.object({
        phoneNum: Joi.string().pattern(phoneNumReg).required(),
        introduce: Joi.string(), // 필수 X
        // abilityIndustryIds: Joi.array() - 삭제
        //     .items(Joi.number().positive().required())
        //     .min(1), // 필수 여부 확인!!, 수행이력의 업종과 다름이 있는지 여부 확인!!
        abilityCertificationIds: Joi.array()
            .items(Joi.number().positive().required())
            .min(1)
            .required(), // 필수
        etcCertification: Joi.string().max(10),
        abilityTaskIds: Joi.array()
            .items(Joi.number().positive().required())
            .min(1)
            .required(), // 필수
        academicBackground: Joi.object({
            finalAcademicType: Joi.number().min(0).max(3).required(),
            schoolName: Joi.string().max(20).required(),
            majorName: Joi.string().max(20).required(),
            admissionDate: Joi.string().pattern(dateReg).required(),
            graduateDate: Joi.string().pattern(dateReg).required(),
        }).required(), // 필수
        career: Joi.array() // 필수 X, 값을 넣게 된다면 각 property의 value는 모두 필수 값
            .items(
                Joi.object({
                    companyName: Joi.string().max(20).required(),
                    position: Joi.string().max(20).required(),
                    assignedWork: Joi.string().max(20).required(),
                    joiningDate: Joi.string().pattern(dateReg).required(),
                    resignationDate: Joi.string().pattern(dateReg).required(),
                })
            )
            .min(1),
        license: Joi.array() // 필수 X, 값을 넣게 된다면 각 property의 value는 모두 필수 값
            .items(
                Joi.object({
                    licenseName: Joi.string().max(20).required(),
                    licenseNum: Joi.string().max(20).required(),
                    issueInstitution: Joi.string().max(20).required(),
                    issuedDate: Joi.string().pattern(dateReg).required(),
                })
            )
            .min(1),
        projectHistory: Joi.array() // 필수 X, 값을 넣게 된다면 각 property의 value는 모두 필수 값
            .items(
                Joi.object({
                    certificationId: Joi.number().positive().required(),
                    certificationName: Joi.string().max(20).required(),
                    // projectName: Joi.string().max(20).required(),
                    industryId: Joi.number().positive().required(),
                    industryName: Joi.string().max(20).required(),
                    companyName: Joi.string().max(20).required(),
                    projectStartDate: Joi.string().pattern(dateReg).required(),
                    projectEndDate: Joi.string().pattern(dateReg).required(),
                    taskType: Joi.number().min(0).max(6).required(),
                    taskTypeName: Joi.string().max(20).required(),
                    // assignedTask: Joi.string().max(20).required(),
                })
            )
            .min(1),
        // abilityEtc: Joi.object({}), - 삭제
    }),
    updateProfileSchema: Joi.object({
        consultantUserId: Joi.string().email().required(),
        profileId: Joi.number().positive().required(),
        introduce: Joi.string(), // 필수 X
        academicScore: Joi.number().min(0).max(100).required(),
        careerScore: Joi.number().min(0).max(100).required(),
        licenseScore: Joi.number().min(0).max(100).required(),
        confirmComment: Joi.string(), // 필수 확인
        confirmManagerName: Joi.string().max(10).required(),
        // abilityIndustryIds: Joi.array()
        //     .items(Joi.number().positive().required())
        //     .min(1), // 필수 여부 확인!!, 수행이력의 업종과 다름이 있는지 여부 확인!!
        abilityCertificationIds: Joi.array()
            .items(Joi.number().positive().required())
            .min(1)
            .required(), // 필수
        etcCertification: Joi.string().max(10),
        abilityTaskIds: Joi.array()
            .items(Joi.number().positive().required())
            .min(1)
            .required(), // 필수
        academicBackground: Joi.object({
            finalAcademicType: Joi.number().min(0).max(3).required(),
            schoolName: Joi.string().max(20).required(),
            majorName: Joi.string().max(20).required(),
            admissionDate: Joi.string().pattern(dateReg).required(),
            graduateDate: Joi.string().pattern(dateReg).required(),
        }).required(), // 필수
        career: Joi.array() // 필수 X, 값을 넣게 된다면 각 property의 value는 모두 필수 값
            .items(
                Joi.object({
                    companyName: Joi.string().max(20).required(),
                    position: Joi.string().max(20).required(),
                    assignedWork: Joi.string().max(20).required(),
                    joiningDate: Joi.string().pattern(dateReg).required(),
                    resignationDate: Joi.string().pattern(dateReg).required(),
                })
            )
            .min(1),
        license: Joi.array() // 필수 X, 값을 넣게 된다면 각 property의 value는 모두 필수 값
            .items(
                Joi.object({
                    licenseName: Joi.string().max(20).required(),
                    licenseNum: Joi.string().max(20).required(),
                    issueInstitution: Joi.string().max(20).required(),
                    issuedDate: Joi.string().pattern(dateReg).required(),
                })
            )
            .min(1),
        projectHistory: Joi.array() // 필수 X, 값을 넣게 된다면 각 property의 value는 모두 필수 값
            .items(
                Joi.object({
                    certificationId: Joi.number().positive().required(),
                    certificationName: Joi.string().max(20).required(),
                    // projectName: Joi.string().max(20).required(),
                    industryId: Joi.number().positive().required(),
                    industryName: Joi.string().max(20).required(),
                    companyName: Joi.string().max(20).required(),
                    projectStartDate: Joi.string().pattern(dateReg).required(),
                    projectEndDate: Joi.string().pattern(dateReg).required(),
                    taskType: Joi.number().min(0).max(6).required(),
                    taskTypeName: Joi.string().max(20).required(),
                    // assignedTask: Joi.string().max(20).required(),
                })
            )
            .min(1),
        // abilityEtc: Joi.object({}), - 삭제
    }),

    // // 관리자 APIs-------------------------------------------------
    // // 관리자 생성 유효성 확인
    // createManagerSchema: Joi.object({
    //     email: Joi.string().email().required(),
    //     name: Joi.string().max(20).required(),
    //     phoneNum: Joi.string()
    //         .pattern(/^[0-9]+$/)
    //         .min(10)
    //         .max(12)
    //         .required(),
    //     department: Joi.string().max(20).required(),
    //     position: Joi.string().max(20).required(),
    //     adminAuthId: Joi.number().required(),
    // }),
    // // 개별 관리자 가져오기 유효성 확인
    // getManagerSchema: Joi.object({
    //     email: Joi.string().email().required(),
    // }),
    // // 관리자 수정 유효성 확인
    // updateManagerSchema: Joi.object({
    //     email: Joi.string().email().required(),
    //     phoneNum: Joi.string()
    //         .pattern(/^[0-9]+$/)
    //         .min(10)
    //         .max(12),
    //     department: Joi.string().max(20),
    //     position: Joi.string().max(20),
    //     adminAuthId: Joi.number(),
    // }),
    // // 관리자 삭제 유효성 확인
    // deleteManagerSchema: Joi.object({
    //     email: Joi.string().email().required(),
    // }),

    // // ============================== 설정 관리 유효성 확인 ===================================

    // // 권한 관리 APIs-------------------------------------------------
    // // 권한 생성 유효성 확인
    // createAdminAuthSchema: Joi.object({
    //     adminAuthName: Joi.string().max(20).required(),
    //     menuAuthorityList: Joi.array()
    //         .items(
    //             Joi.object({
    //                 menuId: Joi.number().positive().required(),
    //                 readState: Joi.number().min(0).max(1).required(),
    //                 writeState: Joi.number().min(0).max(1).required(),
    //                 downloadState: Joi.number().min(0).max(1).required(),
    //             })
    //         )
    //         .length(28)
    //         .required(),
    // }),
    // // 개별 권한 가져오기 유효성 확인
    // getAdminAuthSchema: Joi.object({
    //     adminAuthId: Joi.number().positive().required(),
    // }),
    // // 권한 수정 유효성 확인
    // updateAdminAuthSchema: Joi.object({
    //     adminAuthId: Joi.number().positive().required(),
    //     adminAuthName: Joi.string().max(20),
    //     menuAuthorityList: Joi.array()
    //         .items(
    //             Joi.object({
    //                 menuId: Joi.number().positive().required(),
    //                 readState: Joi.number().min(0).max(1),
    //                 writeState: Joi.number().min(0).max(1),
    //                 downloadState: Joi.number().min(0).max(1),
    //             })
    //         )
    //         .min(1),
    // }),
    // // 권한 삭제 유효성 확인
    // deleteAdminAuthSchema: Joi.object({
    //     adminAuthId: Joi.number().positive().required(),
    // }),

    // // ============================== 게시판 유효성 확인 ===================================

    // // 교육 게시판 APIs-------------------------------------------------
    // // 교육 게시판 생성 유효성 확인
    // createEducationBoardSchema: Joi.object({
    //     title: Joi.string().required(),
    //     contents: Joi.string().required(),
    // }),
    // // 교육 게시판 가져오기 유효성 확인
    // getEducationBoardSchema: Joi.object({
    //     educationBoardId: Joi.number().positive().required(),
    // }),
    // // 교육 게시판 수정 유효성 확인
    // updateEducationBoardSchema: Joi.object({
    //     educationBoardId: Joi.number().positive().required(),
    //     title: Joi.string(),
    //     contents: Joi.string(),
    // }),
    // // 교육 게시판 삭제 유효성 확인
    // deleteEducationBoardSchema: Joi.object({
    //     educationBoardId: Joi.number().positive().required(),
    // }),
    // // 공지사항 게시판 APIs-------------------------------------------------
    // // 공지사항 게시판 생성 유효성 확인
    // createAnnouncementBoardSchema: Joi.object({
    //     title: Joi.string().required(),
    //     contents: Joi.string().required(),
    // }),
    // // 공지사항 게시판 가져오기 유효성 확인
    // getAnnouncementBoardSchema: Joi.object({
    //     announcementBoardId: Joi.number().positive().required(),
    // }),
    // // 공지사항 게시판 수정 유효성 확인
    // updateAnnouncementBoardSchema: Joi.object({
    //     announcementBoardId: Joi.number().positive().required(),
    //     title: Joi.string(),
    //     contents: Joi.string(),
    // }),
    // // 공지사항 게시판 삭제 유효성 확인
    // deleteAnnouncementBoardSchema: Joi.object({
    //     announcementBoardId: Joi.number().positive().required(),
    // }),

    // // ============================== 파일 업로드 유효성 확인 ===================================

    // // 파일 업로드 전송 APIs-------------------------------------------------

    // // 첨부파일 업데이트 유효성 확인
    // createUploadFilesRequestSchema: Joi.array().items(
    //     Joi.object({
    //         fileType: Joi.string(),
    //         fileName: Joi.string().required(),
    //         filePath: Joi.string().uri().required(),
    //     })
    // ),
    // // 첨부파일 업데이트 유효성 확인
    // updateUploadFilesRequestSchema: Joi.array().items(
    //     Joi.object({
    //         fileType: Joi.string(),
    //         fileName: Joi.string().required(),
    //         filePath: Joi.string().uri().required(),
    //     })
    // ),
    // // 첨부파일 payload 유효성 확인
    // deleteAttachFilesSchema: Joi.object({
    //     location: Joi.string().max(30).required(),
    //     deleteUploadFiles: Joi.array()
    //         .items(Joi.number().positive().required())
    //         .min(1)
    //         .required(),
    // }),

    // // 에디터에 포함된 컨텐츠 파일 payload 유효성 확인
    // deleteContentsFilesSchema: Joi.object({
    //     deleteUploadFiles: Joi.array()
    //         .items(Joi.string().uri().required())
    //         .min(1)
    //         .required(),
    // }),

    // // ============================== 메세지 전송 유효성 확인 ===================================

    // // 메세지 전송 APIs-------------------------------------------------
    // // 유형별 메세지(메일/알림톡) 유효성 확인
    // sendTemplateMessageSchema: Joi.object({
    //     sendType: Joi.string().required(), // sendType : 'talk' || 'email' || 'all' 아닐 경우 오류 처리 방법 확인!!
    //     contentsType: Joi.string().max(30).required(),
    //     recipients: Joi.array().items(Joi.number()).min(1).required(),
    // }),
    // // 사용자 정의 알림톡 유효성 확인
    // sendCustomTalkSchema: Joi.object({
    //     sendType: Joi.string().required(),
    //     recipients: Joi.array()
    //         .items(
    //             Joi.string()
    //                 .pattern(/^[0-9]+$/)
    //                 .min(10)
    //                 .max(12)
    //         )
    //         .min(1)
    //         .required(),
    //     contents: Joi.string().required(),
    // }),
    // // 사용자 정의 메일 전송
    // sendCustomMailSchema: Joi.object({
    //     sendType: Joi.string().required(),
    //     recipients: Joi.array().items(Joi.string().email()).min(1).required(),
    //     title: Joi.string().max(30).required(),
    //     contents: Joi.string(),
    // }),

    // // ============================== 자격증 유효성 확인 ===================================

    // // 시험 관리 APIs -------------------------------------------------
    // createExamSchema: Joi.array()
    //     .items(
    //         Joi.object({
    //             examType: Joi.number().min(1).max(2).required(),
    //             examDate: Joi.string().length(10).required(),
    //             examTime: Joi.string().length(8).required(),
    //         })
    //     )
    //     .min(1),
    // getExamSchema: Joi.object({
    //     pageType: Joi.number().min(0).max(3),
    //     examType: Joi.number().min(1).max(2),
    //     examDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10),
    // }),
    // deleteExamSchema: Joi.object({
    //     examType: Joi.number().min(1).max(2).required(),
    //     examDate: Joi.string().length(10).required(),
    //     examTime: Joi.string().length(8).required(),
    // }),
    // // 수험 관리 APIs -------------------------------------------------
    // createExamReceptionSchema: Joi.object({
    //     examType: Joi.number().min(1).max(2).required(),
    //     examDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10)
    //         .required(),
    //     examTime: Joi.string()
    //         .pattern(
    //             /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/
    //         )
    //         .length(8)
    //         .required(),
    //     examineeName: Joi.string().max(20).required(),
    //     birthDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10)
    //         .required(),
    //     phoneNum: Joi.string()
    //         .pattern(/^[0-9]+$/)
    //         .min(10)
    //         .max(12)
    //         .required(),
    //     email: Joi.string().email().required(),
    //     ci: Joi.string().length(88).required(),
    // }),
    // getExamReceptionSchema: Joi.object({
    //     examReceptionId: Joi.number().positive(),
    //     ci: Joi.string().length(88),
    //     examType: Joi.number().min(0).max(2),
    //     examDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10),
    //     examTime: Joi.string()
    //         .pattern(
    //             /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/
    //         )
    //         .length(8),
    //     fromDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10),
    //     toDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10),
    //     pageType: Joi.string(),
    //     // receptionType: Joi.number().min(0).max(2),
    //     // deliveryType: Joi.number().min(1).max(2),
    // }),
    // updateExamReceptionSchema: Joi.object({
    //     examReceptionId: Joi.number().positive(), // 시험 결과 수정 제외한 공통 payload
    //     email: Joi.string().email(), // 접수 정보 변경(납입완료) 처리 payload
    //     paymentStateType: Joi.number().min(0).max(1), // 접수 정보 변경(납입완료) 처리 payload
    //     refundBankName: Joi.string().pattern(/^[\w\W\s]{0,20}$/), // 환불 처리 payload
    //     refundAccountNum: Joi.string().alphanum(), // 환불 처리 payload
    //     postalCode: Joi.string()
    //         .pattern(/^[0-9]+$/)
    //         .length(5), // 배송 신청 처리 payload
    //     address: Joi.string(), // 배송 신청 처리 payload
    //     receiverName: Joi.string().pattern(/^[\w\W\s]{0,20}$/),
    //     receiverPhoneNum: Joi.string()
    //         .pattern(/^[0-9]+$/)
    //         .min(10)
    //         .max(12), // 배송 신청 처리 payload
    //     deliveryCode: Joi.string().pattern(/^[0-9]+$/), // 배송 완료 처리 payload
    //     examType: Joi.number().min(1).max(2), // 시험 결과 수정 payload
    //     examDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10),
    //     examTime: Joi.string()
    //         .pattern(
    //             /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/
    //         )
    //         .length(8), // 시험 결과 수정 payload
    //     results: Joi.array()
    //         .items(
    //             Joi.object({
    //                 examReceptionId: Joi.number().positive().required(),
    //                 score: Joi.number().min(-1).max(100).required(),
    //                 receptionType: Joi.number().min(0).max(1).required(),
    //             })
    //         )
    //         .min(1), // 시험 결과 수정 payload
    // }),
    // updateExamResultSchema: Joi.object({
    //     examType: Joi.number().min(1).max(2).required(),
    //     examDate: Joi.string()
    //         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
    //         .length(10)
    //         .required(),
    //     examTime: Joi.string()
    //         .pattern(
    //             /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/
    //         )
    //         .length(8)
    //         .required(),
    //     results: Joi.array()
    //         .items(
    //             Joi.object({
    //                 examReceptionId: Joi.number().positive().required(),
    //                 score: Joi.number().min(-1).max(100).required(),
    //                 receptionType: Joi.number().min(0).max(1).required(),
    //             })
    //         )
    //         .min(1),
    // }),
};

// // 접수
// const cancelExamReceptionSchema = Joi.object({
//     examReceptionId: Joi.number().positive().required(),
//     refundBankName: Joi.string().pattern(/^[\w\W\s]{0,20}$/),
//     refundAccountNum: Joi.string().alphanum(),
// });
// const createExamReceptionSchema = Joi.object({
//     examType: Joi.number().min(1).max(2).required(),
//     examDate: Joi.string()
//         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
//         .length(10)
//         .required(),
//     examTime: Joi.string()
//         .pattern(
//             /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/
//         )
//         .length(8)
//         .required(),
//     examineeName: Joi.string().max(20).required(),
//     birthDate: Joi.string()
//         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
//         .length(10)
//         .required(),
//     phoneNum: Joi.string()
//         .pattern(/^[0-9]+$/)
//         .min(10)
//         .max(12)
//         .required(),
//     email: Joi.string().email().required(),
// });
// const phoneNumSchema = Joi.object({
//     phoneNum: Joi.string()
//         .pattern(/^[0-9]+$/)
//         .min(10)
//         .max(12)
//         .required(),
// });
// const updateExamReceptionSchema = Joi.object({
//     examReceptionId: Joi.number().positive().required(),
//     examType: Joi.number().min(1).max(2).required(),
//     examDate: Joi.string()
//         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
//         .length(10)
//         .required(),
//     examTime: Joi.string()
//         .pattern(
//             /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/
//         )
//         .length(8)
//         .required(),
//     examineeName: Joi.string().max(20).required(),
//     birthDate: Joi.string()
//         .pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
//         .length(10)
//         .required(),
//     phoneNum: Joi.string()
//         .pattern(/^[0-9]+$/)
//         .min(10)
//         .max(12)
//         .required(),
//     email: Joi.string().email().required(),
//     paymentStateType: Joi.number().min(0).max(3).required(),
// });
// const updateExamResultSchema = Joi.array().items(
//     Joi.object({
//         examReceptionId: Joi.number().positive().required(),
//         examType: Joi.number().min(1).max(2).required(),
//         score: Joi.number().min(0).max(100).required(),
//     })
// );
// const updateExamRefundSchema = Joi.object({
//     examReceptionId: Joi.number().positive().required(),
// });
// const updateDeliveryRequestSchema = Joi.object({
//     examReceptionId: Joi.number().positive().required(),
//     postalCode: Joi.string()
//         .pattern(/^[0-9]+$/)
//         .length(6)
//         .required(),
//     address: Joi.string().required(),
//     receiverName: Joi.string().pattern(/^[\w\W\s]{0,20}$/),
//     receiverPhoneNum: Joi.string()
//         .pattern(/^[0-9]+$/)
//         .min(10)
//         .max(12)
//         .required(),
//     deliveryType: Joi.number().min(0).max(3).required(),
// });

// // 시험
// const createExamSchema = Joi.array().items(
//     Joi.object({
//         examType: Joi.number().min(1).max(2).required(),
//         examDate: Joi.string().length(10).required(),
//         examTime: Joi.string().length(8).required(),
//     })
// );
// const deleteExamSchema = Joi.object({
//     examRegistrationId: Joi.number().positive().required(),
// });

// // 어드민
// const selectedRegionSchema = Joi.object({
//     regionId: Joi.number().positive().required(),
// });
// const getDateSchema = Joi.object({
//     examType: Joi.number().min(1).max(2).required(),
//     pageType: Joi.number().min(0).max(3).required(),
// });
// const getTimeSchema = Joi.object({
//     examType: Joi.number().min(1).max(2).required(),
//     pageType: Joi.number().min(0).max(3).required(),
//     examDate: Joi.string().length(10).required(),
// });

// const certificationIdsAndClassificationsSchema = Joi.array().items(
//     Joi.object({
//         certificationId: Joi.number().positive(),
//         examClassificationId: Joi.number().positive(),
//     })
// );
// const certificationIdsSchema = Joi.object({
//     certificationId: Joi.array().items(Joi.number().positive()),
// });
// const selectCertificationsAndClassificationsAndTasksSchema = Joi.array().items(
//     Joi.object({
//         certificationId: Joi.number().positive().required(),
//         examClassificationId: Joi.number().positive().required(),
//         tasks: Joi.array().items(
//             Joi.object({
//                 taskId: Joi.number().positive().required(),
//                 assetType: Joi.number().min(0).max(17), // 자산 타입 조건 확인!!
//             })
//         ),
//     })
// );
