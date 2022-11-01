// module.exports = class GetProject {
//     constructor(repository) {
//         this.repository = repository;
//     }
//     async excute(projectData) {
//         try {
//             const { projectsRepository } = this.repository;

//             const projectsEntity = new ProjectsEntity(projectData);
//             const projectInfo = await projectsRepository.getProject(
//                 projectsEntity
//             );
//             return projectInfo;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// };
