const ServiceAuthAdapter = require('./ServiceAuthAdapters');
const AuthAdapter = require('./AuthAdapter');
const UserAdapter = require('./UserAdapter');
const CompanyAdapter = require('./CompanyAdapter');
const ProfileAdapter = require('./ProfileAdapter');

const {
    projectService,
    adminService,
} = require('../../infrastructure/services');

module.exports = {
    serviceAuthAdapter: new ServiceAuthAdapter(projectService, adminService),
    authAdapter: new AuthAdapter(projectService, adminService),
    userAdapter: new UserAdapter(projectService, adminService),
    companyAdapter: new CompanyAdapter(projectService, adminService),
    profileAdapter: new ProfileAdapter(projectService, adminService),
};
