// const ServiceAuthAdapter = require('./ServiceAuthAdapters');
const AuthAdapter = require('./AuthAdapter');
const MyAdapter = require('./MyAdapter');
const ClientUsersAdapter = require('./client/ClientUsersAdapter');
const ClientCompaniesAdapter = require('./client/ClientCompaniesAdapter');
const ConsultantUsersAdapter = require('./consultant/ConsultantUsersAdapter');
const ProfilesAdapter = require('./ProfilesAdapter');
const TempProfilesAdapter = require('./TempProfilesAdapter');
const TempUploadFilesAdapter = require('./TempUploadFilesAdapter');
// const ConsultantCompaniesAdapter = require('./consultant/ConsultantCompaniesAdapter');
// const UserAdapter = require('./UserAdapter');
// const CompanyAdapter = require('./CompanyAdapter');
// const ProfileAdapter = require('./ProfileAdapter');

const {
    projectService,
    adminService,
} = require('../../infrastructure/services');

module.exports = {
    // 인증
    authAdapter: new AuthAdapter(projectService, adminService),
    // 내 정보
    myAdapter: new MyAdapter(projectService, adminService),
    // 클라이언트
    clientUsersAdapter: new ClientUsersAdapter(projectService, adminService),
    clientCompaniesAdapter: new ClientCompaniesAdapter(
        projectService,
        adminService
    ),
    // 컨설턴트
    consultantUsersAdapter: new ConsultantUsersAdapter(
        projectService,
        adminService
    ),
    // 프로필
    profilesAdapter: new ProfilesAdapter(projectService, adminService),
    tempProfilesAdapter: new TempProfilesAdapter(projectService, adminService), // 프로필 임시저장
    tempUploadFilesAdapter: new TempUploadFilesAdapter(),

    // consultantCompaniesAdapter: new ConsultantCompaniesAdapter(
    //     projectService,
    //     adminService
    // ),
    // userAdapter: new UserAdapter(projectService, adminService),
    // companyAdapter: new CompanyAdapter(projectService, adminService),
    // profileAdapter: new ProfileAdapter(projectService, adminService),
    // serviceAuthAdapter: new ServiceAuthAdapter(projectService, adminService),
};
