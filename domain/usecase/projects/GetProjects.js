// module.exports = class GetProjects {
//     constructor(repository) {
//         this.repository = repository;
//     }
//     async excute(projectData) {
//         try {
//             const { projectsRepository } = this.repository;

//             const projectsEntity = new ProjectsEntity(projectData);
//             const projectsInfo = await projectsRepository.getProjects(
//                 projectsEntity
//             );

//             return projectsInfo;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// };
