const ServicesAdapter = require('./ServicesAdapter');
const AuthAdapter = require('./AuthAdapters');
const MyAdapter = require('./MyAdapter');
const ClientsAdapter = require('./clients/ClientsAdapter');
const VouchersAdapter = require('./clients/VouchersAdapter');
const ClientUsersAdapter = require('./clients/ClientUsersAdapter');
const ClientCompaniesAdapter = require('./clients/ClientCompaniesAdapter');
const ConsultantUsersAdapter = require('./consultants/ConsultantUsersAdapter');
const ProfilesAdapter = require('./ProfilesAdapter');
const TempProfilesAdapter = require('./TempProfilesAdapter');
const TempUploadFilesAdapter = require('./TempUploadFilesAdapter');
const StorageAdapter = require('./StorageAdapter');
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
    clientUsersAdapter: new ClientUsersAdapter(),
    clientCompaniesAdapter: new ClientCompaniesAdapter(
        projectService,
        adminService
    ),
    // 컨설턴트
    consultantUsersAdapter: new ConsultantUsersAdapter(),
    // 프로필
    profilesAdapter: new ProfilesAdapter(),
    tempProfilesAdapter: new TempProfilesAdapter(), // 프로필 임시저장
    tempUploadFilesAdapter: new TempUploadFilesAdapter(),

    // consultantCompaniesAdapter: new ConsultantCompaniesAdapter(
    //     projectService,
    //     adminService
    // ),
    // userAdapter: new UserAdapter(projectService, adminService),
    // companyAdapter: new CompanyAdapter(projectService, adminService),
    // profileAdapter: new ProfileAdapter(projectService, adminService),
};
