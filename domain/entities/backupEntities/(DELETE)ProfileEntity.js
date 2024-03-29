'use strict';

// const AuthEntity = require('./AuthEntity');
const { ParameterException } = require('../exceptions');
// /*
// type의 경우 위와 같이 형식을 나눠주는 것이 코드 가독성이 좋음
// const UpdateBankInfoEntityConfig = {
//     userType: {
//         PERSONAL_CONSULTANT : 1,
//     }
// }
// */

// 추후 헬퍼함수 모듈로 변경
const idReg = /^[0-9]+$/;
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
module.exports = class UserEntity {
    constructor({
        phoneNum = null,
        introduce = '',
        abilityCertifications = [],
        abilityIndustries = [],
        abilityTasks = [],
        academicBackground = {},
        career = [],
        license = [],
        projectHistory = [],
        etc = {},
    }) {
        this.phoneNum = phoneNum;
        this.introduce = introduce;
        this.abilityCertifications = abilityCertifications;
        this.abilityIndustries = abilityIndustries;
        this.abilityTasks = abilityTasks;
        this.academicBackground = academicBackground;
        this.career = career;
        this.license = license;
        this.projectHistory = projectHistory;
        this.etc = etc;
    }
    // phoneNum
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(phoneNum) {
        if (phoneNum !== null) {
            if (!phoneNumReg.test(phoneNum)) {
                throw new ParameterException('연락처');
            } else {
                this._phoneNum = phoneNum;
            }
        } else {
            this._phoneNum = phoneNum;
        }
    }
    // introduce
    get introduce() {
        return this._introduce;
    }
    set introduce(introduce) {
        if (introduce === '') {
            this._introduce = introduce;
        } else {
            console.log('----------------------------', introduce);
            // let regIntroduce = /^.*$/; // 유효성 체크 확인 : 한글/영어/숫자/특수문자 글자수 제한 없음
            if (!textReg.test(introduce)) {
                throw new ParameterException('자기소개');
            } else {
                this._introduce = introduce;
            }
        }
    }
    // abilityCertifications
    get abilityCertifications() {
        return this._abilityCertifications;
    }
    set abilityCertifications(abilityCertifications) {
        if (!abilityCertifications.length) {
            this._abilityCertifications = abilityCertifications;
        } else {
            for (let i = 0; i < abilityCertifications.length; i++) {
                if (
                    (abilityCertifications[i].certificationId !== '' &&
                        !idReg.test(
                            abilityCertifications[i].certificationId
                        )) ||
                    (abilityCertifications[i].certificationName !== '' &&
                        !nameAndNumAndSpecialStringReg.test(
                            abilityCertifications[i].certificationName
                        ))
                ) {
                    throw new ParameterException('인증 구분 정보 ');
                }
                // if (
                //     !abilityCertifications[i].certificationId ||
                //     !idReg.test(abilityCertifications[i].certificationId)
                // ) {
                //     throw new ParameterException('인증 아이디 ');
                // } else {
                //     abilityCertifications[i].certificationId = Number(
                //         abilityCertifications[i].certificationId
                //     );
                // }
                // if (
                //     !abilityCertifications[i].certificationName ||
                //     !nameAndNumAndSpecialStringReg.test(
                //         abilityCertifications[i].certificationName
                //     )
                // ) {
                //     throw new ParameterException('인증명 ');
                // }
            }
            this._abilityCertifications = abilityCertifications;
        }
    }
    // abilityIndustries
    // "abilityIndustries":[{"industryId":2,"industryName":"쇼핑몰"}],
    get abilityIndustries() {
        return this._abilityIndustries;
    }
    set abilityIndustries(abilityIndustries) {
        if (!abilityIndustries.length) {
            this._abilityIndustries = abilityIndustries;
        } else {
            for (let i = 0; i < abilityIndustries.length; i++) {
                if (
                    (abilityIndustries[i].industryId !== '' &&
                        !idReg.test(abilityIndustries[i].industryId)) ||
                    (abilityIndustries[i].industryName !== '' &&
                        !nameAndNumReg.test(abilityIndustries[i].industryName))
                ) {
                    throw new ParameterException('수행가능 업종 정보 ');
                }
                // if (
                //     !abilityIndustries[i].industryId ||
                //     !idReg.test(abilityIndustries[i].industryId)
                // ) {
                //     throw new ParameterException('수행 가능 업종 아이디 ');
                // } else {
                //     abilityIndustries[i].industryId = Number(
                //         abilityIndustries[i].industryId
                //     );
                // }
                // if (
                //     !abilityIndustries[i].industryName ||
                //     !nameAndNumReg.test(abilityIndustries[i].industryName)
                // ) {
                //     throw new ParameterException('수행 가능 업종명 ');
                // }
            }
            this._abilityIndustries = abilityIndustries;
        }
    }
    // abilityTasks
    // "abilityTasks":[{"taskId":3,"taskName":"세부과제1","taskGroupType":1}],
    get abilityTasks() {
        return this._abilityTasks;
    }
    set abilityTasks(abilityTasks) {
        if (!abilityTasks.length) {
            this._abilityTasks = abilityTasks;
        } else {
            for (let i = 0; i < abilityTasks.length; i++) {
                if (
                    (abilityTasks[i].taskId !== '' &&
                        !idReg.test(abilityTasks[i].taskId)) ||
                    (abilityTasks[i].taskName !== '' &&
                        !nameAndNumAndSpecialStringAndSpaceReg.test(
                            abilityTasks[i].taskName
                        )) ||
                    (abilityTasks[i].taskGroupType !== '' &&
                        !taskGroupTypeReg.test(abilityTasks[i].taskGroupType))
                ) {
                    throw new ParameterException('수행가능 과제 정보 ');
                }
                // if (
                //     !abilityTasks[i].taskId ||
                //     !idReg.test(abilityTasks[i].taskId)
                // ) {
                //     throw new ParameterException('과제 아이디 ');
                // } else {
                //     abilityTasks[i].taskId = Number(abilityTasks[i].taskId);
                // }
                // if (
                //     !abilityTasks[i].taskName ||
                //     !nameAndNumAndSpecialStringAndSpaceReg.test(
                //         abilityTasks[i].taskName
                //     )
                // ) {
                //     throw new ParameterException('과제명 ');
                // }
                // if (
                //     !abilityTasks[i].taskGroupType ||
                //     !taskGroupTypeReg.test(abilityTasks[i].taskGroupType)
                // ) {
                //     throw new ParameterException('과제 그룹 아이디 ');
                // }
            }
            this._abilityTasks = abilityTasks;
        }
    }
    // academicBackground
    // "academicBackground":{"finalAcademicType":0,"schoolName":"이지시큐대학","majorName":"정보보안학과",
    //     "graduationClassificationType":0, "admissionDate": "2020/01/01", "graduateDate": "2020/02/01"},
    get academicBackground() {
        return this._academicBackground;
    }
    set academicBackground(academicBackground) {
        if (!Object.keys(academicBackground).length) {
            this._academicBackground = academicBackground;
        } else {
            if (
                (academicBackground.finalAcademicType !== '' &&
                    !academicTypeReg.test(
                        academicBackground.finalAcademicType
                    )) ||
                (academicBackground.schoolName !== '' &&
                    !nameAndNumReg.test(academicBackground.schoolName)) ||
                (academicBackground.majorName !== '' &&
                    !nameAndNumReg.test(academicBackground.majorName)) ||
                (academicBackground.graduationClassificationType !== '' &&
                    !graduationTypeReg.test(
                        academicBackground.graduationClassificationType
                    )) ||
                (academicBackground.admissionDate !== '' &&
                    !dateReg.test(academicBackground.admissionDate)) ||
                (academicBackground.graduateDate !== '' &&
                    !dateReg.test(academicBackground.graduateDate))
            ) {
                throw new ParameterException('학력 정보');
            }
            this._academicBackground = academicBackground;
        }
    }
    // career
    // "career":[{"companyName":"무신사","position":"PM","assignedWork":"관리","joiningDate":"2021/02/01",
    //     "resignationDate":"2021/03/01"}],
    get career() {
        return this._career;
    }
    set career(career) {
        if (!career.length) {
            this._career = career;
        } else {
            for (let i = 0; i < career.length; i++) {
                if (
                    (career[i].companyName !== '' &&
                        !nameAndNumReg.test(career[i].companyName)) ||
                    (career[i].position !== '' &&
                        !nameAndNumReg.test(career[i].position)) ||
                    (career[i].assignedWork !== '' &&
                        !nameAndNumReg.test(career[i].assignedWork)) ||
                    (career[i].joiningDate !== '' &&
                        !dateReg.test(career[i].joiningDate)) ||
                    (career[i].resignationDate !== '' &&
                        !dateReg.test(career[i].resignationDate))
                ) {
                    throw new ParameterException('경력 정보 ');
                }
            }
            this._career = career;
        }
    }
    // license
    // "license":[{"licenseName":"CPPG","licenseNum":"123456789","issueInstitution":"정보보안학회",
    //     "issuedDate":"2020-12-01"}],
    get license() {
        return this._license;
    }
    set license(license) {
        if (!license.length) {
            this._license = license;
        } else {
            for (let i = 0; i < license.length; i++) {
                if (
                    (license[i].licenseName !== '' &&
                        !nameAndNumReg.test(license[i].licenseName)) ||
                    (license[i].licenseNum !== '' &&
                        !licenseNumReg.test(license[i].licenseNum)) ||
                    (license[i].issueInstitution !== '' &&
                        !nameAndNumReg.test(license[i].issueInstitution)) ||
                    (license[i].issuedDate !== '' &&
                        !dateReg.test(license[i].issuedDate))
                ) {
                    throw new ParameterException('자격증 정보 ');
                }
            }
            this._license = license;
        }
    }
    // projectHistory
    // "projectHistory":[{"projectName":"무신사쇼핑몰","assignedTask":"관리","industryCategoryId": 3,
    //     "industryCategoryName":"쇼핑몰","projectStartDate":"2021-02-01","projectEndDate":"2021-03-01"}],
    get projectHistory() {
        return this._projectHistory;
    }
    set projectHistory(projectHistory) {
        if (!projectHistory.length) {
            this._projectHistory = projectHistory;
        } else {
            for (let i = 0; i < projectHistory.length; i++) {
                if (
                    (projectHistory[i].projectName !== '' &&
                        !nameAndNumAndSpaceReg.test(
                            projectHistory[i].projectName
                        )) ||
                    (projectHistory[i].assignedTask !== '' &&
                        !nameReg.test(projectHistory[i].assignedTask)) ||
                    (projectHistory[i].industryCategoryId !== '' &&
                        !idReg.test(projectHistory[i].industryCategoryId)) ||
                    (projectHistory[i].industryCategoryName !== '' &&
                        !nameReg.test(
                            projectHistory[i].industryCategoryName
                        )) ||
                    (projectHistory[i].projectStartDate !== '' &&
                        !dateReg.test(projectHistory[i].projectStartDate)) ||
                    (projectHistory[i].projectEndDate !== '' &&
                        !dateReg.test(projectHistory[i].projectEndDate))
                ) {
                    throw new ParameterException('수행 이력 정보 ');
                }
            }
            this._projectHistory = projectHistory;
        }
    }
    // etc":{"etcCertifications":"iso27001","etcIndustries":"병원"}}
    get etc() {
        return this._etc;
    }
    set etc(etc) {
        if (!Object.keys(etc).length) {
            this._etc = etc;
        } else {
            if (
                (etc.etcCertifications !== '' &&
                    !nameAndNumAndSpaceReg.test(etc.etcCertifications)) ||
                (etc.etcIndustries !== '' && !nameReg.test(etc.etcIndustries))
            ) {
                throw new ParameterException('기타 입력 정보 ');
            }

            this._etc = etc;
        }
    }
};

