// module.exports = class DeleteProject {
//     constructor(repository) {
//         this.repository = repository;
//     }
//     async excute(projectData) {
//         try {
//             const { projectsRepository } = this.repository;

//             const projectsEntity = new ProjectsEntity(projectData);
//             await projectsRepository.getProjectList(projectsEntity);
//             return;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// };
