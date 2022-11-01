const AuthAdapter = require('./AuthAdapter');
const MyAdapter = require('./MyAdapter');
const ClientsAdapter = require('./clients/ClientsAdapter');
const VouchersAdapter = require('./clients/VouchersAdapter');
const ClientCompaniesAdapter = require('./clients/ClientCompaniesAdapter');
const ConsultantsAdapter = require('./consultants/ConsultantsAdapter');
const ProfilesAdapter = require('./ProfilesAdapter');
const TempProfilesAdapter = require('./TempProfilesAdapter');
const TempUploadFilesAdapter = require('./TempUploadFilesAdapter');
const StorageAdapter = require('./StorageAdapter');
const InfoAdapter = require('./InfoAdapter');
const SettingsAdapter = require('./SettingsAdapter');
const BoardsAdapter = require('./BoardsAdapter');
const ServicesAdapter = require('./ServicesAdapter');

//exam
const ExamInfoAdapter = require('./exam/ExamInfoAdapter');
const ExamLicenseIssuanceAdapter = require('./exam/ExamLicenseIssuanceAdapter');
const ExamReceptionsAdapter = require('./exam/ExamReceptionsAdapter');
// project
const ProjectsAdapter= require('./ProjectsAdapter')

// const ConsultantCompaniesAdapter = require('./consultant/ConsultantCompaniesAdapter');
// const UserAdapter = require('./UserAdapter');
// const CompanyAdapter = require('./CompanyAdapter');
// const ProfileAdapter = require('./ProfileAdapter');

const {
    projectService,
    adminService,
} = require('../../infrastructure/otherServer');

module.exports = {
    // 타 서버
    servicesAdapter: new ServicesAdapter(),
    // 인증
    authAdapter: new AuthAdapter(),
    storageAdapter: new StorageAdapter(),
    // 내 정보
    myAdapter: new MyAdapter(),
    // 클라이언트
    clientsAdapter: new ClientsAdapter(),
    vouchersAdapter: new VouchersAdapter(),
    clientCompaniesAdapter: new ClientCompaniesAdapter(
        projectService,
        adminService
    ),
    // 컨설턴트
    consultantsAdapter: new ConsultantsAdapter(),
    // 프로필
    profilesAdapter: new ProfilesAdapter(),
    tempProfilesAdapter: new TempProfilesAdapter(), // 프로필 임시저장
    tempUploadFilesAdapter: new TempUploadFilesAdapter(),

    // admin서버 요청 처리 --------------------
    infoAdapter: new InfoAdapter(), // 기본(원시) 정보 : 지역/세부지역/업종 등
    settingsAdapter: new SettingsAdapter(), // 설정 정보 : 인증/과제/산출물 등
    boardsAdapter: new BoardsAdapter(), // 각 게시판 정보 : 공지사항/교육게시판/정보보안
    // 시험
    examInfoAdapter: new ExamInfoAdapter(),
    examLicenseIssuanceAdapter: new ExamLicenseIssuanceAdapter(),
    examReceptionsAdapter: new ExamReceptionsAdapter(),
    // consultantCompaniesAdapter: new ConsultantCompaniesAdapter(
    //     projectService,
    //     adminService
    // ),

    // project서버 요청 처리 ---------------------
    projectsAdapter: new ProjectsAdapter(),
};