//  // abilityCertifications
//  get abilityCertifications() {
//     return this._abilityCertifications;
// }
// set abilityCertifications(abilityCertifications) {
//     if (!abilityCertifications.length) {
//         this._abilityCertifications = abilityCertifications;
//     } else {
//         for (let i = 0; i < abilityCertifications.length; i++) {
//             if (
//                 (abilityCertifications[i].certificationId !== '' &&
//                     !idReg.test(
//                         abilityCertifications[i].certificationId
//                     )) ||
//                 (abilityCertifications[i].certificationName !== '' &&
//                     !nameAndNumAndSpecialStringReg.test(
//                         abilityCertifications[i].certificationName
//                     ))
//             ) {
//                 throw new ParameterException('인증 구분 정보 ');
//             }
//         }
//         this._abilityCertifications = abilityCertifications;
//     }
// }
// // abilityIndustries
// // "abilityIndustries":[{"industryId":2,"industryName":"쇼핑몰"}],
// get abilityIndustries() {
//     return this._abilityIndustries;
// }
// set abilityIndustries(abilityIndustries) {
//     let regIndustryName = /^[0-9a-zA-Z가-힣!@#$%^&+=_-]+$/; //
//     console.log('tttttt-abilityIndustries', abilityIndustries);
//     if (!abilityIndustries.length) {
//         this._abilityIndustries = abilityIndustries;
//     } else {
//         for (let i = 0; i < abilityIndustries.length; i++) {
//             if (
//                 (abilityIndustries[i].industryId !== '' &&
//                     !idReg.test(abilityIndustries[i].industryId)) ||
//                 (abilityIndustries[i].industryName !== '' &&
//                     !regIndustryName.test(
//                         abilityIndustries[i].industryName
//                     ))
//             ) {
//                 throw new ParameterException('수행가능 업종 정보 ');
//             }
//         }
//         this._abilityIndustries = abilityIndustries;
//     }
// }
// // abilityTasks
// // "abilityTasks":[{"taskId":3,"taskName":"세부과제1","taskGroupType":1}],
// get abilityTasks() {
//     return this._abilityTasks;
// }
// set abilityTasks(abilityTasks) {
//     let regTaskId = /^[0-9]+$/; // 숫자
//     let regTaskName = /^[0-9a-zA-Z가-힣!@#$%^&+=_-]+$/; // 영어/한글/특수문자
//     let regTaskGroupType = /^[0-3]$/;
//     console.log('tttttt-abilityTasks', abilityTasks);
//     if (!abilityTasks.length) {
//         this._abilityTasks = abilityTasks;
//     } else {
//         for (let i = 0; i < abilityTasks.length; i++) {
//             if (
//                 (abilityTasks[i].taskId !== '' &&
//                     !regTaskId.test(abilityTasks[i].taskId)) ||
//                 (abilityTasks[i].taskName !== '' &&
//                     !regTaskName.test(abilityTasks[i].taskName)) ||
//                 (abilityTasks[i].taskGroupType !== '' &&
//                     !regTaskGroupType.test(abilityTasks[i].taskGroupType))
//             ) {
//                 throw new ParameterException('수행가능 과제 정보 ');
//             }
//         }
//         this._abilityTasks = abilityTasks;
//     }
// }
// // academicBackground
// // "academicBackground":{"finalAcademicType":0,"schoolName":"이지시큐대학","majorName":"정보보안학과",
// //     "graduationClassificationType":0, "admissionDate": "2020/01/01", "graduateDate": "2020/02/01"},
// get academicBackground() {
//     return this._academicBackground;
// }
// set academicBackground(academicBackground) {
//     let regAcademicType = /^[0-1]$/;
//     let regSchoolName = /^[0-9a-zA-Z가-힣]{0,20}$/; //  한글/영어/숫자 20글자 제한
//     let regMajorName = /^[0-9a-zA-Z가-힣]{0,20}$/; //  한글/영어/숫자 20글자 제한
//     let regGraduationType = /^[0-7]$/;
//     let regSelectDate = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/;
//     console.log('tttttt-academicBackground', academicBackground);
//     if (!Object.keys(academicBackground).length) {
//         this._academicBackground = academicBackground;
//     } else {
//         if (
//             (academicBackground.finalAcademicType !== '' &&
//                 !regAcademicType.test(
//                     academicBackground.finalAcademicType
//                 )) ||
//             (academicBackground.schoolName !== '' &&
//                 !regSchoolName.test(academicBackground.schoolName)) ||
//             (academicBackground.majorName !== '' &&
//                 !regMajorName.test(academicBackground.majorName)) ||
//             (academicBackground.graduationClassificationType !== '' &&
//                 !regGraduationType.test(
//                     academicBackground.graduationClassificationType
//                 )) ||
//             (academicBackground.admissionDate !== '' &&
//                 !regSelectDate.test(academicBackground.admissionDate)) ||
//             (academicBackground.graduateDate !== '' &&
//                 !regSelectDate.test(academicBackground.graduateDate))
//         ) {
//             throw new ParameterException('학력 정보');
//         }

//         this._academicBackground = academicBackground;
//     }
// }
// // career
// // "career":[{"companyName":"무신사","position":"PM","assignedWork":"관리","joiningDate":"2021/02/01",
// //     "resignationDate":"2021/03/01"}],
// get career() {
//     return this._career;
// }
// set career(career) {
//     let regCompanyName = /^[0-9a-zA-Z가-힣]{0,20}$/; // 한글/영어/숫자 20글자 제한
//     let regPosition = /^[0-9a-zA-Z가-힣]{0,20}$/; // 한글/영어/숫자 20글자 제한
//     let regAssignedWork = /^[0-9a-zA-Z가-힣]{0,20}$/; // 영어/한글/특수문자
//     let regSelectDate = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/; // 숫자4자리/숫자2자리/숫자2자리 ex)2020/01/01
//     console.log('tttttt-career', career);
//     if (!career.length) {
//         this._career = career;
//     } else {
//         for (let i = 0; i < career.length; i++) {
//             if (
//                 (career[i].companyName !== '' &&
//                     !regCompanyName.test(career[i].companyName)) ||
//                 (career[i].position !== '' &&
//                     !regPosition.test(career[i].position)) ||
//                 (career[i].assignedWork !== '' &&
//                     !regAssignedWork.test(career[i].assignedWork)) ||
//                 (career[i].joiningDate !== '' &&
//                     !regSelectDate.test(career[i].joiningDate)) ||
//                 (career[i].resignationDate !== '' &&
//                     !regSelectDate.test(career[i].resignationDate))
//             ) {
//                 throw new ParameterException('경력 정보 ');
//             }
//         }
//         this._career = career;
//     }
// }
// // license
// // "license":[{"licenseName":"CPPG","licenseNum":"123456789","issueInstitution":"정보보안학회",
// //     "issuedDate":"2020-12-01"}],
// get license() {
//     return this._license;
// }
// set license(license) {
//     let regLicenseName = /^[0-9a-zA-Z가-힣]{0,20}$/; // 한글/영어/숫자 20글자 제한
//     let regLicenseNum = /^[0-9a-zA-Z]+$/; // 영문/숫자 하나 이상
//     let regIssueInstitution = /^[0-9a-zA-Z가-힣]{0,20}$/; //  한글/영어/숫자 20글자 제한
//     let regSelectDate = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/;
//     console.log('tttttt-license', license);
//     if (!license.length) {
//         this._license = license;
//     } else {
//         for (let i = 0; i < license.length; i++) {
//             if (
//                 (license[i].licenseName !== '' &&
//                     !regLicenseName.test(license[i].licenseName)) ||
//                 (license[i].licenseNum !== '' &&
//                     !regLicenseNum.test(license[i].licenseNum)) ||
//                 (license[i].issueInstitution !== '' &&
//                     !regIssueInstitution.test(
//                         license[i].issueInstitution
//                     )) ||
//                 (license[i].issuedDate !== '' &&
//                     !regSelectDate.test(license[i].issuedDate))
//             ) {
//                 throw new ParameterException('자격증 정보 ');
//             }
//         }
//         this._license = license;
//     }
// }
// // projectHistory
// // "projectHistory":[{"projectName":"무신사쇼핑몰","assignedTask":"관리","industryCategoryId": 3,
// //     "industryCategoryName":"쇼핑몰","projectStartDate":"2021-02-01","projectEndDate":"2021-03-01"}],
// get projectHistory() {
//     return this._projectHistory;
// }
// set projectHistory(projectHistory) {
//     let regHistoryName = /^[0-9a-zA-Z가-힣]{0,20}$/; //  한글/영어/숫자 20글자 제한
//     let regTaskName = /^[0-9a-zA-Z가-힣]{0,20}$/; //  한글/영어/숫자 20글자 제한
//     let regIndustryCategoryId = /^[0-9]+$/; // 숫자 하나 이상
//     let regIndustryCategoryName = /^[0-9a-zA-Z가-힣]{0,20}$/; //  한글/영어/숫자 20글자 제한
//     let regSelectDate = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/;
//     console.log('ttttttttttttttttttttt0-projectHistory', projectHistory);
//     if (!projectHistory.length) {
//         this._projectHistory = projectHistory;
//     } else {
//         for (let i = 0; i < projectHistory.length; i++) {
//             if (
//                 (projectHistory[i].projectName !== '' &&
//                     !regHistoryName.test(projectHistory[i].projectName)) ||
//                 (projectHistory[i].assignedTask !== '' &&
//                     !regTaskName.test(projectHistory[i].assignedTask)) ||
//                 (projectHistory[i].industryCategoryId !== '' &&
//                     !regIndustryCategoryId.test(
//                         projectHistory[i].industryCategoryId
//                     )) ||
//                 (projectHistory[i].industryCategoryName !== '' &&
//                     !regIndustryCategoryName.test(
//                         projectHistory[i].industryCategoryName
//                     )) ||
//                 (projectHistory[i].projectStartDate !== '' &&
//                     !regSelectDate.test(
//                         projectHistory[i].projectStartDate
//                     )) ||
//                 (projectHistory[i].projectEndDate !== '' &&
//                     !regSelectDate.test(projectHistory[i].projectEndDate))
//             ) {
//                 throw new ParameterException('수행 이력 정보 ');
//             }
//         }
//         this._projectHistory = projectHistory;
//     }
// }
// // etc":{"etcCertifications":"iso27001","etcIndustries":"병원"}}
// get etc() {
//     return this._etc;
// }
// set etc(etc) {
//     let regEtcCertification = /^[0-9a-zA-Z가-힣]{0,10}$/; // 한글/영어/숫자 10글자 제한
//     let regEtcIndustry = /^[0-9a-zA-Z가-힣]{0,10}$/; //한글/영어/숫자 10글자 제한
//     console.log('tttttt-etc', etc);
//     if (!Object.keys(etc).length) {
//         this._etc = etc;
//     } else {
//         if (
//             (etc.etcCertifications !== '' &&
//                 !regEtcCertification.test(etc.etcCertifications)) ||
//             (etc.etcIndustries !== '' &&
//                 !regEtcIndustry.test(etc.etcIndustries))
//         ) {
//             throw new ParameterException('기타 입력 정보 ');
//         }

//         this._etc = etc;
//     }
// }
